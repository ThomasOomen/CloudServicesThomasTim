const express = require("express");
const router = express.Router();
const verify = require("../controller/authorization.controller")

const targetController = require('../controller/target.controller');
const targetScoreController = require("../controller/targetScore.controller");
const targetHintController = require("../controller/targetHint.controller");

router
    .route("/target")
    .get(verify, targetController.getTargets)
    .post(verify, targetController.newTarget);
    
router
    .route("/target/:target_id")
    .get(verify, targetController.viewTarget)
    .put(verify, targetController.updateTarget)
    .delete(verify, targetController.deleteTarget);

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
