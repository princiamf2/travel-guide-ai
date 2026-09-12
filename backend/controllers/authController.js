const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../database/db");

const JWT_SECRET = "super_secret_key_change_me";

function register(req, res) {
    try {
        const { first_name, last_name, email, password, country, currency } = req.body;
        if (!first_name || !last_name || !email || !password || !country || !currency) {
            return res.status(400).json({
                error: "Missing required fields"
            });
        }
        const existingUser = db
            .prepare("SELECT id FROM users WHERE email = ?")
            .get(email);
        if (existingUser) {
            return res.status(409).json({
                error: "Email already used"
            });
        }
        const passwordHash = bcrypt.hashSync(password, 10);
        const result = db.prepare(`
            INSERT INTO users (first_name, last_name, email, password_hash, country, currency)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(first_name, last_name, email, passwordHash, country, currency);
        const token = jwt.sign(
            {
                id: result.lastInsertRowid,
                email: email
            },
            JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(201).json({
            message: "User created",
            token
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
}
function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Missing email or password"
            });
        }

        const user = db.prepare(`
            SELECT id, first_name, last_name, email, password_hash, country, currency
            FROM users
            WHERE email = ?
        `).get(email);

        if (!user) {
            return res.status(401).json({
                error: "Invalid credentials"
            });
        }

        const passwordValid = bcrypt.compareSync(password, user.password_hash);

        if (!passwordValid) {
            return res.status(401).json({
                error: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            message: "Login successful",
            token
        });
    }
    catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Internal server error"
        });
    }
}

function getMe(req, res) {
    const user = db.prepare(`
        SELECT id, first_name, last_name, email, country, currency, avatar_url, created_at
        FROM users
        WHERE id = ?
    `).get(req.user.id);

    if (!user) {
        return res.status(404).json({
            error: "User not found"
        });
    }

    res.json(user);
}

function updateAvatar(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: "No avatar file uploaded"
            });
        }
        const avatarUrl = `/uploads/avatars/${req.file.filename}`;

        db.prepare(`
            UPDATE users
            SET avatar_url = ?
            WHERE id = ?
        `).run(avatarUrl, req.user.id);

        res.json({
            message: "Avatar updated",
            avatar_url: avatarUrl
        });
    }catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Internal server error"
        });
    }
}

module.exports = {
    register,
    login,
    getMe,
    updateAvatar
};