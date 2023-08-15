const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  userPic: {
    type: String,
    default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  }
}, { timestamps: true });

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}
userSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.password =  await bcrypt.hash(this.password, 11);
  }
  next();
})

const User = mongoose.model("User", userSchema);

module.exports = User;