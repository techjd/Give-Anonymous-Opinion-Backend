const mongoose = require('mongoose');

const opinionSchema = mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const Opinions = mongoose.model('Texts', opinionSchema);

module.exports = Opinions;
