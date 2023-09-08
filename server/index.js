require('dotenv').config();
const express = require("express");
const { chats } = require("./data/data.js");
const connectDB = require("./config/db.js");
const colors = require('colors')
const cors = require('cors')
const userRoutes = require('./routes/user.js');
const authRoutes = require('./routes/auth.js');
const chatRoutes = require('./routes/chat.js')
const { notFound, errorHandler } = require('./middlewares/error.js');
const { isAuthenticated } = require('./middlewares/auth.js');


const app = express();
app.use(cors())
connectDB()

app.use(express.json())

app.use((req, res, next) => {
  if(req._parsedUrl.pathname === '/register' || req._parsedUrl.pathname === '/login' || req._parsedUrl.pathname === '/'){
      next()
  } else {
      isAuthenticated(req, res, next)
  }
})

app.use('/', authRoutes)
app.use('/user', userRoutes)
app.use('/chat', chatRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server started on port ${PORT}`.yellow.bold,));