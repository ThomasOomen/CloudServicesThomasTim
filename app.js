const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const passport = require("passport");
const router = require("./routes/routes");
const helpers = require("./controller/helper.controller");
const { toXML } = require('jstoxml');
const sendData = helpers.sendJsonXml
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
        

        app.use(function (req, res, next) {
            res.sendData = function(obj){sendData(obj,req,res)};
            next();
        });

        app.use(bodyParser.urlencoded({ extended: false }));

        app.use(express.json({ limit: '500mb' }));
        app.use('/', router);
        app.listen(process.env.PORT, () => {
            console.log("server has started on port " + process.env.PORT);
        })
    }
)
