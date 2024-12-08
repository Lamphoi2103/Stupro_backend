const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false }
);
module.exports = mongoose.model("Category", categorySchema);
