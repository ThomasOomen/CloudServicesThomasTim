const express = require("express");

//routes
const router = express.Router();
const targetRoutes = require("./targetRoutes");
const locationRoutes = require("./locationRoutes");
const playedTargetsRoutes = require("./playedTargetRoutes");
const authRouter = require("./authorization");

router.use("/targetRoutes", targetRoutes);
router.use("/locationRoutes", locationRoutes);
router.use("/playedTargetRoutes", playedTargetsRoutes);
router.use("/authorization", authRouter);

module.exports = router;