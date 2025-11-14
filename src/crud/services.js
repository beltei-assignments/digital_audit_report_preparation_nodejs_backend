import { sequelize } from '../../boot/index.js'
import { autoConvertObjValues } from '../utils/converter.js'

export default function initServices(tableName, config) {
  const model = sequelize.model(tableName)

  return { getAll, findByPk, create, update, destroy }

  async function getAll(req, res) {
    const filters = req.query ? autoConvertObjValues(req.query) : null

    const data = await model.findAll({
      ...(filters && { where: { ...filters } }),
    })

    res.send({
      success: true,
      data,
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
