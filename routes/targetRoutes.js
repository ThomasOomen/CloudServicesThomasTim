const express = require("express");
const router = express.Router();
const verify = require("../controller/authorization.controller")

const targetController = require('../controller/target.controller');
const targetScoreController = require("../controller/targetScore.controller");
const targetHintController = require("../controller/targetHint.controller");

router
    .route("/target")
    .get(targetController.getTargets)
    .post(targetController.newTarget);
    
router
    .route("/target/:target_id")
    .get(targetController.viewTarget)
    .put(targetController.updateTarget)
    .delete(targetController.deleteTarget);

router
    .route("/target/:target_id/score/:score_id")
    .get(verify, targetScoreController.getTargetScore);

router
    .route("/target/:target_id/score")
    .get(verify, targetScoreController.getTargetScores);

router
    .route('/target/:target_id/hints/:hint_id')
    .get(verify, targetHintController.getTargetHint);

module.exports = router
