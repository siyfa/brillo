const { MSG_TYPES } = require("../constants/types");
const User = require("../db/models/user");
const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");

class UserService {
    //update your profile
    updateProfile(body, id) {
        return new Promise(async (resolve, reject) => {
            let { email, newPassword, password, username } = body;
            const user = await User.query().where({
                id,
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

            if (email) {
                await User.query().patch({ email }).where({ email: user.email });
            }
            if (username) {
                await User.query().patch({ username }).where({ email: user.email });
            }
            if (password) {
                // compare request password with the password saved on the database
                let validPassword = await bcrypt.compare(password, user.password);
                if (!validPassword) {
                    reject({ code: 400, msg: "Password is incorrect" });
                    return false;
                }

                const hashedPassword = await bcrypt.hash(newPassword, 10);
                await User.query().patch({password: hashedPassword}).where({ email: user.email });
            }

            //get updated user
            const updatedUser = await User.query().findById(user.id);
            delete updatedUser.password;

            resolve({updatedUser});
        })
    }

    //create new user
    createUser(body) {
        return new Promise(async (resolve, reject) => {
            let { email, phoneNumber, password,username, sports } = body;

            //check if email account exist
            let foundUser = await User.query().where({ email }).first();
            if (foundUser) {
                reject({ code: 400, message: MSG_TYPES.ACCOUNT_EXIST });
                return false;
            }

            let newUser = await User.query().insert({
                uuid: nanoid(10),
                email,
                username,
                phone_number: phoneNumber,
                password,
                sports: JSON.stringify(sports)
            })

            delete newUser.password;

            resolve({ newUser })
        })
    }
}

module.exports = new UserService();