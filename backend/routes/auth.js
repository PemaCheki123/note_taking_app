const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const authenticateToken = require("../middleware/authMiddleware");
const { create, getAll, update, remove } = require("../controllers/notesController");


let refreshTokens = [];

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
