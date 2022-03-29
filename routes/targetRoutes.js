const express = require("express");
const router = express.Router();

const targetController = require('../controller/target.controller');

router
    .route("/target")
    .get(targetController.getTargets)
    .post(targetController.newTarget)

router
    .route("/target/:target_id")
    .get(targetController.viewTarget)
    .put(targetController.updateTarget)
    .delete(targetController.deleteTarget)

router
    .route("/target/:target_id/score")
    .get(targetController.getTargetScores)

router
    .route("/target/:target_id/score/:score_id")
    .get(targetController.getTargetScore)

router
    .route("/target/:target_id/score/:score_id/tag/:tag_id")
    .get(targetController.getTargetTagScore);

router
    .route('/target/:target_id/hints/:hint_id')
    .get(targetController.getTargetHint);

