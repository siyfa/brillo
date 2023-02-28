const config = require("config");
const AuthService = require("../services/auth");
const { JsonResponse } = require("../lib/apiResponse");
const { MSG_TYPES } = require("../constants/types");
const { validateLogin } = require("../requests/user");
const { GenerateToken, Transporter } = require("../utils");
const User = require("../db/models/user");
/**
 * @param {*} req
 * @param {*} res
*/

exports.login = async (req, res, next) => {
    try {
        const { error } = validateLogin(req.body);
        if (error) return JsonResponse(res, 400, error.details[0].message);

        const { user } = await AuthService.loginUser(req.body);

        const token = GenerateToken(user);
        res.header("x-auth-token", token);

        //update user token
        await User.query().patch({
            token: token
        }).where({ email: user.email });
        //get updated details
        const loginUser = await User.query().where({ email: user.email }).first();
        delete loginUser.password;

        JsonResponse(res, 200, MSG_TYPES.LOGGED_IN, loginUser);
        return;
    } catch (error) {
        console.log(error)
        next(error)
    }
}
exports.resetPassword = async (req, res, next) => {
    try {
        let { email } = req.query;
        let { password } = req.body;
        if (!email || !password) return JsonResponse(res, 400, "All fields are required");

        const { user } = await AuthService.resetPassword(email, password);
        JsonResponse(res, 200, "User password reset successfully", user);
    } catch (error) {
        console.log(error)
        next(error)
    }
}

exports.forgetPassword = async (req, res, next) => {
    try {
        let { email } = req.body;
        if (!email) return JsonResponse(res, 400, "Email is required");

        const { user } = await AuthService.forgotPassword(email);
        JsonResponse(res, 200, "Reset link sent to user's email", user);
    } catch (error) {
        console.log(error)
        next(error)
    }
}

exports.verifyUser = async (req, res, next) => {
    try {
        let { token } = req.query;
        if (!token) return JsonResponse(res, 400, "Token is requested");

        const { updatedUser } = await AuthService.verifyUser(token);

        JsonResponse(res, 200, MSG_TYPES.ACCOUNT_VERIFIED, updatedUser);
    } catch (error) {
        console.log(error)
        next(error)
    }
}