const playedTarget = require("../models/playedTarget.model");
const target = require("../models/target.model");
const fs = require("fs");

exports.getPlayedTargets = (req, res) => {
    //Get all played targets.
    console.log("doe iets");
    res.send("get played Targets");
};

exports.newPlayedTarget = (req, res) => {
    //new played target.
};

exports.viewPlayedTarget = (req, res) => {
    //view selected played target.
};

exports.updatePlayedTarget = (req, res) => {
    //update selected played target.
};

exports.deletePlayedTarget = (req, res) => {
    //delete selected played target.
};

exports.LinkedTarget = (req, res) => {
    //Get linked target.
};

exports.getPlayedTargetScore = (req, res) => {
    //get played target score.
};

exports.getPlayedTargetScores = (req, res) => {
    //get played target scores. 
};

exports.getPlayedTargetTagScore = (req, res) => {
    //get played target tag score.
};

exports.getPlayedTargetTagsScore = (req, res) => {
    //get played target tags score.
};