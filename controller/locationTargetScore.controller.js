const Location = require("../models/location.model");
const Target = require("../models/target.model");
const helpers = require("./helper.controller");
let sendData = helpers.sendJsonXml;

exports.getLocationTargetScore = (req, res) => {
    Location.findById(req.params.location_id, (err, location) => {
        if (err) {
            res.status(400).json({
                status: 'error',
                error: err,
            });
        }
        else {
            if (location['targets'].includes(req.params.target_id)) {
                Target.findById(req.params.target_id, (err, target) => {
                    if (err) {
                        res.status(400).json({
                            status: 'error',
                            error: err,
                        });
                    } else {
                        if (Object.keys(target['score']).includes(req.params.score_id)) {
                            res.status(200).sendData(JSON.stringify({
                                message: 'Target details loading..',
                                data: target['score'][req.params.score_id],
                            }));
                        }
                        else {
                            res.status(400).json({
                                status: 'error',
                                error: "This score does not exist in this target",
                            });
                        }
                    }
                });
            }
            else {
                res.status(400).json({
                    status: 'error',
                    error: "This target does not exist in this location",
                });
            }
        }
    });
};

exports.getLocationTargetScores = (req, res) => {
    Location.findById(req.params.location_id, (err, location) => {
        if (err) {
            res.status(400).json({
                status: 'error',
                error: err,
            });
        }
        else {
            if (location['targets'].includes(req.params.target_id)) {
                Target.findById(req.params.target_id, (err, target) => {
                    if (err) {
                        res.status(400).json({
                            status: 'error',
                            error: err,
                        });
                    } else {
                        if (Object.keys(target['score']).includes(req.params.score_id)) {
                            res.status(200).sendData(JSON.stringify({
                                message: 'Target details loading..',
                                data: target['score'][req.params.score_id]['tag'],
                            }));
                        }
                        else {
                            res.status(400).json({
                                status: 'error',
                                error: "This score does not exist in this target",
                            });
                        }
                    }
                });
            }
            else {
                res.status(400).json({
                    status: 'error',
                    error: "This target does not exist in this location",
                });
            }
        }
    });
};