const islandService = require("../services/islandService");
const destinationService = require("../services/destinationService");

function getGuideFromRequest(req) {
    const destination = destinationService.getDestinationKey(
        req.query.destination
    );

    const guide = destinationService.getGuide(destination);

    return {
        destination,
        guide
    };
}

function getIslands(req, res) {
    const { destination, guide } = getGuideFromRequest(req);

    if (!guide) {
        return res.status(400).json({
            error: "Unsupported destination",
            available_destinations: destinationService.getAvailableDestinations()
        });
    }

    const islands = guide.islands.map((island) => {
        return {
            name: island.name,
            daily_budget: island.daily_budget,
            good_for: island.good_for,
            activities_count: island.activities.length,
            has_weather: island.coordinates ? true : false
        };
    });

    res.json({
        destination_key: destination,
        destination: guide.destination,
        count: islands.length,
        cities: islands
    });
}

function getIslandByName(req, res) {
    const { destination, guide } = getGuideFromRequest(req);

    if (!guide) {
        return res.status(400).json({
            error: "Unsupported destination",
            available_destinations: destinationService.getAvailableDestinations()
        });
    }

    const requestedName =
        islandService.normalizeIslandName(req.params.name);

    const island = guide.islands.find((island) => {
        return islandService.normalizeIslandName(island.name) === requestedName;
    });

    if (!island) {
        return res.status(404).json({
            error: "city not found",
            destination_key: destination,
            requested: req.params.name
        });
    }

    res.json({
        destination_key: destination,
        destination: guide.destination,
        city: island
    });
}

function getStyles(req, res) {
    const { destination, guide } = getGuideFromRequest(req);

    if (!guide) {
        return res.status(400).json({
            error: "Unsupported destination",
            available_destinations: destinationService.getAvailableDestinations()
        });
    }

    const styles = islandService.getAvailableStyles(guide);

    res.json({
        destination_key: destination,
        destination: guide.destination,
        count: styles.length,
        styles: styles
    });
}

function getDestinations(req, res) {
    res.json({
        destinations: destinationService.getAvailableDestinations()
    });
}

module.exports = {
    getIslands,
    getIslandByName,
    getStyles,
    getDestinations
};