import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

export default function TravelPreferencesScreen() {
    const params = useLocalSearchParams();
    const [budget, setBudget] = useState(
        typeof params.budget === "string" ? params.budget : "1500"
    );
    const [duration, setDuration] = useState(
        typeof params.duration === "string" ? params.duration : "7"
    );
    const [solo, setSolo] = useState(
        params.solo === "false" ? false : true
    );
    const [error, setError] = useState("");

    function handleContinue() {
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

        router.replace({
            pathname: "/",
            params: {
                budget,
                duration,
                solo: solo ? "true" : "false",
                fromPreferences: "true"
            }
        });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Prépare ton voyage</Text>

            <Text style={styles.subtitle}>
                Renseigne ton budget et ta durée avant de choisir une destination.
            </Text>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Text style={styles.label}>Budget total</Text>
            <TextInput
                style={styles.input}
                value={budget}
                onChangeText={setBudget}
                keyboardType="numeric"
                placeholder="Ex: 1500"
            />

            <Text style={styles.label}>Durée du voyage</Text>
            <TextInput
                style={styles.input}
                value={duration}
                onChangeText={setDuration}
                keyboardType="numeric"
                placeholder="Ex: 7"
            />

            <Text style={styles.label}>Type de voyage</Text>

            <View style={styles.toggleRow}>
                <Pressable
                    style={[
                        styles.toggleButton,
                        solo && styles.toggleButtonActive
                    ]}
                    onPress={() => setSolo(true)}
                >
                    <Text
                        style={[
                            styles.toggleText,
                            solo && styles.toggleTextActive
                        ]}
                    >
                        Solo
                    </Text>
                </Pressable>

                <Pressable
                    style={[
                        styles.toggleButton,
                        !solo && styles.toggleButtonActive
                    ]}
                    onPress={() => setSolo(false)}
                >
                    <Text
                        style={[
                            styles.toggleText,
                            !solo && styles.toggleTextActive
                        ]}
                    >
                        Groupe
                    </Text>
                </Pressable>
            </View>

            <Pressable style={styles.button} onPress={handleContinue}>
                <Text style={styles.buttonText}>Continuer</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 24,
        backgroundColor: "#f9fafb"
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 12,
        color: "#111827"
    },
    subtitle: {
        fontSize: 16,
        color: "#6b7280",
        marginBottom: 24,
        lineHeight: 22
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
        padding: 14,
        marginBottom: 16,
        backgroundColor: "white"
    },
    toggleRow: {
        flexDirection: "row",
        backgroundColor: "#f3f4f6",
        borderRadius: 14,
        padding: 4,
        marginBottom: 20
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
        padding: 16,
        borderRadius: 12
    },
    buttonText: {
        color: "white",
        textAlign: "center",
        fontWeight: "bold"
    },
    error: {
        color: "#dc2626",
        fontWeight: "bold",
        marginBottom: 16
    }
});