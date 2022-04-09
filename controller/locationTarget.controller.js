const Location = require("../models/location.model");
const Target = require("../models/target.model");
const helpers = require("./helper.controller");
let sendData = helpers.sendJsonXml;

exports.deleteLocation = (req, res) => {
    Location.findById(req.params.location_id, (err, location) => {
        if (err) {
            res.status(400).json({
                status: 'error',
                error: err,
            });
        }
        else {
            for (let i = 0; i < location.targets; i++) {
                const curTargetID = location.targets[i];
                Target.remove({ _id: curTargetID }), (err) => {
                    if (err) {
                        res.status(400).json({
                            status: 'error',
                            error: err,
                        });
                    }
                }
            }
        }
    });
    Location.remove({ _id: req.params.location_id }, (err) => {
        if (err) {
            res.status(400).json({
                status: 'error',
                error: err,
            });
        }
        res.status(200).sendData(JSON.stringify({
            status: 'success',
            message: 'Location deleted',
        }));
    });
    Target.remove({})
};

exports.addTarget = (req, res) => {
    Location.findByIdAndUpdate(
        { _id: req.params.location_id },
        { $push: { targets: req.body.target_id } },
        { new: true },
        (err, location) => {
            if (err) {
                res.status(400).json({
                    status: 'error',
                    error: err,
                });
            }
            else {
                res.status(200).sendData(JSON.stringify({
                    message: 'Location updated!',
                    data: location,
                }));
            }
        }
    );
};

exports.getLocationTarget = (req, res) => {
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
                        res.status(200).sendData(JSON.stringify({
                            message: 'Target details loading..',
                            data: target,
                        }));
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

exports.getAllLocationTargets = (req, res) => {
    Location.findById(req.params.location_id, (err, location) => {
        if (err) {
            res.status(400).json({
                status: 'error',
                error: err,
            });
        }
        else {
            if (location['targets'].length > 0) {
                res.status(200).sendData(JSON.stringify({
                    message: 'Targets details loading..',
                    data: location['targets'],
                }));
            }
            else {
                res.status(400).json({
                    status: 'error',
                    error: "There are no targets for this location",
                });
            }
        }
    });
};