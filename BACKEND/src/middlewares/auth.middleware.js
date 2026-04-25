import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("decoded token:", decoded); // paste what this prints
    // 🔥 IMPORTANT (you are using userId)
    req.user = decoded;

    next();
  } catch (error) {
    console.log("AUTH ERROR:", error.message);
    return res.status(401).json({ message: "Token failed" });
  }
};
