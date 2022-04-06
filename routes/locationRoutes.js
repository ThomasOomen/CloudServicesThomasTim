const express = require("express");
const router = express.Router();

const locationController = require("../controller/location.controller");

router
    .route("/location")
    .get(locationController.getLocations)
    .post(locationController.newLocation);

router
    .route("/location/:location_id")
    .get(locationController.viewLocation)
    .put(locationController.updateLocation)
    .delete(locationController.deleteLocation)
    .post(locationController.addTarget);

router
    .route("/location/:location_id/target/:target_id/")
    .get(locationController.getLocationTarget);

router
    .route("/location/:location_id/target")
    .get(locationController.getAllLocationTargets);

router
    .route("/location/:location_id/target/:target_id/hints/:hint_id")
    .get(locationController.getLocationTargetHint);

router
    .route("/location/:location_id/target/:target_id/score/:score_id")
    .get(locationController.getLocationTargetScore);    

router
    .route("/location/:location_id/target/:target_id/score/")
    .get(locationController.getLocationTargetScores);   

router
    .route("/location/target/:target_id")
    .get(locationController.belongsToUser);

module.exports = router
