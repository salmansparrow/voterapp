import clientPromise from "../mongodb/mongodb";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const client = await clientPromise;
      const db = client.db("voterapp");

      // Fetch all voters from the "voters" collection
      const voters = await db.collection("voters").find({}).toArray();
      res.status(200).json(voters); // Return the fetched data
    } catch (error) {
      console.error("Error fetching Voters data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
