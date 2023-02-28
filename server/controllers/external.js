const config = require("config");
const accountSid = config.get("twilio.accountSid")
const authToken = config.get("twilio.authToken")
const serviceSID = config.get("twilio.serviceSID")
const client = require("twilio")(accountSid, authToken);
const crypto = require('crypto');
const { JsonResponse } = require("../lib/apiResponse");

exports.sendSMS = async (req, res, next) => {
    try {
        let { phone } = req.body;

        if (!phone) return JsonResponse(res, 400, "Phone number is required");

        client.verify.v2.services(serviceSID)
            .verifications
            .create({ to: phone, channel: 'sms' })
            .then(verification => {
                // console.log(verification);
                return JsonResponse(res, 200, "OTP Code sent to phone number", verification.status);
            })
            .catch(error => console.log(error));

    } catch (error) {
        console.log(error)
        next(error)
    }
}

exports.verifySMS = async (req, res, next) => {
    try {
        let { code, phone } = req.body;

        if (!code || !phone) return JsonResponse(res, 400, "OTP Code and phone are required");

        client.verify.v2.services(serviceSID)
            .verificationChecks
            .create({ to: phone, code: code })
            .then(async (verification_check) => {
                // console.log('verification_check', verification_check)
                return JsonResponse(res, 200, "OTP Code is verified", verification_check.status);
            })
            .catch(error => console.log(error));

    } catch (error) {
        console.log(error)
        next(error)
    }
}