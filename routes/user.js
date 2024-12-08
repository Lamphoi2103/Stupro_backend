const userController = require("../controllers/userControllers");
const middlewareAthentic = require("../middleware/middlewareAuth");

const router = require("express").Router();

router.get(
  "/allusers",
  middlewareAthentic.verifyTokenAndAdminAuth,
  userController.getAllUser
);

module.exports = router;
