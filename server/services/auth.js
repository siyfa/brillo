const { MSG_TYPES } = require("../constants/types");
const User = require("../db/models/user");
const jwt = require("jsonwebtoken");
const config = require("config");
const { GenerateToken, Transporter } = require("../utils");
const bcrypt = require("bcrypt");

class AuthService {
    //login user
    loginUser(body){
        return new Promise(async (resolve, reject) => {
            //find user
            const user = await User.query().where({email: body.email}).first();
            if (!user) {
                reject({ code: 400, msg: MSG_TYPES.ACCOUNT_INVALID });
                return false;
            }
            
            if(user.status == false && user.verified == false){
                reject({code: 400, message: 'Account is not verified' })
            }
            // compare request password with the password saved on the database
            let validPassword = await bcrypt.compare(body.password, user.password);
            if (!validPassword) {
                reject({ code: 400, msg: MSG_TYPES.ACCOUNT_INVALID });
                return false;
            }

            user.password = "";
            resolve({ user });
        })
    }

    //reset password
    resetPassword(email, password) {
        return new Promise(async (resolve, reject) => {
            const user = await User.query().where({
                email: email,
                status: true
             }).first();
            if (!user) {
                reject({ code: 400, msg: MSG_TYPES.NOT_FOUND });
                return;
            }
            if (user.status == false) {
                reject({ code: 400, msg: "Account is not active" });
                return;
            }
            
            const hashedPassword = await bcrypt.hash(password, 10);
            //update user
            await User.query().patch({
                password: hashedPassword
            }).where({email: user.email})
            
            delete user.password;
            resolve({user})
        })
    }

    //forget password
    forgotPassword(email) {
        return new Promise(async (resolve, reject) => {
            const user = await User.query().where({ email }).first();
            if (!user) {
                reject({ code: 400, msg: MSG_TYPES.NOT_FOUND });
                return;
            }

            const link = `http://localhost:3000/api/auth/reset-password?email=${user.email}`;
            const subject = "Reset Your Password";
            const html = `
                <div>
                    <h2>Reset Your Password</h2><hr>
                    <p>Click the link below to reset your password:\n${link}</p>
                </div>
            `;
            Transporter(user.email, subject, html);

            delete user.password;
            resolve({user});
        })
    }

    //verify user account
    verifyUser(token) {
        return new Promise(async (resolve, reject) => {
            const decoded = jwt.verify(token, config.get("jwt.key"));

            const user = await User.query().findById(decoded.id);
            if (!user) {
                reject({ code: 400, msg: MSG_TYPES.INVALID_TOKEN });
                return;
            }
            if (user.verified == true) {
                reject({ code: 400, msg: "Account already verified" });
                return;
            }
            //update user and status
            await User.query().patch({
                verified: true,
                status: true
            }).where({ id: user.id });

            let updatedUser = await User.query().findById(user.id);
            delete updatedUser.password;

            resolve({ updatedUser })
        })
    }
}

module.exports = new AuthService();