const express = require("express");
const target = require("../models/target.model");
const playedTargets = require("../models/playedTarget.model");
//const location = require("../models/location.model");
const password = require('password');
const jwt = require('jsonwebtoken');
const router = express.Router();

//routes
const targetRoutes = require("./targetRoutes");
const locationRoutes = require("./locationRoutes");
const playedTargetsRoutes = require("./playedTargetRoutes");
const userRoutes = require("./userRoutes");
const authRouter = require("./authorization");

router.use("./targetRoutes", targetRoutes);
router.use("./locationRoutes", locationRoutes);
router.use("./playedTargetRoutes", playedTargetsRoutes);
router.use("./userRoutes", userRoutes);
router.use("./authorization", authRouter);

module.exports = router;