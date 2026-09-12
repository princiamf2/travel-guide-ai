const express = require("express");
const router = express.Router();

const islandController = require("../controllers/islandController");

router.get("/destinations", islandController.getDestinations);
router.get("/islands", islandController.getIslands);
router.get("/islands/:name", islandController.getIslandByName);
router.get("/styles", islandController.getStyles);

module.exports = router;