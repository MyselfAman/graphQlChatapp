const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
  message:  {
    type: String,
    default: null
  },
  userName:{
    type:String,
    default: null
  }
});

module.exports = mongoose.model('user', chatSchema);