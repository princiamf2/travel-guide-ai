const destinationService = require("./destinationService");
const crypto = require("crypto");
const itineraryEnrichmentService = require("./itineraryEnrichmentService");

const tripService =
    require("./tripService");

const weatherService =
    require("./weatherService");

async function generateTripPlan(cleanedQuery) {
    const {
        destination,
        budget,
        duration,
        solo,
        level,
        style,
        maxIslands,
        currency,
        budgetMode
    } = cleanedQuery;

    const guide = destinationService.getGuide(destination);

    if (!guide) {
        throw new Error("Unsupported destination");
    }
    
    const dailyBudget = budget / duration;

    const userProfile = {
        dailyBudget,
        solo,
        level,
        style
    };

    const recommendedIslands =
        tripService.getRecommendedIslands(
            guide,
            userProfile
        );

    const rawItinerary =
        tripService.buildItinerary(
            recommendedIslands,
            duration,
            userProfile,
            maxIslands
        );

    const itinerary =
        await itineraryEnrichmentService.enrichItineraryWithWikipedia(rawItinerary);

    const safetyTips =
        tripService.collectSafetyTips(
            recommendedIslands,
            solo
        );

    const warnings =
        tripService.buildWarnings(
            userProfile,
            recommendedIslands,
            guide
        );

    const budgetBreakdown =
        tripService.buildBudgetBreakdown(
            budget,
            currency || "CHF",
            budgetMode,
            duration,
            guide.destination
        );

    const difficulty =
        tripService.buildTripDifficulty(
            userProfile,
            recommendedIslands,
            guide
        );

    const suggestions =
        tripService.buildSuggestions(
            userProfile,
            recommendedIslands,
            guide
        );

    const summary =
        tripService.buildTripSummary(
            duration,
            userProfile,
            recommendedIslands,
            difficulty,
            guide
        );

    const weather = await Promise.all(
        recommendedIslands.map(async (island) => {
            try {
                return await weatherService
                    .fetchWeatherForIsland(island);

            } catch (error) {
                return {
                    island: island.name,
                    error: "weather unavailable",
                    message: error.message
                };
            }
        })
    );

    const tripId = crypto.randomUUID();

    return {
        trip_id: tripId,
        destination: guide.destination,
        total_budget: budget,
        duration,
        daily_budget: dailyBudget,
        solo,

        recommended_islands:
            recommendedIslands.map((island) => {
                return {
                    name: island.name,
                    score: island.score,
                    reasons: island.reasons
                };
            }),

        itinerary,
        checklist: guide.checklist,
        safety_tips: safetyTips,
        warnings,
        budget_breakdown: budgetBreakdown,
        difficulty,
        suggestions,
        summary,
        weather
    };
}

module.exports = {
    generateTripPlan
};