const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  chatHistory: [
    {
      message: String,
      time: {
        type: Date,
        default: Date.now,
      },
      metadata: {
        sender: String,
      },
    },
  ],
});

module.exports = mongoose.model('Conversation', conversationSchema);