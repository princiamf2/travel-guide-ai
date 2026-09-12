import * as Location from "expo-location";

export async function getCurrentCoordinates() {
    const permission = await Location.requestForegroundPermissionsAsync();

    if (permission.status !== "granted") {
        throw new Error("Permission de localisation refusée.");
    }
    const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
    });
    return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    };
}