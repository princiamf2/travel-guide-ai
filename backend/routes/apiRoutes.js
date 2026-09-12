const express = require("express");
const router = express.Router();

const apiController = require("../controllers/apiController");

router.get("/api", apiController.getApiInfo);

module.exports = router;