const asyncHandler = require('express-async-handler');
const User = require('../models/user.js');
const Message = require('../models/message.js');
const Chat = require('../models/chat.js');

exports.sendMessage = asyncHandler(async (req, res) => {
  const { chatId, content, type, mediaUrl, replyOfMessageId } = req.body;
  try {
    if (!chatId || (!mediaUrl && !content)) {
      return res.status(400).json({
        success: false,
        msg: !chatId ? 'Chat not found!' : 'Message is empty!',
      });
    }
    // check if chat exist or not
    const chat = await Chat.findOne({
      _id: chatId,
      users: { $elemMatch: { $eq: req.user._id } },
    });
    if (!chat) {
      return res.status(400).json({
        success: false,
        msg: 'Chat not found!',
      });
    }
    // check if content is valid message or not
    if (content) {
      const messageText = content ? content.trim() : null;
      if (!messageText || !messageText.length) {
        return res.status(400).json({
          success: false,
          msg: 'Invalid message!',
        });
      }
    }
    const createMessageConditions = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };
    if (replyOfMessageId) {
      const replyOfMessage = await Message.findOne({
        _id: replyOfMessageId,
        isGroupLog: false,
        chat: chatId,
      });
      if (!replyOfMessage) {
        return res.status(400).json({
          success: false,
          msg: `Can't find the message you're replying to!`,
        });
      }
      createMessageConditions.replyOfMessage = replyOfMessageId;
    }
    if (mediaUrl) {
      createMessageConditions.mediaUrl = mediaUrl;
    }
    if (type) {
      createMessageConditions.type = type;
    }
    let message = await Message.create(createMessageConditions);
    message = await message.populate('sender', 'name userPic email');
    if (replyOfMessageId) {
      message = await message.populate('replyOfMessage');
      message = await Message.populate(message, {
        path: 'replyOfMessage.sender',
        select: 'name',
      });
    }
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
    if (!chatId) {
      return res.status(400).json({
        success: false,
        msg: 'Chat not found',
      });
    }
    // check if chat exist or not
    // and if user is a member of chat or not
    const chat = await Chat.findOne({
      _id: chatId,
      users: { $elemMatch: { $eq: req.user._id } },
    });
    if (!chat) {
      return res.status(400).json({
        success: false,
        msg: 'Chat not found!',
      });
    }
    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'name userPic email')
      .populate('chat');

    const replyMessageIds = messages
      .filter((message) => message.replyOfMessage)
      .map((message) => message.replyOfMessage);

    const replyMessages = await Message.find({
      _id: { $in: replyMessageIds },
      chat: chatId,
    }).populate('sender', 'name userPic email');

    messages.forEach((message) => {
      if (message.replyOfMessage) {
        message.replyOfMessage = replyMessages.find(
          (replyMessage) =>
            replyMessage._id.toString() === message.replyOfMessage.toString()
        );
      }
    });
    return res.json({
      success: true,
      messages,
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
