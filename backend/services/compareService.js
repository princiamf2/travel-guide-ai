const destinationService = require("./destinationService");
const tripPlannerService = require("./tripPlannerService");

function getStatusWeight(status) {
    if (status === "comfortable") {
        return 3;
    }
    if (status === "tight") {
        return 2;
    }
    if (status === "insufficient") {
        return 1;
    }
    return 0;
}

function buildCompareScore(trip) {
    const budget = trip.budget_breakdown;

    let score = 0;

    score += getStatusWeight(budget.status) * 30;

    if (budget.remaining_budget > 0) {
        score += budget.remaining_budget / 10;
    }
    else {
        score += budget.remaining_budget / 20;
    }
    if (trip.difficulty?.level === "facile") {
        score += 20;
    }
    else if (trip.difficulty?.level === "moyen") {
        score += 10;
    }
    if (trip.recommended_island?.length > 0) {
        score += Math.min(20, trip.recommended_island[0].score / 5);
    }
    return Math.round(score);
}

async function compareDestinations(query) {
    const destinations = destinationService.getAvailableDestinations();

    const results = await Promise.all(
        destinations.map(async (destination) => {
            const trip = await tripPlannerService.generateTripPlan({
                destination,
                budget: query.budget,
                duration: query.duration,
                solo: query.solo,
                level: query.level,
                style: query.style,
                maxIslands: null,
                currency: query.currency,
                budgetMode: "destination"
            });

            const budget = trip.budget_breakdown;

            return {
                destination_key: destination,
                destination: trip.destination,
                score: buildCompareScore(trip),
                estimated_total: budget.estimated_total,
                remaining_budget: budget.remaining_budget,
                status: budget.status,
                message: budget.message,
                currency: budget.currency,
                duration: trip.duration,
                difficulty: trip.difficulty,
                best_places: trip.recommended_islands?.slice(0, 3) || [],
                budget_breakdown: budget
            };
        })
    );

    results.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }

        return b.remaining_budget - a.remaining_budget;
    });

    results.forEach((item, index) => {
        item.rank = index + 1;

        if (index === 0) {
            item.recommendation = "Meilleur choix selon ton budget et ton profil.";
        }
        else if (item.status === "comfortable") {
            item.recommendation = "Très bonne alternative.";
        }
        else if (item.status === "tight") {
            item.recommendation = "Possible, mais avec un marge limitée.";
        }
        else {
            item.recommendation = "Budget trop faible pour cette destination.";
        }
    });

    return {
        budget: query.budget,
        duration: query.duration,
        solo: query.solo,
        level: query.level,
        style: query.style,
        currency: query.currency,
        ranking: results,
        best_destination: results[0] || null
    };
}

module.exports = {
    compareDestinations
};