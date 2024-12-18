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
  // editImage: async (req, res) => {
  //   try {
  //     // Lấy đường dẫn ảnh từ req.files
  //     const avatar = req.files.avatar ? req.files.avatar[0].path : null;
  //     const backgroundImage = req.files.backgroundImage
  //       ? req.files.backgroundImage[0].path
  //       : null;

  //     // Kiểm tra xem có ít nhất một ảnh được gửi lên không
  //     if (!avatar && !backgroundImage) {
  //       return res.status(400).json({
  //         message:
  //           "Vui lòng tải lên ít nhất một ảnh (avatar hoặc background image).",
  //       });
  //     }
  //     const userId = req.params.id;

  //     // Tìm người dùng trong cơ sở dữ liệu
  //     const user = await UserModel.findById(userId);
  //     if (!user) {
  //       return res.status(404).json({ message: "Người dùng không tồn tại." });
  //     }

  //     // Cập nhật ảnh cho người dùng
  //     if (avatar) user.avatar = avatar;
  //     if (backgroundImage) user.backgroundImage = backgroundImage;

  //     // Lưu thay đổi vào cơ sở dữ liệu
  //     const updatedUser = await user.save();

  //     // Trả về phản hồi
  //     res.status(200).json({
  //       message: "Cập nhật ảnh thành công.",
  //       user: updatedUser,
  //     });
  //   } catch (error) {
  //     console.error("Lỗi khi cập nhật ảnh:", error);
  //     res.status(500).json({
  //       message: "Đã xảy ra lỗi trong quá trình cập nhật ảnh.",
  //       error: error.message,
  //     });
  //   }
  // },
};
module.exports = userController;
