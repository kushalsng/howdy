const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Database Connected! `.brightGreen.bold);
  } catch (err) {
    console.error(`Error while connecting database: ${err.message}`.red.bold);
    process.exit();
  }
};

module.exports = connectDB;
