const jwt = require("jsonwebtoken");
const jwtdecode = require("jwt-decode");

function verifyToken(authHeader) {
  if (!authHeader) {
    throw new Error("Authorization header is missing.");
  }

  const parts = authHeader.split(" ");

  if (parts.length === 2 && parts[0] === "Bearer") {
    const token = parts[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded);

      const decodedToken = jwtDecode(token);
      console.log("Decoded Token Payload:", decodedToken);

      return decodedToken;
    } catch (error) {
      throw new Error("Invalid or expired token.");
    }
  } else {
    throw new Error("Invalid Authorization header format.");
  }
}
