import clientPromise from "../mongodb/mongodb";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const client = await clientPromise;
      const db = client.db("voterapp");
      const unionCouncils = await db
        .collection("union_councils")
        .find({})
        .toArray();
      res.status(200).json(unionCouncils);
    } catch (error) {
      console.error("Error fetching union councils:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
