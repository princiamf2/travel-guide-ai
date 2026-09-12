import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Image } from "react-native";
import { router } from "expo-router";
import { getMe, getApiUrl, uploadAvatar } from "../services/api";
import { getToken, removeToken } from "../storage/authStorage";
import * as ImagePicker from "expo-image-picker";

export default function ProfilScreen() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadProfile();
    }, []);

    async function loadProfile() {
        try {
            setLoading(true);
            setError("");

            const token = await getToken();
            if (!token) {
                router.replace("/login");
                return;
            }
            const data = await getMe(token);
            setUser(data);
        }catch (error) {
            console.log(error);
            setError("Impossible de charger le profil.");
        }finally {
            setLoading(false);
        }
    }

    async function handleLogout() {
        await removeToken();
        router.replace("/login");
    }

    if (loading) {
        return (
            <View style={styles.center}>
                <Text>Chargement du profil...</Text>
            </View>
        );
    }

    function formatDate(dateString) {
        if (!dateString) {
            return "Date inconnue";
        }
        return new Date(dateString).toLocaleDateString("fr-CH");
    }

    function getInitial(name) {
        if (!name) {
            return "?";
        }
        return name.charAt(0).toUpperCase();
    }

    async function handleChangeAvatar() {
        try {
            setError("");

            const permission =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permission.granted) {
                setError("Permission refusée pour accéder aux photos.");
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8
            });

            if (result.canceled) {
                return;
            }

            const token = await getToken();
            const data = await uploadAvatar(token, result.assets[0]);

            setUser((currentUser) => ({
                ...currentUser,
                avatar_url: data.avatar_url
            }));
        }
        catch (error) {
            console.log(error);
            setError("Impossible de modifier la photo.");
        }
    }

    return (
        <ScrollView
            style={styles.screen}
            contentContainerStyle={styles.scrollContent}
        >
            <View style={styles.container}>
                {error ? (
                    <Text style={styles.error}>{error}</Text>
                ) : null}
                
                <View style={styles.card}>
                    {user?.avatar_url ? (
                        <Image
                            source={{uri: `${getApiUrl()}${user.avatar_url}`}}
                            style={styles.avatarImage}
                        />
                    ) : (
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {getInitial(user?.first_name)}
                            </Text>
                        </View>
                    )}
                    <Pressable onPress={handleChangeAvatar}>
                        <Text style={styles.editAvatarText}>
                            Modifier
                        </Text>
                    </Pressable>
                    <Text style={styles.profileName}>{user?.first_name} {user?.last_name}</Text>

                    <Text style={styles.profileEmail}>{user?.email}</Text>

                    <View style={styles.infoGrid}>
                        <View style={styles.infoBox}>
                            <Text style={styles.label}>Pays</Text>
                            <Text style={styles.value}>
                                {user?.country || "Non défini"}
                            </Text>
                        </View>

                        <View style={styles.infoBox}>
                            <Text style={styles.label}>Devise</Text>
                            <Text style={styles.value}>
                                {user?.currency || "Non définie"}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.memberBox}>
                        <Text style={styles.label}>Membre depuis</Text>
                        <Text style={styles.memberDate}>
                            {formatDate(user?.created_at)}
                        </Text>
                    </View>
                </View>

                <Pressable
                    style={styles.historyButton}
                    onPress={() => router.push("/history")}
                >
                    <Text style={styles.buttonText}>Voir mes voyages</Text>
                </Pressable>

                <Pressable
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Text style={styles.buttonText}>Déconnexion</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    screen: {
        flex: 1,
        backgroundColor: "#f9fafb"
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        marginTop: 40,
        marginBottom: 24,
        color: "#111827"
    },
    card: {
        backgroundColor: "white",
        padding: 18,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        marginBottom: 20
    },
    label: {
        fontSize: 14,
        color: "#6b7280",
        marginBottom: 4
    },
    value: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 16
    },
    historyButton: {
        backgroundColor: "#2563eb",
        padding: 14,
        borderRadius: 12,
        marginBottom: 12
    },
    logoutButton: {
        backgroundColor: "#dc2626",
        padding: 14,
        borderRadius: 12
    },
    buttonText: {
        color: "white",
        textAlign: "center",
        fontWeight: "bold"
    },
    error: {
        color: "#dc2626",
        marginBottom: 16,
        fontWeight: "bold"
    },
    scrollContent: {
        paddingBottom: 120
    },
    avatar: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: "#111827",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginBottom: 16
    },
    avatarText: {
        color: "white",
        fontSize: 30,
        fontWeight: "bold"
    },
    profileName: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#111827",
        textAlign: "center",
        marginBottom: 4
    },
    profileEmail: {
        fontSize: 15,
        color: "#6b7280",
        textAlign: "center",
        marginBottom: 20
    },
    memberBox: {
        backgroundColor: "#f9fafb",
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#e5e7eb"
    },
    memberDate: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#111827"
    },
    avatarImage: {
        width: 72,
        height: 72,
        borderRadius: 36,
        alignSelf: "center",
        marginBottom: 16
    },
    editAvatarText: {
        textAlign: "center",
        color: "#2563eb",
        fontWeight: "600",
        marginBottom: 12
    },
    infoGrid: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 16
    },
    infoBox: {
        flex: 1,
        backgroundColor: "#f9fafb",
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#e5e7eb"
    },
});