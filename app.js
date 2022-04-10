const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const router = require("./routes/routes");
const helpers = require("./controller/helper.controller");
const { toXML } = require('jstoxml');
const sendData = helpers.sendJsonXml;
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

let uriDb = "mongodb://";
if (process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}

if (process.env.USERNAME && process.env.PASSWORD) {
    uriDb += `${process.env.USERNAME}:${process.env.PASSWORD}@`;
}

uriDb += `${process.env.HOSTNAME}:${process.env.DBPORT}/${process.env.DBNAME}`

if (process.env.DB_CONNECT) {
    uriDb = process.env.DB_CONNECT
}

mongoose.connect(uriDb, {useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        const app = express();   
        
        const swaggerOptions = {
            swaggerDefinition: {
              info: {
                version: "1.0.0",
                title: "Cloud services API",
                description: "cloudservices API Information",
                contact: {
                  name: "Thomas, Tim"
                },
                servers: ["http://localhost:5000"]
              }
            },
            apis: ["app.js"],
            routes: ["./routes/routes"]
          };
          
          const swaggerDocs = swaggerJsDoc(swaggerOptions);
          app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
