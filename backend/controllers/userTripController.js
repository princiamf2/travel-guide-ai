const db = require("../database/db");

function saveTrip(req, res) {
    try {
        const {
            destination,
            budget,
            duration,
            solo,
            level,
            style,
            result
        } = req.body;

        if (!result) {
            return res.status(400).json({
                error: "Missing trip result"
            });
        }

        const savedTrip = db.prepare(`
            INSERT INTO trips (
                user_id,
                destination,
                budget,
                duration,
                solo,
                level,
                style,
                result_json
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            req.user.id,
            destination || "Cape Verde",
            budget,
            duration,
            solo ? 1 : 0,
            level,
            style,
            JSON.stringify(result)
        );

        res.status(201).json({
            message: "Trip saved",
            tripId: savedTrip.lastInsertRowid
        });
    }
    catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Internal server error"
        });
    }
}

function getMyTrips(req, res) {
    try {
        const trips = db.prepare(`
            SELECT
                id,
                destination,
                budget,
                duration,
                solo,
                level,
                style,
                result_json,
                created_at
            FROM trips
            WHERE user_id = ?
            ORDER BY created_at DESC
        `).all(req.user.id);

        res.json({
            count: trips.length,
            trips
        });
    }
    catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Internal server error"
        });
    }
}

function deleteTrip(req, res) {
    try {
        const tripId = req.params.id;
        const result = db.prepare(`
            DELETE FROM trips
            WHERE id = ?
            AND user_id = ?
        `).run(
            tripId,
            req.user.id
        );
        if (result.changes === 0) {
            return res.status(404).json({
                error: "Trip not found"
            });
        }
        res.json({
            message: "Trip deleted"
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
}

module.exports = {
    saveTrip,
    getMyTrips,
    deleteTrip
};