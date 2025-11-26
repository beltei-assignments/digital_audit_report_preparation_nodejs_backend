import { sequelize } from '../../boot/index.js'
import { autoConvertObjValues } from '../utils/converter.js'
import { paginate } from '../utils/paginate.js'
import { Op } from 'sequelize'

export default function initServices(tableName, config) {
  const model = sequelize.model(tableName)

  return { getAll, findByPk, create, update, destroy }

  async function getAll(req, res) {
    const { page, limit, name, ...filters } = req.query
      ? autoConvertObjValues(req.query)
      : null

    const { count, rows } = await model.findAndCountAll({
      ...(filters && {
        where: {
          ...(name && { name: { [Op.like]: `%${name}%` } }),
          ...filters,
          disable: false
        },
      }),
      order: [['id', 'DESC']],
      ...paginate({ page, limit }),
    })

    res.send({
      success: true,
      count,
      rows,
    })
  }

  async function findByPk(req, res) {
    const data = await model.findByPk(req.params.id)
    if (!data) {
      return res
        .status(404)
        .send({ success: false, message: `Not ${tableName} found.` })
    }

    return res.status(200).send({
      success: true,
      data,
    })
  }

  async function create(req, res) {
    const data = await model.create(req.body)

    res.send({
      success: true,
      data,
    })
  }

  async function update(req, res) {
    const data = await model.findByPk(req.params.id)
    if (!data) {
      return res
        .status(404)
        .send({ success: false, message: `Not ${tableName} found.` })
    }

    await data.update(req.body)

    return res.status(200).send({
      success: true,
      data,
    })
  }

  async function destroy(req, res) {
    const data = await model.findByPk(req.params.id)
    if (!data) {
      return res
        .status(404)
        .send({ success: false, message: `Not ${tableName} found.` })
    }

    const options = req.query ? autoConvertObjValues(req.query) : null
    if (options && options.is_permanent) {
      await data.destroy()
    } else {
      await data.update({
        disable: true,
      })
    }

    return res.status(200).send({
      success: true,
    })
  }
}
