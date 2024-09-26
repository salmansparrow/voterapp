import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userId } = req.body;
  console.log("Revoking token for userId 9:", userId);
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("voterapp");

    // Add the user ID to the revoked tokens collection
    await db.collection("revokedTokens").insertOne({ userId });
    console.log("Revoking token for userId 20:", userId);

    res.status(200).json({ message: "Token revoked successfully" });
  } catch (error) {
    console.error("Error revoking token:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
