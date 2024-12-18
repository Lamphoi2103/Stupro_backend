const userController = require("../controllers/userControllers");
const middlewareAthentic = require("../middleware/middlewareAuth");

const router = require("express").Router();

router.get(
  "/allusers",
  middlewareAthentic.verifyTokenAndAdminAuth,
  userController.getAllUser
);
router.get(
  "/:id",
  middlewareAthentic.verifyTokenAndAdminAuth,
  userController.getUserById
);
router.put("/school/:userID", userController.editSchoolUser);

module.exports = router;
