require('dotenv').config();
const express = require('express');
const { chats } = require('./data/data.js');
const connectDB = require('./config/db.js');
const colors = require('colors');
const cors = require('cors');
const userRoutes = require('./routes/user.js');
const authRoutes = require('./routes/auth.js');
const chatRoutes = require('./routes/chat.js');
const messageRoutes = require('./routes/message.js');
const { notFound, errorHandler } = require('./middlewares/error.js');
const { isAuthenticated } = require('./middlewares/auth.js');
const socket = require('socket.io');

const app = express();
app.use(cors());
connectDB();

app.use(express.json());

app.use((req, res, next) => {
  if (
    req._parsedUrl.pathname === '/register' ||
    req._parsedUrl.pathname === '/login' ||
    req._parsedUrl.pathname === '/'
  ) {
    next();
  } else {
    isAuthenticated(req, res, next);
  }
});

app.get('/', (req, res) => {
  res.json({
    success: true,
    msg: "Howdy👋🏻 server running successfully"
  })
})
app.use('/', authRoutes);
app.use('/user', userRoutes);
app.use('/chat', chatRoutes);
app.use('/message', messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(`Server started on port ${PORT}`.bgYellow.bold)
);

const io = socket(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'https://howdy-rvua.onrender.com/',
    // origin: 'http://localhost:3000',
  },
});

io.on('connection', (socket) => {
  console.log('Socket connected!'.brightBlue.bold);
  socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.emit(`connected`);
    console.log(userData._id);
  });

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log('User joined room: ', room);
  });

  socket.on('typing', (room) => {
    socket.in(room).emit('typing');
  });
  socket.on('stop typing', (room) => {
    socket.in(room).emit('stop typing');
  });

  socket.on('new message', (receivedMessage) => {
    const chat = receivedMessage.chat;
    if (!chat.users) return console.log('no users in the chat');
    chat.users.forEach((user, index) => {
      if (user._id !== receivedMessage.sender._id) {
        socket.in(user._id).emit('message received', receivedMessage);
      }
    });
  });

  socket.off('setup', () => {
    console.log('USER DISCONNECTED');
    socket.leave(userData._id);
  });
});
