const tripPlannerService = require("../services/tripPlannerService");

async function getTrip(req, res, next) {
    try {
        const tripPlan =
            await tripPlannerService.generateTripPlan(
                req.cleanedQuery
            );

        res.json(tripPlan);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getTrip
};