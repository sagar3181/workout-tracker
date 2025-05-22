console.log("🧠 workoutRoutes loaded");
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

const WorkoutSplit = require("../models/WorkoutSplit");
const WorkoutLog = require("../models/WorkoutLog");

// 👉 POST /api/workouts/split - Create a workout split
router.post("/split", verifyToken, async (req, res) => {
  try {
    const { name } = req.body;
    const split = await WorkoutSplit.create({ user: req.user, name });
    res.status(201).json(split);
  } catch (err) {
    res.status(500).json({ msg: "Failed to create split", error: err.message });
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


module.exports = router;


