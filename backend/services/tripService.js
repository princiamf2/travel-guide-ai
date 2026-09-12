const { buildBasicBudget, buildDestinationBudget, buildRealBudget } = require("./budgetService");

function buildBudgetBreakdown(
    budget,
    currency = "CHF",
    budgetMode = "basic",
    duration = 1,
    destination = null
) {
    if (budgetMode === "destination") {
        return buildDestinationBudget(
            budget,
            duration,
            destination,
            currency
        );
    }
    if (budgetMode === "real") {
        return buildRealBudget(
            budget,
            duration,
            destination,
            currency
        );
    }
    return buildBasicBudget(budget, currency);
}

function buildTripDifficulty(userProfile, recommendedIslands, guide) {
    let difficultyScore = 0;
    const cheapestIsland = guide.islands.reduce((cheapest, island) => {
        return island.daily_budget < cheapest.daily_budget ? island : cheapest;
    });

    if (userProfile.dailyBudget < cheapestIsland.daily_budget) {
        difficultyScore += 40;
    }
    if (userProfile.solo === true) {
        difficultyScore += 20;
    }
    if (userProfile.level === "beginner") {
        difficultyScore += 20;
    }
    if (difficultyScore >= 60) {
        return {
            level: "risqué",
            score: difficultyScore,
            message: "Ce voyage demande une bonne préparation. Ton budget ou ton profil peut rendre l'organisation plus difficile."
        };
    }
    if (difficultyScore >= 30) {
        return {
            level: "moyen",
            score: difficultyScore,
            message: "Ce voyage est faisable, mais il faut bien organiser le budget, les déplacements et la sécurité."
        };
    }
    return {
        level: "facile",
        score: difficultyScore,
        message: "Ce voyage semble adapté à ton profil."
    };
}

function buildWarnings(userProfile, recommendedIslands, guide) {
    const warnings = [];
    const cheapestIsland = guide.islands.reduce((cheapest, island) => {
        return island.daily_budget < cheapest.daily_budget ? island : cheapest;
    });

    if (userProfile.dailyBudget < cheapestIsland.daily_budget) {
        warnings.push(
            "Ton budget journalier est inférieur au budget minimum estimé. Le voyage risque d'être compliqué sans ajustement."
        );
    }
    if (recommendedIslands.length === 1) {
        warnings.push(
            "Peu d'options correspondent à ton profil. Il faudrait peut-être augmenter ou reduire la durée."
        );
    }
    return warnings;
}

function buildSuggestions(userProfile, recommendedIslands, guide) {
    const suggestions = [];
    const cheapestIsland = guide.islands.reduce((cheapest, island) => {
        return island.daily_budget < cheapest.daily_budget ? island : cheapest;
    });

    if (userProfile.dailyBudget < cheapestIsland.daily_budget) {
        suggestions.push("Reduire la durée du voyage pour augmenter ton budget journalier.");
        suggestions.push("Augmenter le budget total si possible.");
        suggestions.push(`Commencer par ${cheapestIsland.name}, qui est l'île la moins chère estimée.`);
    }
    if (userProfile.solo === true) {
        suggestions.push("Prévoir un logement bien situé pour éviter les longs déplacements le soir.");
        suggestions.push("Partager ton itinéraire avec un proche avant le départ.");
    }
    if (userProfile.level === "beginner") {
        suggestions.push("Eviter de changer d'île trop souvent pour un premier voyage.");
        suggestions.push("Préparer les transports principaux avant le départ.");
    }
    if (recommendedIslands.length > 2 && userProfile.level === "beginner") {
        suggestions.push("Limiter le voyage à 1 ou 2 îles pour garder un itinéraire simple.");
    }
    return suggestions;
}

function buildTripSummary(duration, userProfile, recommendedIslands, difficulty, guide) {
    const islandNames = recommendedIslands.map((island) => {
        return island.name;
    });

    const mainIslands = islandNames.slice(0, 2).join(" et ");

    let soloText = "en groupe";

    if (userProfile.solo === true) {
        soloText = "en solo";
    }

    return `Voyage de ${duration} jours au ${guide.destination}, ${soloText}, orienté ${userProfile.style}, avec ${mainIslands} comme îles principales. Niveau estimé : ${difficulty.level}.`;
}

function scoreIsland(island, userProfile) {
    let score = 0;
    const reasons = [];
    if (island.daily_budget <= userProfile.dailyBudget) {
        score += 50;
        reasons.push("Compatible avec ton budget journalier");
    }
    if (userProfile.level === "beginner" && island.good_for.includes("beginner")) {
        score += 30;
        reasons.push("Adapté aux voyageurs débutants");
    }
    if (userProfile.solo === true && island.good_for.includes("solo")) {
        score += 20;
        reasons.push("Adapté au voyage solo");
    }
    if (userProfile.style && island.good_for.includes(userProfile.style)) {
        score += 20;
        reasons.push(`Correspond au style ${userProfile.style}`);
    }
    return {
        score: score,
        reasons: reasons
    };
}

function getRecommendedIslands(guide, userProfile) {
    let recommendedIslands = guide.islands.map((island) => {
        const result = scoreIsland(island, userProfile);

        return {
            ...island,
            score: result.score,
            reasons: result.reasons
        };
    }).sort((a, b) => {
        return b.score - a.score;
    });

    recommendedIslands = recommendedIslands.filter((island) => {
        return island.score > 0;
    });

    if (recommendedIslands.length === 0) {
        recommendedIslands = [guide.islands.reduce((cheapest, island) => {
            return island.daily_budget < cheapest.daily_budget ? island : cheapest;
        })];
    }

    return recommendedIslands;
}

function getActivitiesForDay(island, day, type) {
    if (type === "arrival") {
        return [
            "arrivée et installation au logement",
            "Petite balade pour découvrir les environs"
        ];
    }
    if (type === "transfer") {
        return [
            `Transfert vers ${island.name}`,
            "Activité légère selon l'énergie et l'heure d'arrivée"
        ];
    }
    if (type === "departure") {
        return [
            "Préparer les bagages",
            "Dernière balade courte avant le départ"
        ];
    }

    const activities = [];

    if (island.activities.length === 0) {
        return activities;
    }

    const firstIndex = ((day - 1) * 2) % island.activities.length;
    const secondIndex = (firstIndex + 1) % island.activities.length;

    activities.push(island.activities[firstIndex]);

    if (island.activities.length > 1) {
        activities.push(island.activities[secondIndex]);
    }
    return activities;
}

function buildItinerary(islands, duration, userProfile, maxIslands) {
    const itinerary = [];
    let selectedIslands = islands;

    if (maxIslands !== null) {
        selectedIslands = islands.slice(0, maxIslands);
    }
    else if (userProfile.level === "beginner" && islands.length > 2) {
        selectedIslands = islands.slice(0, 2);
    }
   
    const dayPerIsland = Math.ceil(duration / selectedIslands.length);

    for (let day = 1; day <= duration; day++) {
        const islandIndex = Math.floor((day - 1) / dayPerIsland);
        const island = selectedIslands[Math.min(islandIndex, selectedIslands.length - 1)];
        let type = "exploration";

        if (day === 1) {
            type = "arrival";
        } else if (day === duration) {
            type = "departure";
        } else {
            const prevIsland = itinerary.length > 0 ? itinerary[itinerary.length - 1].island : null;

            if (prevIsland && prevIsland !== island.name) {
                type = "transfer";
            }
        }

        itinerary.push({
            day: day,
            type: type,
            island: island.name,
            activities: getActivitiesForDay(island, day, type)
        });
    }
    return itinerary;
}

function collectSafetyTips(islands, solo) {
    const tips = [];

    if (solo === true) {
        tips.push("Prévenir un proche de son itinéraire.");
        tips.push("Eviter de rentrer seul tard le soir.");
    }

    islands.forEach((island) => {
        island.safety_tips.forEach((tip) => {
            if (!tips.includes(tip)) {
                tips.push(tip);
            }
        });
    });
    return tips;
}


module.exports = {
    buildBudgetBreakdown,
    buildTripDifficulty,
    buildWarnings,
    buildSuggestions,
    buildTripSummary,
    scoreIsland,
    getRecommendedIslands,
    getActivitiesForDay,
    buildItinerary,
    collectSafetyTips,
};