
async function getCoordinatesFromPlaceName(placeName) {
    const url =
        "https://geocoding-api.open-meteo.com/v1/search" +
        `?name=${encodeURIComponent(placeName)}` +
        "&count=1" +
        "&language=fr" +
        "&format=json";

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error(`No coordinates found for ${placeName}`);
    }

    return {
        latitude: data.results[0].latitude,
        longitude: data.results[0].longitude
    };
}

async function fetchWeatherForIsland(island) {

    let coordinates = island.coordinates;
    try {
        coordinates = await getCoordinatesFromPlaceName(island.name);
    }
    catch {
        return {
            island: island.name,
            error: "Impossible de récupérer les coordonnées"
        };
    }
    const latitude = coordinates.latitude;
    const longitude = coordinates.longitude;

    const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${latitude}` +
        `&longitude=${longitude}` +
        `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max` +
        `&forecast_days=7` +
        `&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
    }
    const data = await response.json();
    return {
        island: island.name,
        latitude: latitude,
        longitude: longitude,
        daily: data.daily
    };
}

module.exports = {
    fetchWeatherForIsland,
}