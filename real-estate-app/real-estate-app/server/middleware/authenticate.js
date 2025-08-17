const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  // Check if the "Authorization" header exists
  const authHeader = req.header("Authorization");
  console.log("🔑 Token received:", authHeader);

  // Extract the token from the "Authorization" header if it starts with "Bearer "
  const token = authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  // If no token is provided, return 401 Unauthorized
  if (!token) {
    return res.status(401).json({ message: "No token provided, please login first" });
  }

  try {
    // Verify the token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user data to the request object
    req.user = decoded;

    // Log the decoded user data for debugging
    console.log("✅ Authenticated user:", decoded);

    // Move to the next middleware or route handler
    next();
  } catch (error) {
    // If the token is invalid or expired, return a 401 Unauthorized response
    console.error("❌ JWT Error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticateUser;
