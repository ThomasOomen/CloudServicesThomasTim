const express = require("express");
const router = express.Router();

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
    .get(locationTargetController.getLocationTarget);

router
    .route("/location/:location_id/target")
    .get(locationTargetController.getAllLocationTargets);

router
    .route("/location/:location_id/target/:target_id/hints/:hint_id")
    .get(locationTargetHintController.getLocationTargetHint);

router
    .route("/location/:location_id/target/:target_id/score/:score_id")
    .get(locationTargetScoreController.getLocationTargetScore);    

router
    .route("/location/:location_id/target/:target_id/score/")
    .get(locationTargetScoreController.getLocationTargetScores);   

router
    .route("/location/target/:target_id")
    .get(locationOwnerController.belongsToUser);

module.exports = router
