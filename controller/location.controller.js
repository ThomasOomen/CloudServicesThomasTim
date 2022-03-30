const location = require("../models/location.model");
const target = require("../models/target.model");
const fs = require("fs");

exports.getLocations = (req, res) => {
    //Get all locations.
    const pageLimit = 2;
    let page = 0;
    if(req.query.page){
        page = parseInt(req.query.page)
    }
};

exports.newLocation = (req, res) => {
    //create new location.
};

exports.viewLocation = (req, res) => {
    //view selected location.
};

exports.updateLocation = (req, res) => {
    //update selected location.
};

exports.deleteLocation = (req, res) => {
    //Delete selected location.
};

exports.addTarget = (req, res) => {
    //Add new target to selected location.
};

exports.getLocationTarget = (req, res) => {
    //get target from selected location.
};

exports.getAllLocationTargets = (req, res) => {
    //Get all target of selected location.
};

exports.getLocationTargetHint = (req, res) => {
    //get hints of selected locations.
};

exports.getLocationTargetScore = (req, res) => {
    //get location target score.
};

exports.getLocationTargetScores = (req, res) => {
    //Get location target scores.
};

exports.getLocationTargetTagScore = (req, res) => {
    //Get location target tag score.
};

exports.getLocationTargetTagsScores = (req, res) => {
    //Get location target tag scores.
};

exports.belongsToUser = (req, res) => {
    //Get user that made target of location.
};
