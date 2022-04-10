const express = require("express");
const router = express.Router();
const verify = require("../controller/authorization.controller");

const locationController = require("../controller/location.controller");
const locationTargetController = require("../controller/locationTarget.controller");
const locationTargetHintController = require("../controller/locationTargetHint.controller")
const locationTargetScoreController = require("../controller/locationTargetScore.controller");
const locationOwnerController = require("../controller/locationOwner.controller");

router
    .route("/location")
    .get(locationController.getLocations)
    .post(locationController.newLocation);

router
    .route("/location/:location_id")
    .get(locationController.viewLocation)
    .put(locationController.updateLocation)
    .delete(locationTargetController.deleteLocation)
    .post(locationTargetController.addTarget);

router
    .route("/location/:location_id/target/:target_id/")
    .get(verify, locationTargetController.getLocationTarget);

router
    .route("/location/:location_id/target")
    .get(verify, locationTargetController.getAllLocationTargets);

router
    .route("/location/:location_id/target/:target_id/hints/:hint_id")
    .get(verify, locationTargetHintController.getLocationTargetHint);

router
    .route("/location/:location_id/target/:target_id/score/:score_id")
    .get(verify, locationTargetScoreController.getLocationTargetScore);    

router
    .route("/location/:location_id/target/:target_id/score/")
    .get(verify, locationTargetScoreController.getLocationTargetScores);   

router
    .route("/location/target/:target_id")
    .get(verify, locationOwnerController.belongsToUser);

module.exports = router
