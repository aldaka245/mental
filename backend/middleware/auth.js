import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticate = (roles = []) => (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ message: "Token tidak ditemukan" });

  const token = authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  if (!token)
    return res.status(401).json({ message: "Token tidak ditemukan" });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (roles.length && !roles.includes(decoded.role)) {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verify error:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
};
