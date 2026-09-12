const wikiService = require("./wikiService");

async function enrichActivity(activity) {
    if (typeof activity === "string") {
        return {
            title: activity,
            wiki_title: null,
            description: null,
            image: null,
            estimated_price: null,
            duration: null,
            category: "general"
        };
    }

    if (!activity.wiki_title) {
        return {
            ...activity,
            description: null,
            image: null
        };
    }

    const wikiData = await wikiService.searchWikipedia(
        activity.wiki_title
    );

    return {
        ...activity,
        description: wikiData?.description || null,
        image: wikiData?.image || null
    };
}

async function enrichItineraryWithWikipedia(itinerary) {
    return Promise.all(
        itinerary.map(async (day) => {
            const enrichedActivities = await Promise.all(
                day.activities.map(enrichActivity)
            );

            return {
                ...day,
                activities: enrichedActivities
            };
        })
    );
}

module.exports = {
    enrichItineraryWithWikipedia
};