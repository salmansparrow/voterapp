import clientPromise from "../mongodb/mongodb";
import { ObjectId } from "mongodb"; // Import ObjectId to use for finding the UC by its ID

export default async function handler(req, res) {
  const { unionCouncilId } = req.query;

  if (req.method === "POST") {
    try {
      const client = await clientPromise;
      const db = client.db("voterapp"); // Use the main database

      // Fetch the Union Council document using the ID to get its name
      const unionCouncil = await db
        .collection("union_councils")
        .findOne({ _id: new ObjectId(unionCouncilId) });

      if (!unionCouncil) {
        return res.status(404).json({ error: "Union Council not found" });
      }

      const voterData = {
        ...req.body, // Get the voter data from the request
        unionCouncil: unionCouncil.name, // Store the Union Council name with the voter data
      };
      // Use unionCouncilId to dynamically choose the collection
      //   const collectionName = unionCouncil.name;
      //   const collection = db.collection(collectionName);
      //   const voterData = req.body;
      // Insert the voter data into the dynamically chosen collection

      const result = await db.collection("voters").insertOne(voterData);
      res.status(200).json({ message: "Voter added successfully", result });
    } catch (error) {
      console.error("Error adding voter:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
