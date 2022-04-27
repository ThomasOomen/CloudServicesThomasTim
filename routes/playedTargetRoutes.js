const express = require("express");
const router = express.Router();
const verify = require("../controller/authorization.controller")

const playedTargetController = require("../controller/playedTarget.controller");
const playedTargetScoreController = require("../controller/playedTargetScore.controller");
const playedTargetLinkedController = require("../controller/playedTargetLinkedTargets.controller");

router
    .route("/playedTarget")
    .get(verify, playedTargetController.getPlayedTargets)
    .post(verify, playedTargetController.newPlayedTarget);

router
    .route("/playedTarget/:playedTarget_id")
    .get(verify, playedTargetController.viewPlayedTarget)
    .put(verify, playedTargetController.updatePlayedTarget)
    .delete(verify, playedTargetController.deletePlayedTarget);

router
    .route("playedTarget/target/:target_id")
    .get(verify, playedTargetLinkedController.LinkedTarget)

router
    .route("/playedTarget/:playedTarget_id/score/:score_id")
    .get(verify, playedTargetScoreController.getPlayedTargetScore);

router
    .route("/playedTarget/:playedTarget_id/scores/:target_id")
    .get(verify, playedTargetScoreController.getPlayedTargetScores)
    
module.exports = router;