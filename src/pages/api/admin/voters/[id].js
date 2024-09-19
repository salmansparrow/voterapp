import clientPromise from "../../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("voterapp");
  const collection = db.collection("voters");

  if (req.method === "PUT") {
    try {
      const { id } = req.query;
      const updateData = req.body;

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      if (result.modifiedCount === 0) {
        return res.status(404).json({ error: "Voter not found" });
      }

      res.status(200).json({ message: "Voter updated successfully" });
    } catch (error) {
      console.error("Error updating Voter:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.query;

      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Voter not found" });
      }

      res.status(200).json({ message: "Voter deleted successfully" });
    } catch (error) {
      console.error("Error deleting Voter:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
