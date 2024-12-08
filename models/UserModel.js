const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    schoolID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
    },
    studentID: {
      type: String,
      required: true,
      unique: true,
    },
    birthday: {
      type: String,
    },
    role: {
      type: Number,
      default: 1,
    },
    avarta: {
      type: String,
    },
    backgroundImg: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
    },
    verificationExpire: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
module.exports = mongoose.model("User", userSchema);
