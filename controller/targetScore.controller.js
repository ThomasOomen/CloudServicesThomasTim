const Location = require("../models/location.model");
const Target = require("../models/target.model");
const helpers = require("./helper.controller");
let sendData = helpers.sendJsonXml;

exports.getTargetScore = (req, res) => {
    Target.findById(req.params.target_id, (err, target) => {
        if (err) {
            res.status(400).json({
                status: 'error',
                error: err,
            });
        }
        else {
            if (Object.keys(target['score']).includes(req.params.score_id)) {
                res.status(200).sendData(JSON.stringify({
                    message: 'Target details loading..',
                    data: target['score'][req.params.score_id],
                }))
            }
            else {
                res.status(400).json({
                    status: 'error',
                    error: "This score does not exist in this target",
                });
            }

        }
    });
};

exports.getTargetScores = (req, res) => {
    Target.findById(req.params.target_id, (err, target) => {
        if (err) {
            res.status(400).json({
                status: 'error',
                error: err,
            });
        }
        else {
            res.status(200).sendData(JSON.stringify({
                message: 'Target details loading..',
                data: target['score'],
            }))
        }
    });
};

