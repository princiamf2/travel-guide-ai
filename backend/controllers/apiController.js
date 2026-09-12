function getApiInfo(req, res) {
    res.json({
        name: "travel-guide-api",
        version: "1.0.0",
        endpoints: [
            {
                method: "GET",
                path: "/health",
                description: "Vérifie si l'API fonctionne"
            },
            {
                method: "GET",
                path: "/islands",
                description: "Liste les îles disponibles"
            },
            {
                method: "GET",
                path: "/islands/:name",
                description: "Affiche le détail d'une île"
            },
            {
                method: "GET",
                path: "/styles",
                description: "Liste les styles de voyage disponibles"
            },
            {
                method: "GET",
                path: "/trip",
                description: "Génère une recommandation de voyage"
            }
        ]
    });
}

module.exports = {
    getApiInfo
};