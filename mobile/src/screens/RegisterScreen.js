import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet
} from "react-native";

import { router } from "expo-router";

import { register } from "../services/api";
import { saveToken } from "../storage/authStorage";

const COUNTRIES = [
    { name: "Switzerland", currency: "CHF" },
    { name: "France", currency: "EUR" },
    { name: "Belgium", currency: "EUR" },
    { name: "Germany", currency: "EUR" },
    { name: "Italy", currency: "EUR" },
    { name: "Spain", currency: "EUR" },
    { name: "Portugal", currency: "EUR" },
    { name: "United Kingdom", currency: "GBP" },
    { name: "United States", currency: "USD" },
    { name: "Canada", currency: "CAD" },
    { name: "Brazil", currency: "BRL" },
    { name: "Mexico", currency: "MXN" },
    { name: "Morocco", currency: "MAD" },
    { name: "Senegal", currency: "XOF" },
    { name: "Ivory Coast", currency: "XOF" },
    { name: "Cape Verde", currency: "CVE" },
    { name: "South Africa", currency: "ZAR" },
    { name: "Japan", currency: "JPY" },
    { name: "China", currency: "CNY" },
    { name: "India", currency: "INR" },
    { name: "Australia", currency: "AUD" }
];

export default function RegisterScreen() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [country, setCountry] = useState("Switzerland");
    const [currency, setCurrency] = useState("CHF");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function handleCountryChange(value) {
        setCountry(value);

        const selectedCountry = COUNTRIES.find(
            (item) => item.name === value
        );

        if (selectedCountry) {
            setCurrency(selectedCountry.currency);
        }
    }

    async function handleRegister() {
        try {
            setLoading(true);
            setError("");

            const data = await register(
                firstName,
                lastName,
                email,
                password,
                country,
                currency
            );

            await saveToken(data.token);

            router.replace("/preferences");
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Créer un compte
            </Text>

            {error ? (
                <Text style={styles.error}>
                    {error}
                </Text>
            ) : null}

            <TextInput
                style={styles.input}
                placeholder="Prénom"
                value={firstName}
                onChangeText={setFirstName}
            />

            <TextInput
                style={styles.input}
                placeholder="Nom"
                value={lastName}
                onChangeText={setLastName}
            />

            <Text style={styles.label}>Pays de résidence</Text>

            <View style={styles.countryGrid}>
                {COUNTRIES.map((item) => (
                    <Pressable
                        key={item.name}
                        style={[
                            styles.countryButton,
                            country === item.name && styles.countryButtonActive
                        ]}
                        onPress={() => handleCountryChange(item.name)}
                    >
                        <Text
                            style={[
                                styles.countryText,
                                country === item.name && styles.countryTextActive
                            ]}
                        >
                            {item.name}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <Text style={styles.label}>Devise</Text>

            <TextInput
                style={styles.input}
                placeholder="Devise"
                value={currency}
                onChangeText={setCurrency}
                autoCapitalize="characters"
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <Pressable
                style={styles.button}
                onPress={handleRegister}
            >
                <Text style={styles.buttonText}>
                    {loading ? "Création..." : "Créer le compte"}
                </Text>
            </Pressable>

            <Pressable
                onPress={() => router.push("/login")}
            >
                <Text style={styles.link}>
                    Déjà un compte ?
                </Text>
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
        marginBottom: 24
    },
    input: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 12,
        padding: 14,
        marginBottom: 16,
        backgroundColor: "white"
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
    link: {
        marginTop: 20,
        textAlign: "center",
        color: "#2563eb"
    },
    error: {
        color: "red",
        marginBottom: 16
    },
    label: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#374151",
        marginBottom: 8
    },
    countryGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 16
    },
    countryButton: {
        backgroundColor: "#e5e7eb",
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 999
    },
    countryButtonActive: {
        backgroundColor: "#111827"
    },
    countryText: {
        color: "#374151",
        fontWeight: "600"
    },
    countryTextActive: {
        color: "white"
    },
});