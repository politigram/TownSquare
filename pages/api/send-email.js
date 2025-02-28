import sgMail from "@sendgrid/mail";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { to, userEmail, firstName, lastName, message } = req.body;

  if (!to || !userEmail || !firstName || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Set API Key from environment variables
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  try {
    // Email to officials
    await sgMail.send({
      to,
      from: "your-email@yourdomain.com", // Must match verified SendGrid sender
      subject: `Message from ${firstName} ${lastName}`,
      text: message,
    });

    // Email confirmation to user
    await sgMail.send({
      to: userEmail,
      from: "your-email@yourdomain.com",
      subject: "Copy of Your Message to Elected Officials",
      text: `You sent the following message:\n\n${message}`,
    });

    res.status(200).json({ success: "Emails sent successfully!" });
  } catch (error) {
    console.error("SendGrid Error:", error.response ? error.response.body : error.message);
    res.status(500).json({ error: "Failed to send email" });
  }
}