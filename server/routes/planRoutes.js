const express = require("express");
const router = express.Router();
const WorkoutPlan = require("../models/WorkoutPlan");
const WorkoutSplit = require("../models/WorkoutSplit");
const verifyToken = require("../middleware/verifyToken");

// GET all plans with their splits
router.get("/", verifyToken, async (req, res) => {
  try {
    const plans = await WorkoutPlan.find({ user: req.user });
    const plansWithSplits = await Promise.all(
      plans.map(async (plan) => {
        const splits = await WorkoutSplit.find({ plan: plan._id });
        return { ...plan.toObject(), splits };
      })
    );
    res.json(plansWithSplits);
  } catch (err) {
    res.status(500).json({ msg: "Error loading plans", error: err.message });
  }
});

// POST a new workout plan
router.post("/", verifyToken, async (req, res) => {
  try {
    const newPlan = await WorkoutPlan.create({ user: req.user, name: req.body.name });
    res.status(201).json(newPlan);
  } catch (err) {
    res.status(500).json({ msg: "Error creating plan", error: err.message });
  }
});

// POST a new split to a plan
router.post("/:planId/splits", verifyToken, async (req, res) => {
  try {
    const newSplit = await WorkoutSplit.create({
      user: req.user,
      plan: req.params.planId,
      name: req.body.name,
    });
    res.status(201).json(newSplit);
  } catch (err) {
    res.status(500).json({ msg: "Error creating split", error: err.message });
  }
});

module.exports = router;