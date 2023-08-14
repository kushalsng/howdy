require('dotenv').config();
const express = require("express");
const { chats } = require("./data/data.js");
const connectDB = require("./config/db.js");
const colors = require('colors')

const userRoutes = require('./routes/user.js');
const { notFound, errorHandler } = require('./middlewares/error.js');


const app = express();
connectDB()

app.use(express.json())

app.use('/api/user', userRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server started on port ${PORT}`.yellow.bold,));