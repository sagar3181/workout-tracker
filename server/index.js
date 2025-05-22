console.log("🪪 Starting server...");

const Module = require('module');
const originalRequire = Module.prototype.require;

Module.prototype.require = function (...args) {
  const result = originalRequire.apply(this, args);
  if (args[0].includes('path-to-regexp')) {
    console.log("👀 path-to-regexp required from:", this.id);
  }
  return result;
};


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// test route directly
const verifyToken = require("./middleware/verifyToken");

app.get("/api/secret", verifyToken, (req, res) => {
  res.json({ msg: `You unlocked the secret, user ID: ${req.user}` });
});

// 🔍 Log all incoming requests
app.use((req, res, next) => {
  console.log(`👉 Incoming request: ${req.method} ${req.url}`);
  next();
});

// 🔗 Auth Routes
const authRoutes = require("./routes/authRoutes");
console.log("✅ Route mounted: /api/auth");
app.use("/api/auth", authRoutes);

console.log("🧪 Finished mounting /api/auth");

// Check if app._router exists before accessing .stack
if (app._router && app._router.stack) {
  app._router.stack.forEach((layer, i) => {
    try {
      if (layer.route) {
        console.log(`🧩 GlobalRoute[${i}]:`, layer.route.path);
      } else if (layer.name === 'router') {
        console.log(`🧩 Middleware[${i}]:`, layer.regexp);
      }
    } catch (err) {
      console.error("💥 Error inspecting route:", err.message);
    }
  });
} else {
  console.log("⚠️ app._router not initialized yet.");
}



// 📦 MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("DB error:", err));

// 🟢 Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use.`);
    process.exit(1);
  }
});

// workout routes
const workoutRoutes = require("./routes/workoutRoutes");
app.use("/api/workouts", workoutRoutes);

// workout plan
const planRoutes = require("./routes/planRoutes");
app.use("/api/plans", planRoutes);

// 🔚 Catch unmatched routes
app.use("*", (req, res) => {
  console.log("❌ Unmatched route hit:", req.originalUrl);
  res.status(404).json({ msg: "Route not found" });
});


