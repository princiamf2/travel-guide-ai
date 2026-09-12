import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View, StyleSheet, ImageBackground, Image } from "react-native";

const RecommendedIslandImage: Record<string, any> = {
    "Santorin": require("../assets/images/recommandation/santorin.jpg"),
    "Athènes": require("../assets/images/recommandation/athenes.png"),
    "Thessalonique": require("../assets/images/recommandation/thessalonique.jpg"),
    "Abidjan": require("../assets/images/recommandation/abidjan.jpg"),
    "Berat": require("../assets/images/recommandation/berat.jpg"),
    "Grand-Bassam": require("../assets/images/recommandation/grand-bassam.jpg"),
    "Sal": require("../assets/images/recommandation/sal.png"),
    "Santiago": require("../assets/images/recommandation/santiago.jpg"),
    "Saranda": require("../assets/images/recommandation/saranda.png"),
    "São Vicente": require("../assets/images/recommandation/sao-vincent.png"),
    "Tirana": require("../assets/images/recommandation/tirana.jpg"),
    "Yamoussoukro": require("../assets/images/recommandation/yamoussoukro.jpeg")
}

export default function TripSectionPage() {
    const params = useLocalSearchParams();

    let trip = null;
    let section = "";

    try {
        if (typeof params.trip === "string") {
            trip = JSON.parse(params.trip);
        }

        if (typeof params.section === "string") {
            section = params.section;
        }
    }
    catch (error) {
        console.log(error);
    }

    if (!trip) {
        return (
            <View style={styles.center}>
                <Text>Impossible d’afficher cette section.</Text>
            </View>
        );
    }

    return (
        <ScrollView 
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
        >
            <Text style={styles.title}>{getSectionTitle(section, trip)}</Text>

            {section === "budget" && trip.budget_breakdown && (
                <>
                    <View style={[
                        styles.budgetStatusCard,
                        getBudgetStatusStyle(trip.budget_breakdown.status)
                    ]}>
                        <Text style={styles.budgetStatusText}>
                            {getBudgetStatusLabel(trip.budget_breakdown.status)}
                        </Text>

                        <Text style={styles.budgetMessage}>
                            {trip.budget_breakdown.message}
                        </Text>
                    </View>

                    <View style={styles.budgetGrid}>
                        <BudgetBox
                            label="Budget total"
                            value={trip.budget_breakdown.total_budget}
                            currency={trip.budget_breakdown.currency}
                            emoji="💰"
                        />

                        <BudgetBox
                            label="Coût estimé"
                            value={trip.budget_breakdown.estimated_total}
                            currency={trip.budget_breakdown.currency}
                            emoji="📊"
                        />

                        <BudgetBox
                            label="Budget restant"
                            value={trip.budget_breakdown.remaining_budget}
                            currency={trip.budget_breakdown.currency}
                            emoji="🧾"
                        />

                        <BudgetBox
                            label="Logement"
                            value={trip.budget_breakdown.accommodation}
                            currency={trip.budget_breakdown.currency}
                            emoji="🏨"
                        />

                        <BudgetBox
                            label="Nourriture"
                            value={trip.budget_breakdown.food}
                            currency={trip.budget_breakdown.currency}
                            emoji="🍽️"
                        />

                        <BudgetBox
                            label="Transport"
                            value={trip.budget_breakdown.transport}
                            currency={trip.budget_breakdown.currency}
                            emoji="🚕"
                        />

                        <BudgetBox
                            label="Activités"
                            value={trip.budget_breakdown.activities}
                            currency={trip.budget_breakdown.currency}
                            emoji="🎟️"
                        />
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.listItem}>
                            {trip.budget_breakdown.note}
                        </Text>
                    </View>
                </>
            )}

            {section === "summary" && (
                <View style={styles.card}>
                    <Text style={styles.text}>{trip.summary}</Text>
                    <Text style={styles.text}>Destination : {trip.destination}</Text>
                    <Text style={styles.text}>Budget : {trip.total_budget} {trip.budget_breakdown?.currency || ""}</Text>
                    <Text style={styles.text}>Durée : {trip.duration} jours</Text>
                    <Text style={styles.text}>
                        Budget par jour : {Math.round(trip.daily_budget)} {trip.budget_breakdown?.currency || ""}
                    </Text>
                </View>
            )}

            {section === "places" && (
                <>
                    {trip.recommended_islands?.map((island: any, index: number) => (
                        <View key={index} style={styles.card}>
                            {RecommendedIslandImage[island.name] ? (
                                <ImageBackground
                                    source={RecommendedIslandImage[island.name]}
                                    style={styles.placeImage}
                                    imageStyle={styles.placeImageRadius}
                                />
                            ) : null}
                           <View style={styles.placeHeader}>
                                <Text style={styles.cardTitle}>{island.name}</Text>

                                <View style={styles.scoreBadge}>
                                    <Text style={styles.scoreText}>
                                        {island.score}
                                    </Text>
                                </View>
                            </View>

                            {island.reasons?.map((reason: string, i: number) => (
                                <Text key={i} style={styles.listItem}>• {reason}</Text>
                            ))}
                        </View>
                    ))}
                </>
            )}

            {section === "itinerary" && (
                <>
                    {trip.itinerary?.map((day: any) => (
                        <View key={day.day} style={styles.card}>
                            <View style={styles.itineraryHeader}>
                                <View style={styles.dayBadge}>
                                    <Text style={styles.dayBadgeText}>
                                        Jour {day.day}
                                    </Text>
                                </View>

                                <View style={styles.itineraryTitleBox}>
                                    <Text style={styles.cardTitle}>
                                        {day.island}
                                    </Text>

                                    <Text style={styles.type}>
                                        {day.type}
                                    </Text>
                                </View>
                            </View>

                            {day.activities?.map((activity: any, i: number) => {

                                if (typeof activity === "string") {
                                    return (
                                        <Text key={i} style={styles.listItem}>
                                            • {activity}
                                        </Text>
                                    );
                                }

                                return (
                                    <View key={i} style={styles.activityCard}>
                                        {activity.image ? (
                                            <Image
                                                source={{ uri: activity.image }}
                                                style={styles.activityImage}
                                            />
                                        ) : null}

                                        <Text style={styles.activityTitle}>
                                            {activity.title}
                                        </Text>

                                        {activity.description ? (
                                            <Text style={styles.activityDescription}>
                                                {activity.description}
                                            </Text>
                                        ) : null}

                                        <View style={styles.activityMetaRow}>
                                            {activity.estimated_price !== null && activity.estimated_price !== undefined ? (
                                                <Text style={styles.activityMeta}>
                                                    💰 {activity.estimated_price} {trip.budget_breakdown?.currency || ""}
                                                </Text>
                                            ) : null}

                                            {activity.duration ? (
                                                <Text style={styles.activityMeta}>
                                                    ⏱ {activity.duration}
                                                </Text>
                                            ) : null}
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    ))}
                </>
            )}

            {section === "checklist" && (
                <>
                    {trip.checklist?.map((item: string, index: number) => (
                        <View key={index} style={styles.checklistItem}>
                            <Text style={styles.checkIcon}>✓</Text>
                            <Text style={styles.checkText}>{item}</Text>
                        </View>
                    ))}
                </>
            )}

            {section === "security" && (
                <View style={styles.card}>
                    {trip.safety_tips?.map((tip: string, index: number) => (
                        <Text key={index} style={styles.listItem}>• {tip}</Text>
                    ))}
                </View>
            )}

            {section === "weather" && (
                <>
                    {trip.weather?.length > 0 ? (
                        trip.weather.map((weatherItem: any, index: number) => {
                            const daily = weatherItem.daily;

                            return (
                                <View key={index} style={styles.card}>
                                    {RecommendedIslandImage[weatherItem.island] ? (
                                        <ImageBackground
                                            source={RecommendedIslandImage[weatherItem.island]}
                                            style={styles.placeImage}
                                            imageStyle={styles.placeImageRadius}
                                        />
                                    ) : null}
                                    <Text style={styles.cardTitle}>
                                        {weatherItem.island || weatherItem.city || trip.destination}
                                    </Text>

                                    {daily ? (
                                        <>
                                            <Text style={styles.text}>
                                                Aujourd’hui
                                            </Text>

                                            <View style={styles.weatherGrid}>
                                                <View style={styles.weatherBox}>
                                                    <Text style={styles.weatherLabel}>Max</Text>
                                                    <Text style={styles.weatherValue}>
                                                        {daily.temperature_2m_max?.[0]}°C
                                                    </Text>
                                                </View>

                                                <View style={styles.weatherBox}>
                                                    <Text style={styles.weatherLabel}>Min</Text>
                                                    <Text style={styles.weatherValue}>
                                                        {daily.temperature_2m_min?.[0]}°C
                                                    </Text>
                                                </View>

                                                <View style={styles.weatherBox}>
                                                    <Text style={styles.weatherLabel}>Pluie</Text>
                                                    <Text style={styles.weatherValue}>
                                                        {daily.precipitation_sum?.[0]} mm
                                                    </Text>
                                                </View>

                                                <View style={styles.weatherBox}>
                                                    <Text style={styles.weatherLabel}>Vent</Text>
                                                    <Text style={styles.weatherValue}>
                                                        {daily.wind_speed_10m_max?.[0]} km/h
                                                    </Text>
                                                </View>
                                            </View>
                                        </>
                                    ) : null}

                                    {weatherItem.message ? (
                                        <Text style={styles.text}>{weatherItem.message}</Text>
                                    ) : null}

                                    {weatherItem.error ? (
                                        <Text style={styles.listItem}>
                                            ⚠ {weatherItem.error}
                                        </Text>
                                    ) : null}
                                </View>
                            );
                        })
                    ) : (
                        <View style={styles.card}>
                            <Text style={styles.text}>
                                Aucune donnée météo disponible pour ce voyage.
                            </Text>
                        </View>
                    )}
                </>
            )}

            {section === "warnings" && (
                <View style={styles.warningCard}>
                    {trip.warnings?.map((warning: string, index: number) => (
                        <Text key={index} style={styles.listItem}>⚠ {warning}</Text>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}

function BudgetBox({ label, value, currency, emoji }: any) {
    return (
        <View style={styles.budgetBox}>
            <Text style={styles.budgetEmoji}>{emoji}</Text>

            <Text style={styles.budgetLabel}>
                {label}
            </Text>

            <Text style={styles.budgetValue}>
                {value} {currency}
            </Text>
        </View>
    );
}

function getBudgetStatusStyle(status: string) {
    if (status === "comfortable") {
        return styles.budgetComfortable;
    }

    if (status === "tight") {
        return styles.budgetTight;
    }

    if (status === "insufficient") {
        return styles.budgetInsufficient;
    }

    return {};
}

function getBudgetStatusLabel(status: string) {
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

function getSectionTitle(section: string, trip: any) {
    if (section === "summary") return "Résumé";
    if (section === "places") return getPlacesTitle(trip.destination);
    if (section === "itinerary") return "Itinéraire";
    if (section === "checklist") return "Checklist";
    if (section === "security") return "Conseils sécurité";
    if (section === "warnings") return "Points d’attention";
    if (section === "weather") return "Météo";
    if (section === "budget") return "Budget Premium";

    return "Détail du voyage";
}

function getPlacesTitle(destination: string) {
    if (destination === "Cap-Vert") {
        return "Îles recommandées";
    }

    if (destination === "Côte d'Ivoire") {
        return "Villes recommandées";
    }

    if (destination === "Grèce") {
        return "Îles et villes recommandées";
    }

    if (destination === "Albanie") {
        return "Lieux recommandés";
    }

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
        marginBottom: 20,
        color: "#111827"
    },
    card: {
        backgroundColor: "white",
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#e5e7eb"
    },
    warningCard: {
        backgroundColor: "#fff7ed",
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#fed7aa"
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#111827"
    },
    scrollContent: {
        paddingBottom: 120
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
        color: "#374151",
        marginBottom: 6
    },
    listItem: {
        fontSize: 15,
        lineHeight: 24,
        color: "#374151"
    },
    type: {
        marginBottom: 6,
        color: "#6b7280",
        textTransform: "capitalize"
    },
    weatherGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginTop: 10
    },
    weatherBox: {
        width: "47%",
        backgroundColor: "#f3f4f6",
        padding: 12,
        borderRadius: 14
    },
    weatherLabel: {
        fontSize: 13,
        color: "#6b7280",
        marginBottom: 4
    },
    weatherValue: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#111827"
    },
    placeHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8
    },
    scoreBadge: {
        backgroundColor: "#111827",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999
    },
    scoreText: {
        color: "white",
        fontWeight: "bold"
    },
    itineraryHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10
    },
    dayBadge: {
        backgroundColor: "#2563eb",
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 12,
        marginRight: 12
    },
    dayBadgeText: {
        color: "white",
        fontWeight: "bold"
    },
    itineraryTitleBox: {
        flex: 1
    },
    checklistItem: {
        backgroundColor: "white",
        padding: 14,
        borderRadius: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        flexDirection: "row",
        alignItems: "center"
    },
    checkIcon: {
        backgroundColor: "#dcfce7",
        color: "#16a34a",
        width: 28,
        height: 28,
        borderRadius: 14,
        textAlign: "center",
        lineHeight: 28,
        fontWeight: "bold",
        marginRight: 12
    },
    checkText: {
        flex: 1,
        fontSize: 15,
        color: "#374151"
    },
    placeImage: {
        height: 130,
        marginHorizontal: -16,
        marginTop: -16,
        marginBottom: 14
    },
    placeImageRadius: {
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16
    },
    budgetStatusCard: {
        padding: 18,
        borderRadius: 18,
        marginBottom: 16,
        borderWidth: 1
    },
    budgetComfortable: {
        backgroundColor: "#dcfce7",
        borderColor: "#86efac"
    },
    budgetTight: {
        backgroundColor: "#ffedd5",
        borderColor: "#fdba74"
    },
    budgetInsufficient: {
        backgroundColor: "#fee2e2",
        borderColor: "#fca5a5"
    },
    budgetStatusText: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#111827"
    },
    budgetMessage: {
        fontSize: 15,
        color: "#374151",
        lineHeight: 22
    },
    budgetGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 12
    },
    budgetBox: {
        width: "47%",
        backgroundColor: "white",
        padding: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#e5e7eb"
    },
    budgetEmoji: {
        fontSize: 24,
        marginBottom: 8
    },
    budgetLabel: {
        fontSize: 13,
        color: "#6b7280",
        marginBottom: 4
    },
    budgetValue: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#111827"
    },
    activityCard: {
        marginTop: 10,
        backgroundColor: "#f9fafb",
        borderRadius: 16,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#e5e7eb"
    },
    activityImage: {
        width: "100%",
        height: 180
    },
    activityTitle: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#111827",
        paddingHorizontal: 14,
        paddingTop: 14,
        marginBottom: 8
    },
    activityDescription: {
        color: "#4b5563",
        lineHeight: 22,
        paddingHorizontal: 14,
        marginBottom: 12
    },
    activityMetaRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 14,
        paddingBottom: 14
    },
    activityMeta: {
        fontWeight: "600",
        color: "#2563eb"
    },
});