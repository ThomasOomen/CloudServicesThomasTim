const Target = require("../models/target.model");
const fs = require("fs");

exports.getTargets = (req, res) => {
    //Get all target.
    res.send("get all targets");
};

exports.newTarget = (req, res) => {
    //create new target.
    res.send("create new target");
};

exports.viewTarget = (req, res) => {
    //view selected target.
    res.send("view target");
};

exports.updateTarget = (req, res) => {
    //update selected target.
    res.send("update selected target");
};

exports.deleteTarget = (req, res) => {
    //delete selected target.
    res.send("delete selected target");
};

exports.getTargetScores = (req, res) => {
    //get selected target score.
    res.send("get scores of target");
};

exports.getTargetScore = (req, res) => {
    res.send("get target score");
};

exports.getTargetHint = (req, res) => {
    //get selected target hint. 
    res.send("get target hint");
};

function findById(){
    //try :get target by id
    //else: error. 
}