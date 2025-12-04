import models from '../models/index.js'
import { AppError } from '../utils/error.js'
import { Op } from 'sequelize'
import { STATUS_ID, ROLE_ID } from '../constants/index.js'
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
      ...(fk_status_id && { fk_status_id }),
      ...(id && { id }),
      ...(priority && { priority }),
      ...(name && { name: { [Op.like]: `%${name}%` } }),
    },
    order: [['id', 'DESC']],
  })

  return data
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

    const reportsShared = await ReportShared.findAll({
      where: {
        fk_report_id: report.id,
      },
      transaction,
    })

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
