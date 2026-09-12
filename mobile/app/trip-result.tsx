import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View, StyleSheet, Pressable, ImageBackground } from "react-native";

type RecommendedIsland = {
    name: string;
    score: number;
    reasons: string[];
};

type ItineraryDay = {
    day: number;
    island: string;
    type: string;
    activities: string[];
};

type WeatherItem = {
    island: string;
    error?: string;
    message?: string;
};

type Trip = {
    trip_id: string;
    destination: string;
    total_budget: number;
    duration: number;
    daily_budget: number;
    solo: boolean;

    recommended_islands: RecommendedIsland[];
    itinerary: ItineraryDay[];
    checklist: string[];
    safety_tips: string[];
    warnings: string[];
    budget_breakdown: any;
    difficulty: any;
    suggestions: any;
    summary: string;
    weather: WeatherItem[];
};

type SectionCardProps = {
    title: string;
    description: string;
    emoji: string;
    onPress: () => void;
    warning?: boolean;
};

const DESTINATION_IMAGES: Record<string, any> = {
    "Cap-Vert": require("../assets/images/destination/cap-vert.jpeg"),
    "Grèce": require("../assets/images/destination/grece.jpg"),
    "Côte d'Ivoire": require("../assets/images/destination/ivory-coast.jpg"),
    "Albanie": require("../assets/images/destination/albanie.jpg")
};

export default function TripResultPage() {
    const params = useLocalSearchParams();
    let trip: Trip | null = null;

    try {
        if (typeof params.trip === "string") {
            trip = JSON.parse(params.trip);
        }
    }
    catch (error) {
        console.log(error);
    }

    if (!trip) {
        return (
            <View style={styles.center}>
                <Text>Impossible d'afficher ce voyage.</Text>
            </View>
        );
    }

    function openSection(section: string) {
        router.push({
            pathname: "/trip-section",
            params: {
                section,
                trip: JSON.stringify(trip)
            }
        });
    }

    return (
        <ScrollView 
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
        >
            <Text style={styles.title}>Ton voyage</Text>

            <ImageBackground
                source={DESTINATION_IMAGES[trip.destination]}
                style={styles.heroCard}
                imageStyle={styles.heroImage}
            >
                <View style={styles.heroOverlay}>
                    <Text style={styles.heroLabel}>Ton voyage</Text>

                    <Text style={styles.heroTitle}>
                        {getDestinationLabel(trip.destination)}
                    </Text>

                    <View style={styles.heroInfoRow}>
                        <Text style={styles.heroBadge}>{trip.duration} jours</Text>
                        <Text style={styles.heroBadge}>{trip.total_budget} CHF</Text>
                    </View>

                    <Text style={styles.heroText}>
                        Budget par jour : {Math.round(trip.daily_budget)} CHF
                    </Text>

                    <Text style={styles.heroText}>
                        {trip.solo ? "Voyage solo" : "Voyage en groupe"}
                    </Text>
                </View>
            </ImageBackground>

            <Text style={styles.autoSaved}>
                Voyage sauvegardé automatiquement
            </Text>

            <Text style={styles.sectionTitle}>Explorer ton voyage</Text>

            <SectionCard
                title="Budget Premium"
                description="Budget détaillé, coût estimé, budget restant et statut."
                emoji="💰"
                onPress={() => openSection("budget")}
            />

            <SectionCard
                title="Résumé"
                description="Vue générale du voyage, budget et durée."
                emoji="🧭"
                onPress={() => openSection("summary")}
            />

            <SectionCard
                title={getPlacesTitle(trip.destination)}
                description="Les lieux les plus adaptés à ton profil."
                emoji="📍"
                onPress={() => openSection("places")}
            />

            <SectionCard
                title="Itinéraire"
                description="Programme jour par jour."
                emoji="🗓️"
                onPress={() => openSection("itinerary")}
            />

            <SectionCard
                title="Checklist"
                description="Ce qu’il faut préparer avant de partir."
                emoji="✅"
                onPress={() => openSection("checklist")}
            />

            <SectionCard
                title="Conseils sécurité"
                description="Points importants pour voyager sereinement."
                emoji="🛡️"
                onPress={() => openSection("security")}
            />

            <SectionCard
                title="Météo"
                description="Conditions météo prévues pour ta destination."
                emoji="🌤️"
                onPress={() => openSection("weather")}
            />

            {trip.warnings?.length > 0 && (
                <SectionCard
                    title="Points d’attention"
                    description="Alertes importantes liées au voyage."
                    emoji="⚠️"
                    onPress={() => openSection("warnings")}
                    warning
                />
            )}
        </ScrollView>
    );
}

function SectionCard({ title, description, emoji, onPress, warning = false }: SectionCardProps) {
    return (
        <Pressable
            style={[
                styles.sectionCard,
                warning && styles.warningSectionCard
            ]}
            onPress={onPress}
        >
            <View style={styles.sectionIcon}>
                <Text style={styles.emoji}>{emoji}</Text>
            </View>

            <View style={styles.sectionContent}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardDescription}>{description}</Text>
            </View>

            <Text style={styles.arrow}>›</Text>
        </Pressable>
    );
}

function getDestinationLabel(destination: string) {
    return destination;
}

function getPlacesTitle(destination: string) {
    if (destination === "Cap-Vert") return "Îles recommandées";
    if (destination === "Côte d'Ivoire") return "Villes recommandées";
    if (destination === "Grèce") return "Îles et villes recommandées";
    if (destination === "Albanie") return "Lieux recommandés";

    return "Lieux recommandés";
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
        alignItems: "center",
        padding: 20
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 16,
        color: "#111827"
    },
    heroCard: {
        height: 260,
        borderRadius: 26,
        marginBottom: 16,
        overflow: "hidden",
        backgroundColor: "#111827"
    },
    heroImage: {
        borderRadius: 26
    },
    heroOverlay: {
        flex: 1,
        padding: 22,
        backgroundColor: "rgba(0,0,0,0.42)",
        justifyContent: "flex-end"
    },
    heroLabel: {
        color: "#d1d5db",
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 6
    },
    heroTitle: {
        color: "white",
        fontSize: 34,
        fontWeight: "bold",
        marginBottom: 14
    },
    heroInfoRow: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 12
    },
    heroBadge: {
        backgroundColor: "rgba(255,255,255,0.22)",
        color: "white",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 999,
        fontWeight: "bold",
        overflow: "hidden"
    },
    heroText: {
        color: "#f3f4f6",
        fontSize: 16,
        marginBottom: 4
    },
    autoSaved: {
        marginBottom: 24,
        color: "#16a34a",
        fontWeight: "bold"
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 14,
        color: "#111827"
    },
    scrollContent: {
        paddingBottom: 120
    },
    sectionCard: {
        backgroundColor: "white",
        padding: 16,
        borderRadius: 18,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        flexDirection: "row",
        alignItems: "center"
    },
    warningSectionCard: {
        backgroundColor: "#fff7ed",
        borderColor: "#fed7aa"
    },
    sectionIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: "#f3f4f6",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14
    },
    emoji: {
        fontSize: 22
    },
    sectionContent: {
        flex: 1
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 4
    },
    cardDescription: {
        fontSize: 14,
        color: "#6b7280",
        lineHeight: 20
    },
    arrow: {
        fontSize: 30,
        color: "#9ca3af",
        marginLeft: 8
    }
});