// pages/api/admin/addunioncouncil.js

import clientPromise from "../mongodb/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ message: "Union Council name is required" });
    }

    try {
      const client = await clientPromise;
      const db = client.db("voterapp"); // Use your database name
      const unionCouncilsCollection = db.collection("union_councils");

      // Check if the Union Council already exists
      const existingCouncil = await unionCouncilsCollection.findOne({ name });
      if (existingCouncil) {
        return res
          .status(400)
          .json({ message: "Union Council already exists" });
      }

      // Insert the new Union Council into MongoDB
      const newCouncil = {
        name,
        createdAt: new Date(),
      };

      await unionCouncilsCollection.insertOne(newCouncil);

      res.status(201).json({ message: "Union Council added successfully" });
    } catch (error) {
      console.error("Error adding Union Council:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
