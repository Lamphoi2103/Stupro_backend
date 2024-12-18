const schoolModel = require("../models/SchoolModel");

const schoolController = {
  getAllSchool: async (req, res) => {
    try {
      const school = await schoolModel.find();
      res.status(200).json(school);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  addSchool: async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Thiếu thông tin trường học." });
      }
      const newSchool = new schoolModel({
        name: name,
      });
      const savedSchool = await newSchool.save();
      res.status(200).json({
        message: "Thêm trường học thành công.",
        school: savedSchool,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
module.exports = schoolController;
