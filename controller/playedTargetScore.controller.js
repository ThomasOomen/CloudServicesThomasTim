const PlayedTarget = require("../models/playedTarget.model");
const helpers = require("./helper.controller");
let sendData = helpers.sendJsonXml;

exports.getPlayedTargetScore = (req, res) => {
    PlayedTarget.findById(req.params.playedTarget_id, (err, playedTarget) => {
        if (err) {
            res.status(400).json({
                status: 'error',
                error: err,
            });
        }
        else {
            console.log('req.params.id:', req.params);
            console.log("lel: ", Object.keys(playedTarget['target']).includes("626984e40d6b9b001686ef2c"));
            if (Object.keys(playedTarget['target']).includes(req.params.target_id)) {
                console.log("in hier");
                res.status(200).sendData(JSON.stringify({
                    message: 'PlayedTarget score loading..',
                    data: playedTarget['score'][0],
                }));
            }
            else {
                res.status(400).json({
                    status: 'error',
                    error: "This score does not exist in this playedTarget",
                });
            }

        }
    });
};

exports.getPlayedTargetScores = (req, res) => {
    PlayedTarget.findById(req.params.playedTarget_id, (err, playedTarget) => {
        if (err) {
            res.status(400).json({
                status: 'error',
                error: err,
            });
        }
        else {
            res.status(200).sendData(JSON.stringify({
                message: 'PlayedTarget score loading..',
                data: playedTarget['score'],
            }));
        }
    });
};