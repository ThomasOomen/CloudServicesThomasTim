const Location = require("../models/location.model");
const helpers = require("./helper.controller");
let sendData = helpers.sendJsonXml;

exports.belongsToUser = (req, res) => {
    Location.find({ targets: req.params.target_id }, (err, location) => {
        if (err) {
            res.status(400).json({
                status: 'error',
                error: err,
            });
        }
        else {
            res.status(200).sendData(JSON.stringify({
                message: 'Location details loading..',
                data: location,
            }));
        }
    });
};
