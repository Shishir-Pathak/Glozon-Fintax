import jwt from "jsonwebtoken";

export default function authorizeMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
} catch (error) {
  console.error("JWT ERROR:", error.name);
  console.error("JWT MESSAGE:", error.message);

  return res.status(403).json({
    message: "Invalid token",
    error: error.message,
  });
}
}
