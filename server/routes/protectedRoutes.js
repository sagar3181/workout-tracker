const verifyToken = require("./middleware/verifyToken");

app.get("/api/secret", verifyToken, (req, res) => {
  res.json({ msg: `You unlocked the secret, user ID: ${req.user}` });
});
