const express = require("express");
const router = express.Router();

const playedTargetController = require("../controllers/playedTarget.controller");

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
    .get(playedTargetController.LinkedTarget)

router
    .route("/playedTarget/:playedTarget_id/score/:score_id")
    .get(playedTargetController.getPlayedTargetScore);

router
    .route("/playedTarget/:playedTarget_id/score/:score_id")
    .get(playedTargetController.getPlayedTargetScores)

    //x
router
    .route("/playedTarget/:playedTarget_id/score/:score_id/tag/:tag_id")
    .get(playedTargetController.getPlayedTargetTagScore)

router
    .route("/playedTarget/:playedTarget_id/score/:score_id/tag")
    .get(playedTargetController.getPlayedTargetTagsScore)