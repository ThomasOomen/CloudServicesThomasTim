const PlayedTarget = require("../models/playedTarget.model");
const Location = require("../models/location.model");
const Target = require("../models/location.model");
const helpers = require("./helper.controller");
let sendData = helpers.sendJsonXml;

exports.LinkedTarget = (req, res) => {
    PlayedTarget.find({ target: req.params.target_id }, (err, playedTarget) => {
        if (err) {
            res.status(400).json({
                status: 'error',
                error: err,
            });
        }
        else {
            res.status(200).sendData(JSON.stringify({
                message: 'PlayedTarget details loading..',
                data: playedTarget,
            }));
        }
    });
};
