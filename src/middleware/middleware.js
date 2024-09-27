import jwt from "jsonwebtoken";
import clientPromise from "../pages/api/mongodb/mongodb";

export const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from header

  if (!token) {
    return res.status(401).json({ message: "Authorization token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const client = await clientPromise;
    const db = client.db("voterapp");

    // Check if the user exists
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(decoded.userId) });

    // Check if the token is revoked
    const revokedToken = await db
      .collection("revokedTokens")
      .findOne({ userId: decoded.userId });

    if (!user || revokedToken) {
      return res
        .status(401)
        .json({ message: "User not found or session invalid" });
    }

    // If user is valid, allow the request to proceed
    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid token or session expired" });
  }
};
