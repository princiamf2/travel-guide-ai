import { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, Image } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { removeToken, getToken } from "../storage/authStorage";
import { getTrip, getMe, saveTrip, getApiUrl } from "../services/api";
import { getCurrentCoordinates } from "../services/locationService";

const DESTINATIONS = [
    { key: "cape-verde", label: "Cap-Vert", subtitle: "Îles, culture et plages", image: require("../../assets/images/destination/cap-vert.jpeg") },
    { key: "greece", label: "Grèce", subtitle: "Histoire, mer et villes mythiques", image: require("../../assets/images/destination/grece.jpg") },
    { key: "ivory-coast", label: "Côte d'Ivoire", subtitle: "Culture et grandes villes", image: require("../../assets/images/destination/ivory-coast.jpg") },
    { key: "albania", label: "Albanie", subtitle: "Budget, plages et découverte", image: require("../../assets/images/destination/albanie.jpg") }
];

export default function TripFormScreen() {
    const params = useLocalSearchParams();

    const [budget, setBudget] = useState(
        typeof params.budget === "string" ? params.budget : "1500"
    );

    const [duration, setDuration] = useState(
        typeof params.duration === "string" ? params.duration : "7"
    );

    const [solo, setSolo] = useState(params.solo === "true");
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [step, setStep] = useState("destination");
    const [destination, setDestination] = useState("cape-verde");
    const [error, setError] = useState("");

    const userCurrency = user?.currency || "CHF";
    const userFirstName = user?.first_name || "voyageur";

    useEffect(() => {
        async function loadProfile() {
            try {
                const token = await getToken();

                if (!token) {
                    router.replace("/login");
                    return;
                }

                const data = await getMe(token);
                setUser(data);
            }
            catch (error) {
                console.log(error);
                await removeToken();
                router.replace("/login");
            }
        }

        loadProfile();
    }, []);

    async function getOptionalCoordinates() {
        try {
            return await getCurrentCoordinates();
        }
        catch (error) {
            console.log("Localisation ignorée :", error.message);
            return null;
        }
    }

    async function handleGenerateTrip() {
        try {
            setLoading(true);
            setError("");

            const budgetNumber = Number(budget);
            const durationNumber = Number(duration);

            if (!budget || isNaN(budgetNumber) || budgetNumber <= 0) {
                setError("Entre un budget valide.");
                return;
            }

            if (!duration || isNaN(durationNumber) || durationNumber <= 0) {
                setError("Entre une durée valide.");
                return;
            }

            const token = await getToken();
            const coordinates = await getOptionalCoordinates();

            const tripParams = {
                destination,
                budget,
                duration,
                solo: solo ? "true" : "false",
                level: "beginner",
                style: "culture",
                currency: userCurrency,
                budgetMode: "destination"
            };

            if (coordinates) {
                tripParams.userLat = coordinates.latitude;
                tripParams.userLng = coordinates.longitude;
            }

            const data = await getTrip(tripParams);

            const saved = await saveTrip(token, {
                destination: data.destination,
                budget: data.total_budget,
                duration: data.duration,
                solo: data.solo,
                level: "beginner",
                style: "culture",
                result: data
            });

            router.push({
                pathname: "/trip-result",
                params: {
                    trip: JSON.stringify(data),
                    tripId: saved.tripId
                }
            });
        }
        catch (error) {
            setError(error.message || "Impossible de générer le voyage.");
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    }

    if (step === "destination") {
        return (
            <ScrollView
                style={styles.screen}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <Text style={styles.hello}>
                            Bonjour {userFirstName} 👋
                        </Text>

                        <Pressable
                            style={styles.profileIconButton}
                            onPress={() => router.push("/profile")}
                        >
                            {user?.avatar_url ? (
                                <Image
                                    source={{ uri: `${getApiUrl()}${user.avatar_url}` }}
                                    style={styles.profileIconImage}
                                />
                            ) : (
                                <Text style={styles.profileIconText}>👤</Text>
                            )}
                        </Pressable>
                    </View>

                    <Text style={styles.title}>
                        Où veux-tu partir ?
                    </Text>

                    <Text style={styles.subtitle}>
                        Budget : {budget} {userCurrency} • {duration} jours • {solo ? "Solo" : "Groupe"}
                    </Text>

                    <Pressable
                        style={styles.editPreferencesButton}
                        onPress={() =>
                            router.push({
                                pathname: "/preferences",
                                params: {
                                    budget,
                                    duration,
                                    solo: solo ? "true" : "false"
                                }
                            })
                        }
                    >
                        <Text style={styles.editPreferencesText}>
                            ✏️ Modifier mes préférences
                        </Text>
                    </Pressable>

                    <Text style={styles.subtitle}>
                        Choisis une destination et on prépare un voyage adapté à ton budget.
                    </Text>
                </View>

                {DESTINATIONS.map((item) => (
                    <Pressable
                        key={item.key}
                        style={styles.destinationCard}
                        onPress={() => {
                            setDestination(item.key);
                            setStep("form");
                        }}
                    >
                        <Image
                            source={item.image}
                            style={styles.destinationImage}
                        />

                        <View style={styles.destinationOverlay}>
                            <View>
                                <Text style={styles.destinationTitle}>
                                    {item.label}
                                </Text>

                                <Text style={styles.destinationSubtitle}>
                                    {item.subtitle}
                                </Text>
                            </View>

                            <Text style={styles.cardArrow}>›</Text>
                        </View>
                    </Pressable>
                ))}

                <Pressable
                    style={styles.compareButton}
                    onPress={() =>
                        router.push({
                            pathname: "/compare",
                            params: {
                                budget,
                                duration,
                                solo: solo ? "true" : "false",
                                currency: userCurrency
                            }
                        })
                    }
                >
                    <Text style={styles.buttonText}>
                        Comparer les destinations
                    </Text>
                </Pressable>

                <Pressable
                    style={styles.historyButton}
                    onPress={() => router.push("/history")}
                >
                    <Text style={styles.buttonText}>Mes voyages</Text>
                </Pressable>
            </ScrollView>
        );
    }

    return (
        <ScrollView
            style={styles.screen}
            contentContainerStyle={styles.scrollContent}
        >
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <Text style={styles.hello}>
                        Bonjour {userFirstName} 👋
                    </Text>

                    <Pressable
                        style={styles.profileIconButton}
                        onPress={() => router.push("/profile")}
                    >
                        {user?.avatar_url ? (
                            <Image
                                source={{ uri: `${getApiUrl()}${user.avatar_url}` }}
                                style={styles.profileIconImage}
                            />
                        ) : (
                            <Text style={styles.profileIconText}>👤</Text>
                        )}
                    </Pressable>
                </View>

                <Text style={styles.title}>
                    Créer ton voyage
                </Text>

                <Text style={styles.subtitle}>
                    Vérifie ta destination puis génère ton voyage.
                </Text>
            </View>

            {error ? (
                <Text style={styles.error}>
                    {error}
                </Text>
            ) : null}

            <Pressable
                style={styles.secondaryButton}
                onPress={() => setStep("destination")}
            >
                <Text style={styles.secondaryButtonText}>
                    Changer de destination
                </Text>
            </Pressable>

            <View style={styles.selectedDestinationCard}>
                <Text style={styles.selectedDestinationLabel}>
                    Destination choisie
                </Text>

                <Text style={styles.selectedDestinationTitle}>
                    {DESTINATIONS.find((item) => item.key === destination)?.label}
                </Text>
            </View>

            <Pressable
                style={[
                    styles.button,
                    loading && styles.disabledButton
                ]}
                onPress={handleGenerateTrip}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? "Génération..." : "Générer mon voyage ✈️"}
                </Text>
            </Pressable>

            <Pressable
                style={styles.historyButton}
                onPress={() => router.push("/history")}
            >
                <Text style={styles.buttonText}>
                    Mes voyages
                </Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#111827",
        padding: 14,
        borderRadius: 10,
        marginTop: 12
    },
    buttonText: {
        color: "white",
        textAlign: "center",
        fontWeight: "bold"
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 20,
        color: "#4b5563"
    },
    historyButton: {
        backgroundColor: "#2563eb",
        padding: 14,
        borderRadius: 10,
        marginTop: 12
    },
    destinationCard: {
        height: 170,
        borderRadius: 22,
        marginBottom: 16,
        overflow: "hidden",
        backgroundColor: "white"
    },
    destinationImage: {
        width: "100%",
        height: "100%",
        position: "absolute"
    },
    destinationOverlay: {
        flex: 1,
        padding: 18,
        backgroundColor: "rgba(0,0,0,0.35)",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end"
    },
    destinationTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
        marginBottom: 4
    },
    destinationSubtitle: {
        fontSize: 14,
        color: "#e5e7eb"
    },
    secondaryButton: {
        backgroundColor: "#e5e7eb",
        padding: 12,
        borderRadius: 10,
        marginBottom: 20
    },
    secondaryButtonText: {
        color: "#111827",
        textAlign: "center",
        fontWeight: "bold"
    },
    disabledButton: {
        opacity: 0.6
    },
    error: {
        color: "#dc2626",
        marginBottom: 16,
        fontWeight: "bold"
    },
    screen: {
        flex: 1,
        padding: 24,
        backgroundColor: "#f9fafb"
    },
    header: {
        marginTop: 40,
        marginBottom: 24
    },
    hello: {
        fontSize: 16,
        color: "#6b7280",
        marginBottom: 8
    },
    cardArrow: {
        fontSize: 38,
        color: "white"
    },
    selectedDestinationCard: {
        backgroundColor: "#eff6ff",
        borderWidth: 1,
        borderColor: "#bfdbfe",
        padding: 16,
        borderRadius: 16,
        marginBottom: 16
    },
    selectedDestinationLabel: {
        fontSize: 13,
        color: "#2563eb",
        marginBottom: 4,
        fontWeight: "600"
    },
    selectedDestinationTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1e3a8a"
    },
    scrollContent: {
        paddingBottom: 120
    },
    headerTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8
    },
    profileIconButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#e5e7eb"
    },
    profileIconText: {
        fontSize: 22
    },
    profileIconImage: {
        width: 42,
        height: 42,
        borderRadius: 21
    },
    compareButton: {
        backgroundColor: "#16a34a",
        padding: 14,
        borderRadius: 10,
        marginTop: 12
    },
    editPreferencesButton: {
        backgroundColor: "#e5e7eb",
        padding: 12,
        borderRadius: 10,
        marginTop: -8,
        marginBottom: 16
    },
    editPreferencesText: {
        color: "#111827",
        textAlign: "center",
        fontWeight: "bold"
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 24
    }
});