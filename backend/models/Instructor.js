const mongoose = require('mongoose')

const instructorSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    maxlength: 70
  },
  email: {
    type: String,
    required: true,
    maxlength: 70
  }
})

module.exports = mongoose.model('Instructor', instructorSchema)