import { useEffect, useState } from "react";

import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Pressable,
    Alert,
    ImageBackground
} from "react-native";

const HistoryImage = {
    "Cap-Vert": require("../../assets/images/destination/cap-vert.jpeg"),
    "Grèce": require("../../assets/images/destination/grece.jpg"),
    "Albanie": require("../../assets/images/destination/albanie.jpg"),
    "Côte d'Ivoire": require("../../assets/images/destination/ivory-coast.jpg")
};

import { router } from "expo-router";

import { getToken } from "../storage/authStorage";
import { getMyTrips, deleteTrip } from "../services/api";

export default function HistoryScreen() {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTrips();
    }, []);

    async function loadTrips() {
        try {
            const token = await getToken();

            const data = await getMyTrips(token);

            setTrips(data.trips || []);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    }

    function confirmDeleteTrip(tripId) {
        Alert.alert(
            "supprimer le voyage",
            "Es-tu sûr de vouloir supprimer ce voyage ?",
            [
                {
                    text: "Annuler",
                    style: "cancel"
                },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: () => handleDeleteTrip(tripId)
                }
            ]
        );
    }

    async function handleDeleteTrip(tripId) {
        try {
            const token = await getToken();
            await deleteTrip(token, tripId);
            setTrips((currentTrips) =>
                currentTrips.filter((trip) => trip.id !== tripId)
            );
        }
        catch (error) {
            console.log(error);
        }
    }

    if (loading) {
        return (
            <View style={styles.center}>
                <Text>Chargement...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>
                Mes voyages
            </Text>

            <Text style={styles.stats}>
                {trips.length} voyage{trips.length > 1 ? "s" : ""} sauvegardé{trips.length > 1 ? "s" : ""}
            </Text>

            {trips.length === 0 ? (
                <Text>Aucun voyage sauvegardé</Text>
            ) : (
                trips.map((trip) => (
                    <Pressable
                        key={trip.id}
                        style={styles.card}
                        onPress={() => {
                            const savedTrip = trip.result_json
                                ? JSON.parse(trip.result_json)
                                : trip;

                            router.push({
                                pathname: "/trip-result",
                                params: {
                                    trip: JSON.stringify(savedTrip)
                                }
                            });
                        }}
                    >
                        <ImageBackground
                            source={HistoryImage[trip.destination]}
                            style={styles.cardImage}
                            imageStyle={styles.cardImageRadius}
                        />

                        <View style={styles.cardContent}>
                            <Text style={styles.cardTitle}>
                                {trip.destination}
                            </Text>

                            <Text style={styles.cardMeta}>
                                {trip.duration} jours • {trip.budget} CHF 
                            </Text>

                            <Text style={styles.date}>
                                {new Date(trip.created_at).toLocaleDateString()}
                            </Text>

                            <Pressable
                                style={styles.deleteButton}
                                onPress={(event) => {
                                    event.stopPropagation();
                                    confirmDeleteTrip(trip.id);
                                }}
                            >
                                <Text style={styles.deleteButtonText}>Supprimer</Text>
                            </Pressable>
                        </View>
                    </Pressable>
                ))
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f9fafb"
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 20
    },
    card: {
        backgroundColor: "white",
        borderRadius: 18,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        overflow: "hidden"
    },
    cardImage: {
        height: 110,
        width: "100%"
    },
    cardImageRadius: {
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18
    },
    cardContent: {
        padding: 14
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 6
    },
    cardMeta: {
        fontSize: 15,
        color: "#374151",
        marginBottom: 4
    },
    date: {
        color: "#6b7280",
        marginBottom: 10
    },
    deleteButton: {
        backgroundColor: "#dc2626",
        padding: 10,
        borderRadius: 10
    },
    deleteButtonText: {
        color: "white",
        textAlign: "center",
        fontWeight: "bold"
    },
    stats: {
        color: "#6b7280",
        marginBottom: 20,
        fontSize: 16
    },
});