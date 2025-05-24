console.log("🧠 workoutRoutes loaded");
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

const WorkoutSplit = require("../models/WorkoutSplit");
const WorkoutLog = require("../models/WorkoutLog");

// 👉 POST /api/workouts/split - Create a workout split
// router.post('/split', verifyToken, async (req, res) => {
//   try {
//     const { name } = req.body;
//     if (!name) return res.status(400).json({ msg: "Split name required" });

//     const newSplit = await WorkoutSplit.create({
//       name,
//       user: req.user, // ensure `req.user` is populated correctly
//     });

//     res.status(201).json(newSplit);
//   } catch (err) {
//     console.error("Split creation failed:", err);
//     res.status(500).json({ msg: "Server error", error: err.message });
//   }
// });
router.post('/split', verifyToken, async (req, res) => {
  console.log("📥 POST /split received:");
  console.log("🧠 req.user:", req.user);
  console.log("📦 req.body:", req.body);

  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ msg: "Name is required" });

    const newSplit = await WorkoutSplit.create({
      user: req.user,
      name,
    });

    res.status(201).json(newSplit);
  } catch (err) {
    console.error("❌ Error creating split:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});



// 👉 POST /api/workouts/log - Log an exercise
router.post("/log", verifyToken, async (req, res) => {
  try {
    const { split, exercise, sets } = req.body;
    const log = await WorkoutLog.create({ user: req.user, split, exercise, sets });
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ msg: "Failed to log workout", error: err.message });
  }
});

// 👉 GET /api/workouts/history - Get all workout logs for user
router.get("/history", verifyToken, async (req, res) => {
  try {
    const logs = await WorkoutLog.find({ user: req.user }).populate("split");
    res.json(logs);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch logs", error: err.message });
  }
});

// GET /api/workouts/progress?exercise=Bench%20Press
router.get("/progress", verifyToken, async (req, res) => {
  try {
    const { exercise } = req.query;

    if (!exercise) {
      return res.status(400).json({ msg: "Exercise name is required" });
    }

    const logs = await WorkoutLog.find({
      user: req.user,
      exercise,
    }).sort({ date: 1 }); // sort chronologically

    const formatted = logs.map(log => {
      const maxWeight = Math.max(...log.sets.map(s => s.weight || 0));
      return {
        date: log.date,
        maxWeight,
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching progress data", error: err.message });
  }
});

// 👉 GET /api/workouts/exercises - Get list of unique exercise names used by user
router.get("/exercises", verifyToken, async (req, res) => {
  try {
    const logs = await WorkoutLog.find({ user: req.user }).select("exercise");
    const unique = [...new Set(logs.map(log => log.exercise))];
    res.json(unique);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch exercises", error: err.message });
  }
});

// GET /api/workouts/splits - fetch all splits for a user
router.get('/splits', verifyToken, async (req, res) => {
  try {
    const splits = await WorkoutSplit.find({ user: req.user });
    res.json(splits);
  } catch (err) {
    console.error('Failed to fetch splits:', err);
    res.status(500).json({ msg: 'Server error fetching splits' });
  }
});

module.exports = router;


