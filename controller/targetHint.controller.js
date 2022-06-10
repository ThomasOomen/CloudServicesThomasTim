const Location = require("../models/location.model");
const Target = require("../models/target.model");
const helpers = require("./helper.controller");
let sendData = helpers.sendJsonXml;

exports.getTargetHint = (req, res) => {
    Target.findById(req.params.target_id, (err, target) => {
        if (err) {
            res.status(400).json({
                status: 'error',
                error: err,
            });
        }
        else {
            if (Object.keys(target['hints']).includes(req.params.hint_id)) {
                res.status(200).sendData(JSON.stringify({
                    message: 'Target details loading..',
                    data: target['hints'][req.params.hint_id],

                }))
            }
            else {
                res.status(400).json({
                    status: 'error',
                    error: "This hint does not exist in this target",
                });
            }

        }
    });
};