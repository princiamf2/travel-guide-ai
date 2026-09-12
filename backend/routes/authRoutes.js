const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const uploadAvatar = require("../middlewares/uploadAvatar");

const { register, login, getMe, updateAvatar } = require("../controllers/authController");

router.get("/me", authMiddleware, getMe);
router.post("/register", register);
router.post("/login", login);
router.post(
    "/me/avatar",
    authMiddleware,
    uploadAvatar.single("avatar"),
    updateAvatar
);

module.exports = router;