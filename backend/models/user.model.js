const mongoose = require('mongoose')

const userschema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    uinque: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true })

const User = mongoose.model('User', userschema)
module.exports = User;