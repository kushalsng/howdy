const asyncHandler = require('express-async-handler');
const Chat = require('../models/chat');
const User = require('../models/user');

exports.fetchOrCreateChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(404).json({
      success: false,
      msg: 'User not found!',
    });
  }
  const chat = await Chat.findOne({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate('users', '-password')
    .populate('latestMessage');
  if (chat && chat._id.toString().length) {
    if (chat.latestMessage) {
      chat.latestMessageSender = await User.find({
        _id: chat.latestMessage.sender,
      }).select('-password');
    }
    return res.json({
      success: true,
      chat,
    });
  } else {
    try {
      const newChat = await Chat.create({
        name: 'sender',
        isGroupChat: false,
        users: [req.user._id, userId],
      });
      const populatedChat = await Chat.findOne({
        _id: newChat._id,
      }).populate('users', '-password');

      return res.json({
        success: true,
        chat: populatedChat,
      });
    } catch (err) {
      console.error('error while creating chat, ', err);
      return res.status(409).json({
        success: false,
        msg: 'Something went wrong!',
      });
    }
  }
});

exports.fetchChats = asyncHandler(async (req, res) => {
  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 });

    const senderIds = chats
      .filter((chat) => chat.latestMessage)
      .map((chat) => chat.latestMessage.sender);
    const senders = await User.find({
      _id: { $in: senderIds },
    }).select('-password');

    chats.forEach((chat) => {
      if (chat.latestMessage) {
        chat.latestMessageSender = senders.find(
          (sender) => sender._id === chat.latestMessage.sender
        );
      }
    });
    return res.json({
      success: true,
      chats,
    });
  } catch (err) {
    console.error('error while fetching user chats, ', err);
    return res.status(409).json({
      success: false,
      msg: 'Something went wrong!',
    });
  }
});

exports.addGroupChat = asyncHandler(async (req, res) => {
  const { name, users } = req.body;
  try {
    if (!users || !users.length) {
      return res.status(400).json({
        success: false,
        msg: 'No user selected!',
      });
    }
    const chatName = name && name.trim().length ? name.trim() : null;
    if (!chatName) {
      return res.status(400).json({
        success: false,
        msg: 'Please provide group name!',
      });
    }
    users.push(req.user._id);
    const groupChat = await Chat.create({
      name,
      users,
      isGroupChat: true,
      groupAdmin: req.user._id,
    });
    const populatedChat = await Chat.findOne({
      _id: groupChat._id,
    })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    return res.json({
      success: true,
      chat: populatedChat,
    });
  } catch (err) {
    console.error('error while creating group chat, ', err);
    return res.status(409).json({
      success: false,
      msg: 'Something went wrong!',
    });
  }
});

exports.renameGroup = asyncHandler(async (req, res) => {
  const { chatId, name } = req.body;
  try {
    if (!chatId) {
      return res.status(400).json({
        success: false,
        msg: 'Group not found!',
      });
    }
    const groupChat = await Chat.findOne({
      _id: chatId,
    })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage');

    if (!groupChat || !groupChat.isGroupChat) {
      return res.status(400).json({
        success: false,
        msg: 'Group not found!',
      });
    }
    if (groupChat.latestMessage) {
      groupChat.latestMessageSender = await User.find({
        _id: groupChat.latestMessage.sender,
      }).select('-password');
    }
    groupChat.name = name;
    await groupChat.save();
    return res.json({
      success: true,
      msg: 'Group renamed successfully!',
      chat: groupChat,
    });
  } catch (err) {
    console.error('error while renaming group, ', err);
    return res.status(409).json({
      success: false,
      msg: 'Something went wrong!',
    });
  }
});

exports.addUserToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  try {
    if(!chatId || !userId) {
      return res.status(400).json({
        success: false,
        msg: "Chat not found!"
      })
    }
    const group = await Chat.findOne({
      _id: chatId,
      isGroupChat: true,
      groupAdmin: req.user._id
    })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage');
    if(!group){
      return res.status(400).json({
        success: false,
        msg: "Group not found!"
      })
    }
    const user = await User.findById(userId).select("-password");
    if(!user){
      return res.status(400).json({
        success: false,
        msg: "User not found!"
      })
    }
    if(group.users.find(user => user._id === userId)){
      return res.status(400).json({
        success: false,
        msg: `User already exist in group ${group.name}`
      })
    }
    group.users.push(userId);
    await group.save();
    return res.json({
      success: true,
      msg: `${user.name} added to group ${group.name} successfully!`
    })
  } catch (err) {
    console.error('error while adding group member, ', err);
    return res.status(409).json({
      success: false,
      msg: 'Something went wrong!',
    });
  }
});

exports.removeUserFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  try {
    if(!chatId || !userId) {
      return res.status(400).json({
        success: false,
        msg: "Chat not found!"
      })
    }
    const group = await Chat.findOne({
      _id: chatId,
      isGroupChat: true,
      groupAdmin: req.user._id
    })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage');
    if(!group){
      return res.status(400).json({
        success: false,
        msg: "Group not found!"
      })
    }
    const user = await User.findById(userId).select("-password");
    if(!user){
      return res.status(400).json({
        success: false,
        msg: "User not found!"
      })
    }
    if(!group.users.find(user => user._id.toString() === userId)){
      return res.status(400).json({
        success: false,
        msg: `${user.name} doesn't exist in group ${group.name}`
      })
    }
    if(userId === group.groupAdmin._id.toString()){
      return res.status(400).json({
        success: false,
        msg: `Cannot remove admin from group ${group.name}`
      })
    }
    group.users = group.users.filter(user => user._id.toString() !== userId);
    await group.save();
    return res.json({
      success: true,
      msg: `${user.name} removed from group ${group.name} successfully!`
    })
  } catch (err) {
    console.error('error while adding group member, ', err);
    return res.status(409).json({
      success: false,
      msg: 'Something went wrong!',
    });
  }
});
