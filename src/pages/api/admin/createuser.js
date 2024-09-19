import clientPromise from "../../../../lib/mongodb";
import bcrypt from "bcrypt";

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
      const db = client.db("voterapp");
      const usersCollection = db.collection("users");

      // Check if user already exists
      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash the password before saving to the database
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the new user into MongoDB
      const newUser = {
        email,
        password: hashedPassword,
        createdAt: new Date(),
        isAdmin: false, // Only admins can modify this flag
      };

      await usersCollection.insertOne(newUser);

      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
