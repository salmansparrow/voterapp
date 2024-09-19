import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authorization.split(" ")[1]; // Extract the token from 'Bearer <token>'

  try {
    // Verify the token using the same secret as during login
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If token is valid, proceed with the protected content
    res.status(200).json({
      message: "You have access to this protected content",
      user: decoded,
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
}
