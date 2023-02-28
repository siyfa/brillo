const express = require("express");
const router = express.Router();
const externalController = require("../controllers/external");

//send otp code to user phone
router.post("/sms/", externalController.sendSMS);
//verify user otpcode
router.post("/sms/verify", externalController.verifySMS);

module.exports = router;