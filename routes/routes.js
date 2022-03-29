const express = require("express");
const target = require("../models/targets.model");
const playedTargets = require("../models/playedTarget.model");
//const location = require("../models/location.model");
const password = require('password');
const jwt = require('jsonwebtoken');

const router = express.Router();

//Controllers

const playedTargetController = require('../controllers/playedTarget.controller');
const userController = require("../controller/userController.controller");

//routes
const targetRoutes = require("./targetRoutes");
const locationRoutes = require("./locationRoutes");
const playedTargetsRoutes = require("./playedTargetRoutes");
const userRoutes = require("./userRoutes");

