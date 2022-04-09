const Location = require("../models/location.model");
const helpers = require("./helper.controller");
let sendData = helpers.sendJsonXml

exports.getLocations = (req, res) => {
    let queryItems = (Object.keys(req.query));
    let filter = {};
    for (let i = 0; i < queryItems.length; i++) {
        const curItem = queryItems[i];
        //check for valid filters
        if (curItem == 'locationName' || curItem == 'long' || curItem == 'range' || curItem == 'lat') {
            filter[curItem] = req.query[curItem];
        }
    }
    Location.find(filter, (err, location) => {
        if (err) {
            res.status(400).json({
                status: 'error',
                message: err,
            });
        } else {
            const totalSize = location.length;
            res.status(200). sendData(JSON.stringify({
                status: 'success',
                message: 'Location retrieved successfully',
                data: location,
                totalSize: totalSize,
            }));;
        }
    });
};

exports.newLocation = (req, res) => {
    //create new location.
    res.send("new locations");
};

exports.viewLocation = (req, res) => {
    //view selected location.
    res.send("view locations");
};

exports.updateLocation = (req, res) => {
    //update selected location.
    res.send("update locations");
};

exports.deleteLocation = (req, res) => {
    //Delete selected location.
    res.send("delete locations");
};

exports.addTarget = (req, res) => {
    //Add new target to selected location.
    res.send("add new target to locations");
};

exports.getLocationTarget = (req, res) => {
    //get target from selected location.
    res.send("get target from location");
};

exports.getAllLocationTargets = (req, res) => {
    //Get all target of selected location.
    res.send("get all targets from location");
};

exports.getLocationTargetHint = (req, res) => {
    //get hints of selected locations.
    res.send("get location hint");
};

exports.getLocationTargetScore = (req, res) => {
    //get location target score.
    res.send("get location target score");
};

exports.getLocationTargetScores = (req, res) => {
    //Get location target scores.
    res.send("get location target scores");
};

exports.belongsToUser = (req, res) => {
    //Get user that made target of location.
    res.send("get user who made location");
};
