import clientPromise from "../mongodb/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    try {
      const client = await clientPromise;
      const db = client.db("voterapp"); // Use your 'voterapp' database
      const usersCollection = db.collection("users");

      // Find the user by email
      const user = await usersCollection.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the password matches (plain text comparison for now)
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // Check if the user is an admin
      if (!user.isAdmin) {
        return res.status(403).json({ message: "Access denied. Admin only." });
      }

      // Successful login
      return res.status(200).json({
        message: "Login successful",
        user: { email: user.email, isAdmin: user.isAdmin },
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
