require("dotenv").config();
const nodemailer = require("nodemailer");

// Email Transporter Setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASSWORD, // App password for Gmail
  },
});

// Contact Form Controller
const contactController = async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: "Email and message are required." });
  }

  try {
    await transporter.sendMail({
      from: email,
      to: process.env.ADMIN_EMAIL,
      subject: "New Contact Form Submission",
      text: `Name: ${name || "N/A"}\nEmail: ${email}\nPhone: ${phone || "N/A"}\nMessage: ${message}`,
    });

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email." });
  }
};

module.exports = contactController;
