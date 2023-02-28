const config = require("config");
const UserService = require("../services/user");
const { JsonResponse } = require("../lib/apiResponse");
const { MSG_TYPES } = require("../constants/types");
const { validateUser } = require("../requests/user");
const { GenerateToken, Transporter } = require("../utils")
/**
 * Create a user account
 * @param {*} req
 * @param {*} res
 */

exports.updateProfile = async (req, res, next) => {
    try {
        let {updatedUser} = await UserService.updateProfile(req.body, req.params.userId);
        JsonResponse(res, 200, MSG_TYPES.UPDATED, updatedUser);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.createUser = async (req, res, next) => {
    try {
        const { error } = validateUser(req.body);
        if (error) return JsonResponse(res, 400, error.details[0].message);

        let { newUser } = await UserService.createUser(req.body);
        //get token
        const token = GenerateToken(newUser);
        // Create a verification link with the token
        const verificationLink = `http://localhost:3000/auth/verify?token=${token}`;
        const subject = "Verify Your Account";
        const html = `
            <div>
                <h2>Verify Your Account</h2><hr>
                <p>Click the link below to verify your account:\n${verificationLink}</p>
            </div>
        `;
        Transporter(newUser.email, subject, html);
        JsonResponse(res, 200, MSG_TYPES.ACCOUNT_CREATED, newUser);
    } catch (error) {
        console.log(error)
        next(error)
    }
}