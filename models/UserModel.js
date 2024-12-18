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
      unique: true,
    },
    birthday: {
      type: String,
    },
    role: {
      type: Number,
      default: 1,
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dm5boojuu/image/upload/v1734536116/default-avatar-icon-of-social-media-user-vector_irdhng.jpg",
    },
    backgroundImage: {
      type: String,
      default:
        "https://res.cloudinary.com/dm5boojuu/image/upload/v1734536209/images_ayabqu.jpg",
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
