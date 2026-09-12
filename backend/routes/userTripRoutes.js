const express = require("express");
const router = express.Router();

const authMiddleware =
    require("../middlewares/authMiddleware");

const {
    saveTrip,
    getMyTrips,
    deleteTrip
} = require("../controllers/userTripController");

router.post("/my-trips", authMiddleware, saveTrip);

router.get("/my-trips", authMiddleware, getMyTrips);

router.delete("/my-trips/:id", authMiddleware, deleteTrip);

module.exports = router;