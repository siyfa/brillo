const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

//verify user account
router.post("/verify", authController.verifyUser);
//forgot password
router.post("/forgot-password", authController.forgetPassword)
//reset password
router.post("/reset-password", authController.resetPassword)
//login user
router.post("/login", authController.login)

module.exports = router;