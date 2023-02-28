const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");


const error = require("../middlewares/errors");
const endpointNotFound = require("../middlewares/404");
const dbSetup = require("../db/db-setup");

const app = express();

//cors set-up
const corsOptions = {
    origin: "*",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ["x-auth-token"],
};


// App Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('tiny'));
app.use(helmet());

//log every request url
// app.use((req, res, done) => {
// 	console.log(`${req.method} ${req.originalUrl} ${res.statusCode}`);
// 	done();
// });

//run pg db
dbSetup()

//routes
app.use("/api/user/", require("../routes/user"));
app.use("/api/auth/", require("../routes/auth"));
app.use("/api/external/", require("../routes/external"));
app.use("/api/test", (req, res) => {
    // Download the helper library from https://www.twilio.com/docs/node/install
    // Set environment variables for your credentials
    // Read more at http://twil.io/secure
    const accountSid = "AC324c39d21b813f101ffede92de272ba2";
    const authToken = "34f03bb4901e10b83e28263009365391";
    const verifySid = "VA51d3e7c80b85fa64a81bdccb530212cc";
    const client = require("twilio")(accountSid, authToken);

    client.verify.v2
        .services(verifySid)
        .verifications.create({ to: "+2348138993680", channel: "sms" })
        .then((verification) => console.log(verification.status))
        .then(() => {
            const readline = require("readline").createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            readline.question("Please enter the OTP:", (otpCode) => {
                client.verify.v2
                    .services(verifySid)
                    .verificationChecks.create({ to: "+2348138993680", code: otpCode })
                    .then((verification_check) => console.log(verification_check.status))
                    .then(() => readline.close());
            });
        });
});

app.get("/ping", (req, res) => {
    const now = new Date()
    return res.status(200).json({
        status: "OK",
        timestamp: "" + now.toLocaleString()
    })
})

//global error handlers
app.use(error);
app.use(endpointNotFound);

module.exports = app;