const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");
require("dotenv").config();

let refreshTokens = [];
const transporter = nodemailer.createTransport({
  service: "gmail", // Dùng Gmail, hoặc thay bằng SMTP khác
  auth: {
    user: process.env.EMAIL_NAME,
    pass: process.env.PASSWORD_EMAIL,
  },
});
const authController = {
  // Hàm gửi email xác thực
  sendVerificationEmail: async (email, verificationCode) => {
    const mailOptions = {
      from: process.env.EMAIL_NAME,
      to: email,
      subject: "Mã xác thực của bạn",
      text: `Mã xác thực của bạn là: ${verificationCode}, có thời hạn trong vòng 10 phút`,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Gửi email thất bại: ", error);
      throw new Error("Không thể gửi email xác thực.");
    }
  },
  // register
  registerUser: async (req, res) => {
    try {
      const { username, email, password, schoolID, studentID } = req.body;
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email đã tồn tại" });
      }

      const verificationCode = crypto.randomInt(100000, 999999).toString();
      const expirationTime = Date.now() + 10 * 60 * 1000;
      const verificationExpire = expirationTime;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = new UserModel({
        username,
        email,
        schoolID,
        studentID,
        password: hashedPassword,
        verificationCode,
        verificationExpire,
      });
      await newUser.save();
      await authController.sendVerificationEmail(email, verificationCode);
      res.status(200).json({
        message: "Đăng ký thành công! Vui lòng kiểm tra email để xác thực.",
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  },
  // refesh code xác thực
  sendVerificationCode: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await UserModel.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ error: "Không tìm thấy người dùng với email này" });
      }

      // Tạo mã xác thực mới
      const newVerificationCode = crypto.randomInt(100000, 999999).toString();
      const expirationTime = Date.now() + 10 * 60 * 1000;
      user.verificationCode = newVerificationCode;
      user.verificationExpire = expirationTime;
      await user.save();

      // Gửi email với mã xác thực mới
      await authController.sendVerificationEmail(email, newVerificationCode);

      res
        .status(200)
        .json({ message: "Mã xác thực mới đã được gửi qua email." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Đã xảy ra lỗi khi refresh mã xác thực." });
    }
  },
  // xác thực code
  verifyUser: async (req, res) => {
    try {
      const { email, verificationCode } = req.body;
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Không tìm thấy người dùng với email này" });
      }
      if (user.verificationCode !== verificationCode) {
        return res.status(400).json({ error: "Mã xác thực không đúng" });
      }
      // Kiểm tra thời gian hết hạn của mã xác thực
      if (Date.now() > user.verificationExpire) {
        return res.status(400).json({
          error: "Mã xác thực đã hết hạn. Vui lòng yêu cầu mã mới.",
        });
      }
      if (user.verificationCode === verificationCode) {
        user.isVerified = true; // Cập nhật trạng thái xác minh thành công
        user.verificationCode = null; // Xóa mã xác thực
        user.verificationExpire = null;
        await user.save();

        res.status(200).json({ message: "Xác thực thành công!" });
      } else {
        res.status(400).json({ error: "Mã xác thực không đúng" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },

  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "30d" }
    );
  },
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "360d" }
    );
  },

  loginUser: async (req, res) => {
    try {
      const user = await UserModel.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).json("Không tìm thấy email người dùng");
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        return res.status(404).json("Mật khẩu không đúng");
      }
      if (user && validPassword) {
        const accessToken = authController.generateAccessToken(user);
        const refreshToken = authController.generateRefreshToken(user);
        refreshTokens.push(refreshToken);
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        });
        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json(e);
    }
  },
  requestRefreshToken: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json("bạn chưa đăng nhập");
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json("Refresh token không hợp lệ");
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        console.log(err);
        return res.status(403).json("Xác minh token thất bại");
      }
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
      const newAccessToken = authController.generateAccessToken(user);
      const newRefreshToken = authController.generateRefreshToken(user);
      refreshTokens.push(newRefreshToken);
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false, // Nên đặt thành true khi triển khai ở môi trường production
        path: "/",
        sameSite: "strict",
      });
      res.status(200).json({ accessToken: newAccessToken });
    });
  },

  resetPassword: async (req, res) => {
    try {
      const { email, verificationCode, newPassword } = req.body;
      const user = await UserModel.findOne({ email });

      if (!user) {
        return res.status(400).json({ error: "Email không tồn tại" });
      }

      // Kiểm tra mã xác thực
      if (user.verificationCode !== verificationCode) {
        return res.status(400).json({ error: "Mã xác thực không đúng" });
      }
      // Kiểm tra thời gian hết hạn của mã xác thực
      if (Date.now() > user.verificationExpire) {
        return res.status(400).json({
          error: "Mã xác thực đã hết hạn. Vui lòng yêu cầu mã mới.",
        });
      }

      // Mã xác thực hợp lệ, cho phép thay đổi mật khẩu
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      user.password = hashedPassword;
      user.verificationCode = null;
      user.verificationExpire = null;
      await user.save();

      res.status(200).json({ message: "Mật khẩu đã được thay đổi thành công" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Đã xảy ra lỗi khi thay đổi mật khẩu" });
    }
  },

  logoutUser: async (req, res) => {
    res.clearCookie("refreshToken");
    refreshTokens = refreshTokens.filter(
      (token) => token !== req.cookies.refreshToken
    );
    res.status(200).json("Đăng xuất thành công");
  },
};
module.exports = authController;
