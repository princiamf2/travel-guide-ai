const compareService = require("../services/compareService");

async function compareDestinations(req, res, next) {
    try {
        const budget = Number(req.query.budget);
        const duration = Number(req.query.duration);

        if (isNaN(budget) || isNaN(duration)) {
            return res.status(400).json({
                error: "budget and duration must be numbers"
            });
        }

        if (budget <= 0 || duration <= 0) {
            return res.status(400).json({
                error: "budget and duration must be greater than 0"
            });
        }

        const result = await compareService.compareDestinations({
            budget,
            duration,
            solo: req.query.solo === "true",
            level: req.query.level || "beginner",
            style: req.query.style || "culture",
            currency: req.query.currency || "EUR"
        });

        res.json(result);
    }
    catch (error) {
        next(error);
    }
}

module.exports = {
    compareDestinations
};