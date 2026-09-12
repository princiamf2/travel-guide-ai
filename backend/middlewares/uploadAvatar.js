const multer = require("multer");
const path = require("path");
const fs = require("fs");

const avatarDir = path.join(__dirname, "..", "uploads", "avatars");

if (!fs.existsSync(avatarDir)) {
    fs.mkdirSync(avatarDir, {recursive: true});
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, avatarDir);
    },

    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname).toLowerCase();
        const filename = `user-${req.user.id}-${Date.now()}${extension}`;

        cb(null, filename);
    }
});

function fileFilter(req, file, cb) {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error("Format image non autorisé."));
    }

    cb(null, true);
}

const uploadAvatar = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = uploadAvatar;