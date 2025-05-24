const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Format: "Bearer <token>"
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;

    // ✅ Debug log after successful verification
    console.log("✅ Authenticated user:", req.user);

    next();
  } catch (err) {
    res.status(403).json({ msg: "Invalid token" });
  }
};

module.exports = verifyToken;
