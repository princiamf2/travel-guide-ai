const destinationService = require("../services/destinationService");
const islandService = require("../services/islandService");
const validationService = require("../services/validationService");
const AppError = require("../utils/AppError");

function validateTripQuery(req, res, next) {
    const budget = Number(req.query.budget);
    const duration = Number(req.query.duration);

    const level =
        validationService.normalizeText(
            req.query.level,
            "beginner"
        );

    const style =
        validationService.normalizeText(
            req.query.style,
            "budget"
        );
    const destination =
        destinationService.getDestinationKey(req.query.destination);

    const guide = destinationService.getGuide(destination);

    if (!guide) {
        return next(
            new AppError(
                "destination must be one of: cape-verde, greece, ivory-coast, albania",
                400
            )
        );
    }

    const allowedStyles =
        islandService.getAvailableStyles(guide);

    const optionErrors =
        validationService.validateUserOptions(
            level,
            style,
            allowedStyles
        );

    if (optionErrors.length > 0) {
        return next(
            new AppError(optionErrors.join(", "), 400)
        );
    }

    if (isNaN(budget) || isNaN(duration)) {
        return next(
            new AppError(
                "budget and duration must be numbers",
                400
            )
        );
    }

    if (budget <= 0 || duration <= 0) {
        return next(
            new AppError(
                "budget and duration must be greater than 0",
                400
            )
        );
    }

    if (duration > 30) {
        return next(
            new AppError(
                "duration must be 30 days or less",
                400
            )
        );
    }

    if (budget > 20000) {
        return next(
            new AppError(
                "budget is too high for this beginner travel planner",
                400
            )
        );
    }

    req.cleanedQuery = {
        destination: destination,
        budget: budget,
        duration: duration,
        solo: validationService.parseBoolean(req.query.solo),
        level: level,
        style: style,
        maxIslands:
            req.query.max_islands !== undefined
                ? Number(req.query.max_islands)
                : null,
        currency: req.query.currency || "CHF",
        budgetMode: req.query.budgetMode || "basic"
    };

    next();
}

module.exports = validateTripQuery;