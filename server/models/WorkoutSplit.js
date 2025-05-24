// const mongoose = require("mongoose");

// const workoutSplitSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   name: { type: String, required: true }, // e.g., "Push Day"
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model("WorkoutSplit", workoutSplitSchema);

const mongoose = require("mongoose");

const workoutSplitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model("WorkoutSplit", workoutSplitSchema);