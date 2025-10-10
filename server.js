import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// JSON parsing
app.use(express.json());

// Email sending endpoint
app.post("/api/send-email", async (req, res) => {
  const formData = req.body;

  if (!formData || !formData.contactEmail) {
    return res.status(400).json({ error: "Missing form data" });
  }

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Compose email
    const mailOptions = {
      from: `"${process.env.FROM_NAME}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // send to yourself, or any recipient
      subject: `New Onboarding Form Submission from ${formData.businessName}`,
      html: `
        <h2>New Onboarding Submission</h2>
        <p><strong>Business Name:</strong> ${formData.businessName}</p>
        <p><strong>Contact Name:</strong> ${formData.contactName}</p>
        <p><strong>Contact Email:</strong> ${formData.contactEmail}</p>
        <p><strong>Contact Phone:</strong> ${formData.contactPhone}</p>
        <p><strong>Website:</strong> ${formData.website}</p>
        <h3>Full Form Data (JSON)</h3>
        <pre>${JSON.stringify(formData, null, 2)}</pre>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
