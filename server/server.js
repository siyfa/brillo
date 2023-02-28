require("./startup/db");
const config = require("config");
const app = require("./startup/routes");

const port = process.env.PORT || config.get("port");

//app set-up
app.listen(port, ()=> {
    console.log(`Brillo server listening on http://localhost:${port}`);
})