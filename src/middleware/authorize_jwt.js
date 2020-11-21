import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default function authorize(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer "))
    return res.status(401).json({ error: "unauthorized" });

  const token = authorization.split("Bearer ")[1];
  let user = {};
  try {
    user = jwt.verify(token, process.env.JWT_KEY);
    req.user = user;
  } catch (error) {
    return res.status(401).json({ error: "unauthorized" });
  }

  next();
}
