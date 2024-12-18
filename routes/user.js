const userController = require("../controllers/userControllers");
const middlewareAthentic = require("../middleware/middlewareAuth");
const upload = require("../middleware/middlewareUploadFile");

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

// router.put(
//   "/edit-image/:id",
//   upload.fields([
//     { name: "avatar", maxCount: 1 },
//     { name: "backgroundImage", maxCount: 1 },
//   ]),
//   userController.editImage
// );
module.exports = router;
