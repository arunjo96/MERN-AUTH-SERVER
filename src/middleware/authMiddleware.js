
import jwt from "jsonwebtoken";
import redisClient from "../config/redis.js";

export const protect = async (req, res, next) => {
  const authString = req.headers.authorization;

  if (!authString || !authString.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "Error",
      message: "Invalid Token",
    });
  }

  const token = authString.split(" ")[1];

  const blacklisted = await redisClient.get(`blacklist:${token}`);

  if (blacklisted) {
    return res.status(401).json({
      status: "Error",
      message: "Token has been revoked",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = decoded;
    req.token = token;

    next();
  } catch (err) {
    return res.status(401).json({
      status: "Error",
      message: "Token is invalid or expired",
    });
  }
};
