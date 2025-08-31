const jwt = require("jsonwebtoken");

function generateToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "3d" // for testing purpose 
    // expiresIn: "1h", for production

  });
}

function refreshToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
}
module.exports = { generateToken, refreshToken };
