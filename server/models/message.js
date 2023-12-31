const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    content: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      trim: true,
      default: 'text',
      required: true,
    },
    mediaUrl: {
      type: String,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
    },
    isGroupLog: {
      type: Boolean,
      default: false,
    },
    replyOfMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
