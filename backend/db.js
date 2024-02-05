const mongoose = require("mongoose");
require("dotenv").config();
const { MONGOOSE_CONNECTION_STRING } = require("./config");

mongoose.connect(MONGOOSE_CONNECTION_STRING);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30,
  },
  password: {
    type: String,
    required: true,
    unique: true,
    minLength: 6,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
});

const User = new mongoose.model("User", userSchema);

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  balanceInPaise: {
    type: Number,
    required: true,
  },
});

const Account = new mongoose.model("Account", accountSchema);

module.exports = {
  User,
  Account,
};
