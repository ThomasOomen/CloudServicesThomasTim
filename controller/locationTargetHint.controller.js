const Location = require("../models/location.model");
const Target = require("../models/target.model");
const helpers = require("./helper.controller");
let sendData = helpers.sendJsonXml;

exports.getLocationTargetHint = (req, res) => {
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
                        hint = target["hints"][req.params.hint_id];
                        if (hint != null) {
                            res.status(200).sendData(JSON.stringify({
                                message: 'Hint details',
                                data: hint,
                            }));
                        } else {
                            res.status(400).json({
                                status: 'error',
                                error: "This hint does not exist in this target",
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