const consola = require('consola')
const MasterClass = require('../models/MasterClass')
const User = require('../models/User')

class MasterClassController {
  async create(req, res) {
    try {
      const userId = req.user.id
      const { title, description, video } = req.body
      const masterClass = new MasterClass({
        creator: userId,
        title,
        description,
        video,
      })
      const user = await User.findOne({ _id: req.user.id })
      user.masterClassAuthor.push(masterClass._id)
      await user.save()
      await masterClass.save()
      return res.status(201).json({
        data: masterClass,
      })
    } catch (error) {
      consola.error('Something went wrong while creating masterclass')
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params
      const masterClass = await MasterClass.findOne({ _id: id }).populate('creator')
      return res.status(200).json({
        data: masterClass,
      })
    } catch (error) {
      consola.error('Something went wrong while getting masterclass by id')
    }
  }

  async getAll(req, res) {
    try {
      const masterClasses = await MasterClass.find({})
      return res.status(200).json({
        data: masterClasses,
      })
    } catch (error) {
      consola.error('Something went wrong while getting all masterclasses')
    }
  }
}


module.exports = new MasterClassController()
