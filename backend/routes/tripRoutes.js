const express = require("express");
const router = express.Router();

const tripController = require("../controllers/tripController");
const validateTripQuery = require("../middlewares/validateTripQuery");

router.get("/trip", validateTripQuery, tripController.getTrip);

module.exports = router;