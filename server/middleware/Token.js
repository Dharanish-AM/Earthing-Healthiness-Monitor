const jwt = require("jsonwebtoken");
const jwtdecode = require("jwt-decode");

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header is missing." });
  }

  const parts = authHeader.split(" ");

  if (parts.length === 2 && parts[0] === "Bearer") {
    const token = parts[1];

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_KEY);
      //console.log("Decoded Token Payload:", decodedToken);

      req.user = decodedToken;

      next();
    } catch (error) {
      console.error("Token verification error:", error.message);
      return res.status(401).json({ error: "Invalid or expired token." });
    }
  } else {
    return res.status(400).json({ error: "Invalid Authorization header format." });
  }
}

module.exports = {
  verifyToken
}
