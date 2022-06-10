const Location = require("../models/location.model");
const Target = require("../models/target.model");
const helpers = require("./helper.controller");
let sendData = helpers.sendJsonXml;

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
    const location = new Location();
    const LocationObj = req.body;
    Object.keys(LocationObj).forEach((key) => {
        location[key] = LocationObj[key];
    });
    // save the Location and check for errors
    location.save((LocationError) => {
        if (LocationError) {
            res.status(400).json({
                status: 'error',
                error: LocationError,
            });
        }
        else {
            res.status(201).json({
                message: 'New Location created!',
                data: location,
            });
        }
    });
};

exports.viewLocation = (req, res) => {
    Location.findById(req.params.location_id, (err, location) => {
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

exports.updateLocation = (req, res) => {
    Location.findByIdAndUpdate(
        req.params.location_id,
        req.body,
        { new: true, runValidators: true },
        (err, location) => {
            if (err) {
                res.status(400).json({
                    status: 'error',
                    error: err,
                });
            }
            else {
                res.status(200).sendData(JSON.stringify({
                    message: 'Location Info updated',
                    data: location,
                }));
            }
        },
    );
};