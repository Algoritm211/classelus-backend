const User = require('../models/User')
const bcrypt = require('bcryptjs')
const consola = require('consola')
const cloudinary = require('../cloudinary/cloudinary.config').v2

class UserController {
  async updateUser(req, res) {
    try {
      // all fields in update updateObj must be named like User model fields
      const updateObj = req.body
      if (updateObj.password) {
        updateObj.password = await bcrypt.hash(updateObj.password, 8)
      }
      const user = await User.findOneAndUpdate(
        { _id: req.user.id },
        updateObj,
        { new: true },
      )
      return res.status(200).json({ user })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Error. Can not update user' })
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params
      const user = await User.findOne({ _id: id }).populate('courses')
      console.log(user)
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Can not get user' })
    }
  }

  async uploadAvatar(req, res) {
    try {
      const { photo } = req.files
      cloudinary.uploader
        .upload_stream({ resource_type: 'auto' }, async (error, result) => {
          if (error || !result) {
            return res.status(500).json({
              status: 'error',
              message: error || 'upload error',
            })
          }
          const user = await User.findOne({ _id: req.user.id })
          user.avatar = {
            url: result.url,
            name: result.public_id,
          }
          await user.save()
          res.status(201).json({
            user,
          })
        }).end(photo.data)
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Can not upload avatar' })
    }
  }

  async deleteAvatar(req, res) {
    try {
      const user = await User.findOne({ _id: req.user.id })
      await cloudinary.uploader.destroy(user.avatar.name, async (error, result) => {
        if (error || !result) {
          return res.status(500).json({
            status: 'error',
            message: error || 'upload error',
          })
        }
        user.avatar = { url: '', name: '' }
        await user.save()
        return res.status(200).json({ message: 'Deleting successfully', user: user })
      })
    } catch (error) {
      consola.error(error)
      return res.status(500).json({ message: 'Error while deleting avatar' })
    }
  }

  async deleteAccount(req, res) {
    try {
      const user = await User.findOne({ _id: req.user.id })
      await user.remove()
      return res.status(200).json({ message: 'Deleted successfully' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Can not delete account' })
    }
  }
}

module.exports = new UserController()
