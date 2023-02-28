const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const complexityOptions = {
    min: 8,
    max: 20,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 1,
};

function validateUser(user) {
    const Schema = Joi.object().keys({
        email: Joi.string().email().label("Email").max(50).required(),
        username: Joi.string().label("Username").max(50).required(),
        phoneNumber: Joi.string()
            .label("Phone Number")
            .pattern(/^[0-9]{13}$/).required().messages({
                "string.base": "Sorry! It looks like something went wrong. Please try later",
                "string.pattern.base": "Phone number must be a 13 digits number plus country code",
                "string.empty": "Phone Number is not allowed to be empty",
                "any.required": "Phone Number is required"
            }),
        password: passwordComplexity({ ...complexityOptions, requirementCount: 1 })
            .label("Password")
            .required(),
        sports: Joi.array().items(Joi.string().required()).required(),
    });

    return Schema.validate(user);
}


function validateLogin(user) {
    const Schema = Joi.object().keys({
        email: Joi.string().email().label("Email").max(50).required(),
        password: passwordComplexity(complexityOptions)
            .label("Password")
            .required(),
    });

    return Schema.validate(user);
}


module.exports = {
    validateUser,
    validateLogin,
}