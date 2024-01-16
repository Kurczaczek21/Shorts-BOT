const express = require("express");
const { signup, signin, signout, checkLoginMiddleware } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);
router.post("/check", checkLoginMiddleware);

module.exports = router;
