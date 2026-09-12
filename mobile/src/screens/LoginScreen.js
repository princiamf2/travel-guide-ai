import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet
} from "react-native";

import { router } from "expo-router";

import { login } from "../services/api";
import { saveToken } from "../storage/authStorage";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleLogin() {
        try {
            setLoading(true);
            setError("");

            const data = await login(email, password);

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
                Connexion
            </Text>

            {error ? (
                <Text style={styles.error}>
                    {error}
                </Text>
            ) : null}

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
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
                onPress={handleLogin}
            >
                <Text style={styles.buttonText}>
                    {loading ? "Connexion..." : "Se connecter"}
                </Text>
            </Pressable>

            <Pressable
                onPress={() => router.push("/register")}
            >
                <Text style={styles.link}>
                    Créer un compte
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
    }
});
