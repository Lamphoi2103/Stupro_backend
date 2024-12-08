const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    shortdescription: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    coverimage: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    engagementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Engagement",
      required: true,
    },
    commentsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment",
      required: true,
    },
    tagId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tag",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
module.exports = mongoose.model("Project", projectSchema);
