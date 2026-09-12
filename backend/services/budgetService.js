const DESTINATION_COSTS = {
    "Grèce": {
        accommodationPerDay: 70,
        foodPerDay: 30,
        transportPerDay: 15,
        activitiesPerDay: 25
    },
    "Cap-Vert": {
        accommodationPerDay: 45,
        foodPerDay: 20,
        transportPerDay: 12,
        activitiesPerDay: 20
    },
    "Albanie": {
        accommodationPerDay: 35,
        foodPerDay: 18,
        transportPerDay: 10,
        activitiesPerDay: 15
    },
    "Côte d'Ivoire": {
        accommodationPerDay: 40,
        foodPerDay: 20,
        transportPerDay: 12,
        activitiesPerDay: 18
    }
};

function buildBasicBudget(totalBudget, currency = "CHF") {
    return {
        type: "basic",
        currency,
        accommodation: Math.round(totalBudget * 0.30),
        food:Math.round(totalBudget * 0.20),
        transport: Math.round(totalBudget * 0.15),
        activities: Math.round(totalBudget * 0.15),
        emergency: Math.round(totalBudget * 0.20),
        note: "Estimation simple basée sur ton budget total."
    };
}

function buildDestinationBudget(totalBudget, duration, destination, currency = "CHF") {
    const costs = DESTINATION_COSTS[destination];

    if (!costs) {
        return buildBasicBudget(totalBudget, currency);
    }

    const accommodation = costs.accommodationPerDay * duration;
    const food = costs.foodPerDay * duration;
    const transport = costs.transportPerDay * duration;
    const activities = costs.activitiesPerDay * duration;
    const estimatedTotal = accommodation + food + transport + activities;
    const remainingBudget = totalBudget - estimatedTotal;
    const marginRatio = remainingBudget / estimatedTotal;

    let status = "comfortable";

    if (remainingBudget < 0) {
        status = "insufficient";
    }
    else if (marginRatio < 0.20) {
        status = "tight";
    }

    let message = "Ton budget semble confortable pour cette destination.";
    if (status === "insufficient") {
        message = "Ton budget semble trop faible pour cette destination";
    }
    else if (status === "tight") {
        "Ton budget est suffisant mais avec peu de marge.";
    }

    return {
        type: "destination",
        currency,
        destination,
        duration,
        total_budget: totalBudget,

        accommodation,
        food,
        transport,
        activities,
        estimated_total: estimatedTotal,
        remaining_budget: remainingBudget,
        margin_ratio: Number(marginRatio.toFixed(2)),
        status,
        message,
        note: "Estimation Premium basée sur les coûts moyens de la destination.",
    };
}

function buildRealBudget(totalBudget, duration, destination, currency = "CHF") {
    return {
        type: "real",
        currency,
        destination,
        duration,
        total_budget: totalBudget,
        flights: null,
        accommodation: null,
        activities: null,
        note: "Budget Premium+ préparé pour les vols, hôtels et activités réels. Pas encore activé."
    };
}

module.exports = {
    buildBasicBudget,
    buildDestinationBudget,
    buildRealBudget
};