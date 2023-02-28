const config = require("config");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

//nodemailer set-up
const Transporter = async (email, subject, html, senderEmail = config.get("email")) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        debug: true, //show debug output
        logger: false, // log info
        pool: true,
        auth: {
            user: config.get("email"), //'trusoftng@gmail.com'
            pass: config.get("emailPassword")
        }
    })

    const mailOption = {
        from: senderEmail,
        to: email,
        subject: subject,
        html: html
    }

    await transporter.sendMail(mailOption)
        .then(info => console.log('Email sent -' + info.response))
        .catch(error => console.log('Nodemailer Error -' + error))

}

const GenerateToken = (user) => {
    const userData = {
        id: user.id,
        uuid: user.uuid,
        email: user.email
    }
    const token = jwt.sign(
        userData,
        config.get("jwt.key"),
        {
            expiresIn: config.get("jwt.expireDate")
        }
    )
    return token;
}

module.exports = {
    Transporter,
    GenerateToken
}