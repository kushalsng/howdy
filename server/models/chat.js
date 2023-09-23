const mongoose = require("mongoose");

const chatSchema = mongoose.Schema({
    name: {
      type: String,
      trim: true,
    },
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    groupPic: {
      type: String,
    }
  }, { timestamps: true })

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
