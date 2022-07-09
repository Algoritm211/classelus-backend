const { model, Schema, ObjectId } = require('mongoose')

const MasterClass = new Schema({
  author: { type: ObjectId, ref: 'User', required: true },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  videoURL: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  creationDate: { type: Date, default: new Date().toISOString() },
})

module.exports = model('MasterClass', MasterClass)
