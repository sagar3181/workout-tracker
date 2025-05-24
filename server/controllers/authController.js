const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// Register User
exports.register = async (req, res) => {
    console.log("🔥 /api/auth/register hit");
  
    try {
      const { email, password } = req.body;
      console.log("📦 Body received:", req.body);
  
      const userExists = await User.findOne({ email });
      if (userExists) {
        console.log("⚠️ User already exists");
        return res.status(400).json({ msg: "User already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ email, password: hashedPassword });
  
      console.log("✅ Registered user:", newUser.email);
      res.status(201).json({ msg: "User registered", userId: newUser._id });
    } catch (err) {
      console.error("❌ Register Error:", err.message);
      res.status(500).json({ msg: "Server error", error: err.message });
    }
  };
  
  
// exports.register = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const userExists = await User.findOne({ email });
//     if (userExists) return res.status(400).json({ msg: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = await User.create({ email, password: hashedPassword });
//     res.status(201).json({ msg: "User registered", userId: newUser._id });
//   } catch (err) {
//     res.status(500).json({ msg: "Server error", error: err.message });
//   }
// };

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "2h" });
    res.json({ token, userId: user._id });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
