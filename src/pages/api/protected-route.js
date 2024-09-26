import { authenticateUser } from "@/middleware/middleware";

export default async function handler(req, res) {
  // Use the authentication middleware
  authenticateUser(req, res, async () => {
    // This is where your API logic goes, after authentication is confirmed
    res.status(200).json({ data: "This is user-specific data" });
  });
}
