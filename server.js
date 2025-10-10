import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const cors = require("cors");

dotenv.config();
const app = express();

// Add CORS middleware
app.use(cors());
app.use(express.json());

// Add a root route for health check
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.post("/api/send-form", async (req, res) => {
  const formData = req.body;

  // Check for required environment variables
  const requiredEnvVars = ['EMAIL_USER', 'EMAIL_PASS', 'FROM_NAME'];
  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missingEnvVars.length > 0) {
    return res.status(500).json({ 
      success: false, 
      error: `Missing environment variables: ${missingEnvVars.join(', ')}. Please check your .env file.` 
    });
  }

  try {
    // Configure transporter based on environment variables
    const transporterConfig = {
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === "true" || false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    };

    // If EMAIL_SERVICE is provided, use it (for services like Gmail, Outlook, etc.)
    if (process.env.EMAIL_SERVICE) {
      transporterConfig.service = process.env.EMAIL_SERVICE;
    }

    const transporter = nodemailer.createTransport(transporterConfig);

    // Test the connection
    await transporter.verify();

    const mailOptions = {
      from: `"${process.env.FROM_NAME}" <${process.env.EMAIL_USER}>`,
      to: process.env.RECIPIENT_EMAIL || process.env.EMAIL_USER,
      subject: `New Onboarding Form Submission: ${formData.businessName}`,
      html: `
        <h2>New Onboarding Form Submission</h2>
        <p><strong>Business Name:</strong> ${formData.businessName}</p>
        <p><strong>Contact Name:</strong> ${formData.contactName}</p>
        <p><strong>Contact Email:</strong> ${formData.contactEmail}</p>
        <p><strong>Contact Phone:</strong> ${formData.contactPhone}</p>
        <hr />
        <h3>Full Form Data:</h3>
        <pre>${JSON.stringify(formData, null, 2)}</pre>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Form submitted successfully" });
  } catch (err) {
    console.error("Email sending error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));