require('dotenv').config();
const express = require("express");
const { chats } = require("./data/data.js");
const connectDB = require("./config/db.js");
const colors = require('colors')

const userRoutes = require('./routes/user.js')
const app = express();
connectDB()

app.use('/api/user', userRoutes)
app.get('/api/chat/:id', (req, res) => {
  const singleChat = chats.find(chat => chat._id === req.params.id)
  res.send(singleChat)
})

const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server started on port ${PORT}`.yellow.bold,));