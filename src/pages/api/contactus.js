// pages/api/contactus.js

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, number, message } = req.body;

    try {
      // Send form data to Formcarry
      const response = await fetch("https://formcarry.com/s/6yAqt0jJvst", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          number,
          message,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        return res
          .status(200)
          .json({ success: true, message: "Message sent successfully." });
      } else {
        return res
          .status(response.status)
          .json({ success: false, error: result.error });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ success: false, error: `Method ${req.method} Not Allowed` });
  }
}
