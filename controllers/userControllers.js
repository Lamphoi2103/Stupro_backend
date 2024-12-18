const UserModel = require("../models/UserModel");

const userController = {
  getAllUser: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const users = await UserModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      const totalUsers = await UserModel.countDocuments(); // Tổng số người dùng
      const totalPages = Math.ceil(totalUsers / limit);
      res.status(200).json({
        users,
        totalUsers,
        totalPages,
        currentPage: parseInt(page),
        limit: parseInt(limit),
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getUserById: async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  editSchoolUser: async (req, res) => {
    try {
      const { userID } = req.params;
      const { schoolID, studentID } = req.body;
      if (!schoolID || !studentID) {
        return res
          .status(400)
          .json({ error: "Trường và Student ID là bắt buộc." });
      }
      const user = await UserModel.findById(userID);
      if (!user) {
        return res.status(404).json({ error: "Không tìm thấy người dùng." });
      }
      user.schoolID = schoolID;
      user.studentID = studentID;
      await user.save();
      res.status(200).json({
        message: "Cập nhật trường và Student ID thành công.",
        user: {
          schoolID: user.schoolID,
          studentID: user.studentID,
        },
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
module.exports = userController;
