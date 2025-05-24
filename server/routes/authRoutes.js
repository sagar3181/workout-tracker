const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);

module.exports = router;

// Diagnostic: List all defined routes
console.log("▶️ authRoutes loaded");

router.stack.forEach((layer, i) => {
  try {
    console.log(`Route[${i}]:`, layer.route?.path);
  } catch (err) {
    console.error("💥 Failed to read route layer:", err);
  }
});
