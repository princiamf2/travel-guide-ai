const config = require("../config");

function getHealth(req, res) {
    res.json({
        status: "OK",
        service: config.serviceName,
        timestamp: new Date().toISOString()
    });
}

module.exports = {
    getHealth
};