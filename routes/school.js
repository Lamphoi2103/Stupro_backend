const schoolController = require("../controllers/SchoolControllers");

const router = require("express").Router();

router.get("/allschool", schoolController.getAllSchool);
router.post("/addschool", schoolController.addSchool);

module.exports = router;
