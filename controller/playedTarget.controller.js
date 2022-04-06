const playedTarget = require("../models/playedTarget.model");
const target = require("../models/target.model");
const fs = require("fs");

exports.getPlayedTargets = (req, res) => {
    //Get all played targets.
    res.send("get played targets");
};

exports.newPlayedTarget = (req, res) => {
    //new played target.
    res.send("new played targets");
};

exports.viewPlayedTarget = (req, res) => {
    //view selected played target.
    res.send("view played targets");
};

exports.updatePlayedTarget = (req, res) => {
    //update selected played target.
    res.send("update played targets");
};

exports.deletePlayedTarget = (req, res) => {
    //delete selected played target.
    res.send("delete played targets");
};

exports.LinkedTarget = (req, res) => {
    //Get linked target.
    res.send("linked played targets");
};

exports.getPlayedTargetScore = (req, res) => {
    //get played target score.
    res.send("get played targets score");
};

exports.getPlayedTargetScores = (req, res) => {
    //get played target scores. 
    res.send("get played targets");
};

exports.getPlayedTargetTagScore = (req, res) => {
    //get played target tag score.
    res.send("get played targets");
};

exports.getPlayedTargetTagsScore = (req, res) => {
    //get played target tags score.
    res.send("get played targets");
};