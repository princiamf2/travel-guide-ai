import { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import {
    View,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    StyleSheet
} from "react-native";

import { compareDestinations } from "../services/api";

export default function ComparisonScreen() {
    const params = useLocalSearchParams();
    const budget = typeof params.budget === "string" ? params.budget : "1500";
    const duration = typeof params.duration === "string" ? params.duration : "7";
    const solo = params.solo === "true";
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [comparison, setComparison] = useState(null);

    useEffect(() => {
        handleCompare();
    }, []);

    async function handleCompare() {
        try {
            setLoading(true);
            setError("");

            const data = await compareDestinations({
                budget,
                duration,
                solo: solo ? "true" : "false",
                level: "beginner",
                style: "culture",
                currency: "EUR"
            });

            setComparison(data);
        }
        catch (error) {
            console.log(error);
            setError(error.message || "Impossible de comparer les destinations.");
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>Comparer les destinations</Text>

            {error ? (
                <Text style={styles.error}>{error}</Text>
            ) : null}

            {loading && (
                <Text style={styles.text}>
                    Comparaison en cours...
                </Text>
            )}

            {comparison?.best_destination ? (
                <View style={styles.bestCard}>
                    <Text style={styles.bestLabel}>Meilleur choix</Text>
                    <Text style={styles.bestTitle}>
                        🏆 {comparison.best_destination.destination}
                    </Text>
                    <Text style={styles.text}>
                        {comparison.best_destination.recommendation}
                    </Text>
                </View>
            ) : null}

            {comparison?.ranking?.map((item) => (
                <View key={item.destination_key} style={styles.resultCard}>
                    <View style={styles.resultHeader}>
                        <Text style={styles.rank}>
                            #{item.rank}
                        </Text>

                        <View style={styles.resultTitleBox}>
                            <Text style={styles.destination}>
                                {item.destination}
                            </Text>

                            <Text style={styles.status}>
                                {getStatusLabel(item.status)}
                            </Text>
                        </View>

                        <Text style={styles.score}>
                            {item.score}
                        </Text>
                    </View>

                    <Text style={styles.text}>
                        Coût estimé : {item.estimated_total} {item.currency}
                    </Text>

                    <Text style={styles.text}>
                        Budget restant : {item.remaining_budget} {item.currency}
                    </Text>

                    <Text style={styles.recommendation}>
                        {item.recommendation}
                    </Text>
                </View>
            ))}
        </ScrollView>
    );
}

function getStatusLabel(status) {
    if (status === "comfortable") {
        return "🟢 Comfortable";
    }

    if (status === "tight") {
        return "🟠 Serré";
    }

    if (status === "insufficient") {
        return "🔴 Insuffisant";
    }

    return status;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f9fafb"
    },
    scrollContent: {
        paddingBottom: 120
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#111827"
    },
    card: {
        backgroundColor: "white",
        padding: 16,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        marginBottom: 16
    },
    label: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#374151",
        marginBottom: 8
    },
    input: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        backgroundColor: "white"
    },
    toggleRow: {
        flexDirection: "row",
        backgroundColor: "#f3f4f6",
        borderRadius: 14,
        padding: 4
    },
    toggleButton: {
        flex: 1,
        padding: 12,
        borderRadius: 10,
        alignItems: "center"
    },
    toggleButtonActive: {
        backgroundColor: "#111827"
    },
    toggleText: {
        color: "#6b7280",
        fontWeight: "bold"
    },
    toggleTextActive: {
        color: "white"
    },
    button: {
        backgroundColor: "#111827",
        padding: 14,
        borderRadius: 12,
        marginBottom: 16
    },
    disabledButton: {
        opacity: 0.6
    },
    buttonText: {
        color: "white",
        textAlign: "center",
        fontWeight: "bold"
    },
    error: {
        color: "#dc2626",
        fontWeight: "bold",
        marginBottom: 12
    },
    bestCard: {
        backgroundColor: "#dcfce7",
        borderColor: "#86efac",
        borderWidth: 1,
        padding: 18,
        borderRadius: 18,
        marginBottom: 16
    },
    bestLabel: {
        color: "#166534",
        fontWeight: "bold",
        marginBottom: 6
    },
    bestTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#14532d",
        marginBottom: 8
    },
    resultCard: {
        backgroundColor: "white",
        padding: 16,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        marginBottom: 12
    },
    resultHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12
    },
    rank: {
        fontSize: 18,
        fontWeight: "bold",
        backgroundColor: "#111827",
        color: "white",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        marginRight: 12,
        overflow: "hidden"
    },
    resultTitleBox: {
        flex: 1
    },
    destination: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#111827"
    },
    status: {
        marginTop: 4,
        color: "#374151"
    },
    score: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#2563eb"
    },
    text: {
        fontSize: 15,
        color: "#374151",
        marginBottom: 6
    },
    recommendation: {
        marginTop: 8,
        fontSize: 15,
        color: "#111827",
        fontWeight: "600"
    }
});