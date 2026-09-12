const path = require("path");

const destinations = {
    "cape-verde": "cape-verde.json",
    "greece": "greece.json",
    "ivory-coast": "ivory-coast.json",
    "albania": "albania.json"
};

function getDestinationKey(value) {
    if (!value) {
        return "cape-verde";
    }

    return value.toLowerCase().trim();
}

function getGuide(destination) {
    const key = getDestinationKey(destination);
    const filename = destinations[key];

    if (!filename) {
        return null;
    }

    const filePath = path.join(
        __dirname,
        "..",
        "data",
        "destinations",
        filename
    );

    return require(filePath);
}

function getAvailableDestinations() {
    return Object.keys(destinations);
}

module.exports = {
    getDestinationKey,
    getGuide,
    getAvailableDestinations
};