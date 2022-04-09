const express = require("express");
const router = express.Router();

const playedTargetController = require("../controller/playedTarget.controller");
const playedTargetScoreController = require("../controller/playedTargetScore.controller");
const playedTargetLinkedController = require("../controller/playedTargetLinkedTargets.controller");

router
    .route("/playedTarget")
    .get(playedTargetController.getPlayedTargets)
    .post(playedTargetController.newPlayedTarget);

router
    .route("/playedTarget/:playedTarget_id")
    .get(playedTargetController.viewPlayedTarget)
    .put(playedTargetController.updatePlayedTarget)
    .delete(playedTargetController.deletePlayedTarget);

router
    .route("playedTarget/target/:target_id")
    .get(playedTargetLinkedController.LinkedTarget)

router
    .route("/playedTarget/:playedTarget_id/score/:score_id")
    .get(playedTargetScoreController.getPlayedTargetScore);

router
    .route("/playedTarget/:playedTarget_id/score/:score_id")
    .get(playedTargetScoreController.getPlayedTargetScores)
    
module.exports = router;