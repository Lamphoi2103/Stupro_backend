const mongoose = require("mongoose");

const engagementSchema = new mongoose.Schema(
  {
    reacts: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        react: {
          type: Number,
        },
      },
    ],
    votes: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        type: {
          type: Boolean,
          default: false,
          required: true,
        },
      },
    ],
    shares: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
module.exports = mongoose.model("Engagement", engagementSchema);
