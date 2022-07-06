const { model, Schema, ObjectId } = require('mongoose')

const MasterClass = new Schema({
  creator: { type: ObjectId, ref: 'User', required: true },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  video: { type: String, default: '' },
  likes: { type: Number, default: 0 },
  creationDate: { type: Date, default: new Date().toISOString() },
})

module.exports = model('MasterClass', MasterClass)
