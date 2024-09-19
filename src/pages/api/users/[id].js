import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "PATCH") {
    try {
      const client = await clientPromise;
      const db = client.db("voterapp");
      const { email, password } = req.body;

      const updateFields = {};

      if (email) {
        updateFields.email = email;
      }

      if (password) {
        // Hash the new password before saving to the database
        updateFields.password = await bcrypt.hash(password, 10);
      }

      await db
        .collection("users")
        .updateOne({ _id: new ObjectId(id) }, { $set: updateFields });

      res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "DELETE") {
    try {
      const client = await clientPromise;
      const db = client.db("voterapp");
      await db.collection("users").deleteOne({ _id: new ObjectId(id) });
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["PATCH", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
