const authController = require("../controllers/authControllers");
const middlewareAthentic = require("../middleware/middlewareAuth");

const router = require("express").Router();

router.post("/register", authController.registerUser);
router.post("/verify/:userID", authController.verifyUser);
router.post("/send-code/:userID", authController.sendVerificationCode);
router.post("/login", authController.loginUser);
router.post("/refresh", authController.requestRefreshToken);
router.post("/reset-password", authController.resetPassword);
router.post(
  "/logout",
  middlewareAthentic.verifyToken,
  authController.logoutUser
);

module.exports = router;
