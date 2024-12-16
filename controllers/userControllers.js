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
};
module.exports = userController;
