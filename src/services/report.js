import models from '../models/index.js'
import { AppError } from '../utils/error.js'
import { Op, Sequelize } from 'sequelize'
import { STATUS_ID, ROLE_ID, REPORT_TYPE_ID } from '../constants/index.js'
import { sendMail } from '../lib/mailer.js'
import { config } from '../../boot/index.js'
import fs from 'fs'
import path from 'path'
import { now } from 'sequelize/lib/utils'

const { Report, Regulator, Status, User, Role, ReportShared } = models

export async function getAllReports({
  fk_user_id,
  fk_report_type_id,
  fk_status_id,
  id,
  name,
  priority,
  is_manager,
  ids,
}) {
  const isAuditor = fk_user_id && fk_report_type_id && !fk_status_id

  const data = await Report.findAndCountAll({
    include: [
      {
        model: Regulator,
        as: 'regulator',
      },
      {
        model: Status,
        as: 'status',
      },
      {
        model: User,
        as: 'user',
      },
    ],
    where: {
      disable: false,
      ...(isAuditor && { fk_auditor_id: fk_user_id }),
      ...(fk_report_type_id && { fk_report_type_id }),
      ...(is_manager && { fk_report_type_id: REPORT_TYPE_ID.AUDIT }),
      ...(fk_status_id && { fk_status_id }),
      ...(id && { id }),
      ...(ids && {
        id: {
          [Op.in]: ids,
        },
      }),
      ...(priority && { priority }),
      ...(name && { name: { [Op.like]: `%${name}%` } }),
    },
    order: [['id', 'DESC']],
  })

  return data
}

export async function countStatus({ fk_auditor_id }) {
  const statusIds = {
    2: 0,
    3: 0,
    4: 0,
  }

  const totals = await Report.findAll({
    attributes: [
      'fk_status_id',
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'total'],
    ],
    where: {
      fk_report_type_id: REPORT_TYPE_ID.AUDIT,
      ...(fk_auditor_id && { fk_auditor_id }),
    },
    group: ['fk_status_id'],
  })

  for (const tot of totals) {
    const { fk_status_id, total } = tot.dataValues

    if (fk_status_id in statusIds) {
      statusIds[fk_status_id] += total
    }
  }

  return statusIds
}

export async function getReportById({ id, fk_auditor_id }) {
  const report = await Report.findOne({
    where: { id, disable: false },
  })

  if (!report) {
    throw new AppError({ message: 'No report found', status: 404 })
  }
  return report
}

export async function createReport({ payload, transaction }) {
  return Report.create(payload, { transaction })
}

export async function updateReport({
  id,
  fk_auditor_id,
  payload,
  transaction,
}) {
  const report = await getReportById({ id, fk_auditor_id })
  await report.update(payload, { transaction })
  return report
}

export async function sendRequest({ id, fk_auditor_id, payload, transaction }) {
  const { request_type, reason } = payload

  const report = await getReportById({ id })
  const auditor = await report.getUser()
  const manager = await User.findOne({
    include: [
      {
        model: Role,
        as: 'roles',
        where: {
          id: ROLE_ID.MANAGER,
        },
      },
    ],
  })

  if (!manager) {
    throw new AppError({ message: 'No manager found', status: 404 })
  }

  const mailOptions = {
    name: 'AuditPro',
    from: config.mail.from,
    to: auditor.email,
    subject: '',
    html: null,
  }

  if (request_type == 'AUDITOR_REQUEST_REVIEW') {
    await report.update(
      {
        fk_status_id: STATUS_ID.WAITING_FOR_REVIEW,
        requested_review_at: now(),
      },
      { transaction }
    )

    const reportsShared = await ReportShared.findAll(
      {
        where: {
          fk_report_id: report.id,
        },
      },
      { transaction }
    )

    if (reportsShared.length) {
      await ReportShared.destroy(
        {
          where: {
            fk_report_id: report.id,
          },
        },
        { transaction }
      )
      await ReportShared.create(
        {
          fk_report_id: report.id,
          fk_user_to_id: manager.id,
        },
        { transaction }
      )
    } else {
      await ReportShared.create(
        {
          fk_report_id: report.id,
          fk_user_to_id: manager.id,
        },
        { transaction }
      )
    }

    mailOptions.to = manager.email
    mailOptions.subject = `Request for Document Report Review: ${report.name}`
    mailOptions.html = generateReportMailTemplate({
      isAuditorRequestReview: true,
      auditor,
      manager,
      report,
    })
  }

  if (request_type == 'MANAGER_APPORVED') {
    await report.update({ fk_status_id: STATUS_ID.APPROVED }, { transaction })
    mailOptions.subject = `Document Report Approved: ${report.name}`
    mailOptions.html = generateReportMailTemplate({
      isApproved: true,
      auditor,
      manager,
      report,
    })
  }

  if (request_type == 'MANAGER_REJECTED') {
    await report.update({ fk_status_id: STATUS_ID.REJECTED }, { transaction })
    mailOptions.subject = `Document Report Rejected: ${report.name}`
    mailOptions.html = generateReportMailTemplate({
      isApproved: false,
      auditor,
      manager,
      report,
      ...(reason && { reason }),
    })
  }

  await sendMail(mailOptions)

  return report
}

export function generateReportMailTemplate({
  isApproved = false,
  isAuditorRequestReview = false,
  auditor,
  manager,
  report,
  reason = '',
}) {
  let templateName = isApproved
    ? 'approved_report_template.xml'
    : 'rejected_report_template.xml'

  if (isAuditorRequestReview) {
    templateName = 'request_review_report_template.xml'
  }

  const templatePath = path.join(
    process.cwd(),
    'src/assets/mail-templates',
    templateName
  )

  let template = fs.readFileSync(templatePath, 'utf8')

  // Replace variables
  template = template
    .replace(/\$\{FIRST_NAME\}/g, auditor.first_name)
    .replace(/\$\{LAST_NAME\}/g, auditor.last_name)
    .replace(/\$\{MANAGER_FIRST_NAME\}/g, manager.first_name)
    .replace(/\$\{MANAGER_LAST_NAME\}/g, manager.last_name)
    .replace(/\$\{DOCUMENT_ID\}/g, report.id)
    .replace(/\$\{DOCUMENT_TITLE\}/g, report.name)
    .replace(/\$\{FRONTEND_BASE_URL\}/g, config.frontendBaseURL)

  if (!!reason) {
    template = template.replace(
      /\$\{REASON\}/g,
      `Reason: "<strong>${reason}</strong>".`
    )
  } else {
    template = template.replace(/\$\{REASON\}/g, '')
  }

  return template
}

export async function deleteReport({ id, fk_auditor_id, transaction }) {
  const report = await getReportById({ id, fk_auditor_id })
  await report.update({ disable: true }, { transaction })
}

/*
 * Risk calculation logic
 */
function calculateRiskScore(report) {
  const today = new Date()
  const startDate = new Date(report.start_date)
  const endDate = new Date(report.due_date)

  const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24))
  const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
  const elapsedDays = totalDays - daysRemaining
  const expectedProgress = (elapsedDays / totalDays) * 100

  const progressGap = expectedProgress - report.progress
  const priorityWeight = {
    critical: 2.0,
    high: 1.5,
    medium: 1.0,
    low: 0.5,
  }

  let riskScore = 0

  if (progressGap > 30) riskScore += 40
  else if (progressGap > 20) riskScore += 30
  else if (progressGap > 10) riskScore += 20
  else if (progressGap > 0) riskScore += 10

  if (daysRemaining < 0) riskScore += 30
  else if (daysRemaining <= 3) riskScore += 25
  else if (daysRemaining <= 7) riskScore += 20
  else if (daysRemaining <= 14) riskScore += 10

  riskScore += 20 * (priorityWeight[report.priority] / 2)

  const requiredVelocity = (100 - report.progress) / Math.max(daysRemaining, 1)
  if (requiredVelocity > 10) riskScore += 10
  else if (requiredVelocity > 5) riskScore += 5

  return Math.min(Math.round(riskScore), 100)
}

/*
 * Get risk level
 */
function getRiskLevel(score) {
  if (score >= 70) return { level: 'critical', label: 'Critical Risk' }
  if (score >= 50) return { level: 'high', label: 'High Risk' }
  if (score >= 30) return { level: 'medium', label: 'Medium Risk' }
  return { level: 'low', label: 'Low Risk' }
}

/*
 * Notification generator
 */
export async function generateNotifications({ fk_auditor_id }) {
  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

  const reports = await Report.findAll({
    where: {
      fk_auditor_id,
      fk_report_type_id: {
        [Op.in]: [REPORT_TYPE_ID.DRAFT, REPORT_TYPE_ID.PRIMARY],
      },
      created_at: {
        [Op.gte]: oneMonthAgo,
      },
    },
  })

  const today = new Date()
  const alerts = []
  const countRisks = {
    critical: {
      total: 0,
      report_ids: [],
    },
    high: {
      total: 0,
      report_ids: [],
    },
    medium: {
      total: 0,
      report_ids: [],
    },
    low: {
      total: 0,
      report_ids: [],
    },
  }

  reports.forEach((report) => {
    const score = calculateRiskScore(report)
    const risk = getRiskLevel(score)
    const endDate = new Date(report.due_date)
    const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24))

    countRisks[risk.level].total += 1 // risk.level = "critical", "high", "medium", and "low".
    countRisks[risk.level].report_ids.push(report.id)

    if (risk.level === 'critical' || risk.level === 'high') {
      alerts.push({
        id: report.id,
        type: risk.level,
        risk_score: score,
        message: `"${report.name}" is at ${risk.label} (${daysRemaining} days remaining, ${report.progress}% complete)`,
        report,
      })
    }
  })

  return [countRisks, alerts]
}
