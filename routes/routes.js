const express = require("express");
const target = require("../models/targets.model");
const playedTargets = require("../models/playedTarget.model");
//const location = require("../models/location.model");
const password = require('password');
const jwt = require('jsonwebtoken');

const router = express.Router();

//Controllers
const locationController = require('../controllers/location.controller');
const locationScoreController = require('../controllers/locationScore.controller');
const playedTargetController = require('../controllers/playedTarget.controller');
const playedTargetScoreController = require('../controllers/playedTargetScores.controller');

const targetLocationController = require('../controllers/targetLocationController');
const targetScoreController = require('../controllers/targetScore.controller');

//routes
const targetRoutes = require("./targetRoutes");
const locationRoutes = require("./locatonRoutes");
const playedTargetsRoutes = require("./playedTargetRoutes");
const userRoutes = require("./userRoutes");

