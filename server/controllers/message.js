const asyncHandler = require('express-async-handler');
const User = require('../models/user.js');
const Message = require('../models/message.js');
const Chat = require('../models/chat.js');

exports.sendMessage = asyncHandler(async (req, res) => {
  const { chatId, content } = req.body;
  try {
    if (!chatId || !content) {
      return res.status(400).json({
        success: false,
        msg: !chatId ? 'Chat not found!' : 'Message is empty!',
      });
    }
    // check if chat exist or not 
    const chat = await Chat.findOne({
      _id: chatId,
      users: { $elemMatch: { $eq: req.user._id } },
    })
    if(!chat) {
      return res.status(400).json({
        success: false,
        msg: "Chat not found!"
      })
    }
    // check if content is valid message or not
    const messageText = content ? content.trim() : null;
    if(!messageText || !messageText.length){
      return res.status(400).json({
        success: false,
        msg: "Invalid message!"
      })
    }
    let message = await Message.create({
      sender: req.user._id,
      content: content,
      chat: chatId,
    });
    message = await message.populate('sender', 'name userPic');
    message = await message.populate('chat');
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'name userPic email',
    });
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    return res.json({
      success: true,
      message,
    });
  } catch (err) {
    console.error('error while sending message, ', err);
    return res.status(409).json({
      success: false,
      msg: 'Something went wrong!',
      err,
    });
  }
});

exports.getAllMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  try {
    if(!chatId) {
      return res.status(400).json({
        success: false,
        msg: "Chat not found",
      });
    }
    // check if chat exist or not
    // and if user is a member of chat or not
    const chat = await Chat.findOne({
      _id: chatId,
      users: { $elemMatch: { $eq: req.user._id } },
    })
    if(!chat) {
      return res.status(400).json({
        success: false,
        msg: "Chat not found!"
      })
    }
    const messages = await Message.find({ chat: chatId }).populate("sender", "name userPic email").populate("chat");
    return res.json({
      success: true,
      messages
    })
  } catch (err) {
    console.error('error while sending message, ', err);
    return res.status(409).json({
      success: false,
      msg: 'Something went wrong!',
      err,
    });
  }
});
