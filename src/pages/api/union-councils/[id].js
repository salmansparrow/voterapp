import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("voterapp");
    const { id } = req.query; // Extract the ID from the request query

    // Check for different HTTP methods
    if (req.method === "DELETE") {
      // Handle DELETE request
      await db
        .collection("union_councils")
        .deleteOne({ _id: new ObjectId(id) });
      return res
        .status(200)
        .json({ message: "Union Council deleted successfully" });
    } else if (req.method === "PATCH") {
      // Handle PATCH request
      const { name } = req.body; // Get the new name from the request body
      if (!name) {
        return res.status(400).json({ error: "Name is required" });
      }

      await db
        .collection("union_councils")
        .updateOne({ _id: new ObjectId(id) }, { $set: { name } });
      return res
        .status(200)
        .json({ message: "Union Council updated successfully" });
    } else {
      // Method not allowed
      res.setHeader("Allow", ["DELETE", "PATCH"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(`Error handling ${req.method} request:`, error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
