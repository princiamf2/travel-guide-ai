const express = require("express");
require("./database/db");
const config = require("./config");
const tripService = require("./services/tripService");
const islandService = require("./services/islandService");
const weatherService = require("./services/weatherService");
const islandRoutes = require("./routes/islandRoutes");
const tripRoutes = require("./routes/tripRoutes");
const apiRoutes = require("./routes/apiRoutes");
const authRoutes = require("./routes/authRoutes");
const requestLogger = require("./middlewares/requestLogger");
const notFoundHandler = require("./middlewares/notFoundHandler");
const errorHandler = require("./middlewares/errorHandler");
const healthRoutes = require("./routes/healthRoutes");
const userTripRoutes = require("./routes/userTripRoutes");
const path = require("path");
const compareRoutes = require("./routes/compareRoutes");


const app = express();

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(requestLogger);
app.get("/", (req, res) => {
    res.json({
        message: "Backend is running",
        status: "OK"
    });
});

app.get("/guide", (req, res) => {
    res.json(guide);
});

app.get("/levels", (req, res) => {
    res.json({
        count: ALLOWED_LEVELS.length,
        levels: ALLOWED_LEVELS
    });
});

app.use("/auth", authRoutes);
app.use("/", userTripRoutes);
app.use("/", apiRoutes);
app.use("/", tripRoutes);
app.use("/compare", compareRoutes);
app.use("/", islandRoutes);
app.use("/", healthRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
});