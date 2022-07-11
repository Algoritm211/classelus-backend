const consola = require('consola')
const MasterClass = require('../models/MasterClass')
const User = require('../models/User')

class MasterClassController {
  async create(req, res) {
    try {
      const userId = req.user.id
      const { title, description, videoURL } = req.body
      const masterClass = new MasterClass({
        author: userId,
        title,
        description,
        videoURL,
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
      const masterClass = await MasterClass.findOne({ _id: id }).populate('author')
      return res.status(200).json({
        data: masterClass,
      })
    } catch (error) {
      consola.error('Something went wrong while getting masterclass by id')
    }
  }

  async getAll(req, res) {
    try {
      const masterClasses = await MasterClass.find({}).populate('author')
      return res.status(200).json({
        data: masterClasses,
      })
    } catch (error) {
      consola.error('Something went wrong while getting all masterclasses')
    }
  }

  async update(req, res) {
    try {
      const updateObj = {}

      for (const [key, value] of Object.entries(req.body)) {
        if (value !== undefined) {
          updateObj[key] = value
        }
      }
      const { id } = req.params
      const updatedMasterClass = await MasterClass.findOneAndUpdate(
        { _id: id },
        updateObj,
        { new: true },
      )
      return res.status(204).json({
        data: updatedMasterClass,
      })
    } catch (error) {
      consola.error('Something went wrong while updating masterclass')
    }
  }

  async like(req, res) {
    try {
      const { id } = req.params
      const masterClass = await MasterClass.findById(id)
      const user = await User.findOne({ _id: req.user.id })

      if (user.likedMasterClasses && user.likedMasterClasses.includes(id)) {
        masterClass.rating -= 1
        user.likedMasterClasses.remove(masterClass._id)
      } else {
        masterClass.rating += 1
        user.likedMasterClasses.push(masterClass._id)
      }

      await masterClass.save()
      await user.save()

      return res.status(201).json({
        masterClass: masterClass,
        user: user,
      })
    } catch (error) {
      consola.error('Something went in masterclass like process')
    }
  }
}


module.exports = new MasterClassController()
