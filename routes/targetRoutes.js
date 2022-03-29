const express = require("express");
const router = express.Router();

const targetController = require('../controller/locationController');

router
    .route("/target")
    .get(targetController.getTargets)
    .post(targetController.newTarget)