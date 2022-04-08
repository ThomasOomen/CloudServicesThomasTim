const express = require("express");

const mongoose = require("mongoose");
const passport = require("passport");
const router = require("./routes/routes");
let uriDb = "mongodb://";

if (process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}

if (process.env.username && process.env.password) {
    uriDb += `${username}:${password}@`;
}

uriDb += `${process.env.HOSTNAME}:${process.env.DBPORT}/${process.env.DBNAME}`

mongoose.connect(uriDb, {useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        const app = express();
        app.use('/', router);
        app.listen(process.env.PORT, () => {
            console.log("server has started on port " + process.env.PORT);
        })
    }
)
