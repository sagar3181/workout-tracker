const mongoose = require("mongoose");

const workoutLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  split: { type: mongoose.Schema.Types.ObjectId, ref: "WorkoutSplit", required: true },
  exercise: { type: String, required: true },
  sets: [
    {
      reps: Number,
      weight: Number
    }
  ],
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("WorkoutLog", workoutLogSchema);
