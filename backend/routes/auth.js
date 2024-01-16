const express = require("express");
const { signup, signin, signout, checkLogin } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);
router.post("/check", checkLogin);

module.exports = router;
