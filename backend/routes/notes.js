const express = require("express");
const router = express.Router();
const { create, getAll, update, remove } = require("../controllers/notesController");
const authenticateToken = require("../middleware/authMiddleware");

router.use(authenticateToken);

router.get("/", getAll);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

module.exports = router;
