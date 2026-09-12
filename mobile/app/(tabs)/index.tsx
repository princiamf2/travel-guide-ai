import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { View, ActivityIndicator } from "react-native";

import TripFormScreen from "../../src/screens/TripFormScreen";
import { getToken } from "../../src/storage/authStorage";

export default function HomeScreen() {
    const params = useLocalSearchParams();
    const [checking, setChecking] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        async function checkAuth() {
            const token = await getToken();

            if (!token) {
                router.replace("/register");
                return;
            }

            if (params.fromPreferences !== "true") {
                router.replace("/preferences");
                return;
            }

            setIsLoggedIn(true);
            setChecking(false);
        }

        checkAuth();
    }, [params.fromPreferences]);

    if (checking) {
        return (
            <View style={{ flex: 1, justifyContent: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!isLoggedIn) {
        return null;
    }

    return <TripFormScreen />;
}