import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generatePDFBuffer } from "./pdfTemplate.js";


const require = createRequire(import.meta.url);
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors({
  origin: "https://subscription.luvix.live",
  methods: ["GET", "POST"],
  credentials: true,
}));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.post("/api/send-form", async (req, res) => {
  const formData = req.body;

  try {
    // 📦 Load Thank You HTML Template
    const thankYouHTML = fs.readFileSync(
      path.join(__dirname, "thankYouTemplate.html"),
      "utf8"
    );

    // 📧 Load Admin Email Template
    const adminEmailHTML = fs.readFileSync(
      path.join(__dirname, "adminEmailTemplate.html"),
      "utf8"
    );

    // ✉️ Setup mail transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === "true" || false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 🧾 Generate PDF buffer
    const pdfBuffer = await generatePDFBuffer(formData);

    // Personalize Admin Email Template
    const personalizedAdminHTML = adminEmailHTML
      .replace("{{businessName}}", formData.businessName)
      .replace("{{contactName}}", formData.contactName)
      .replace("{{contactEmail}}", formData.contactEmail)
      .replace("{{contactPhone}}", formData.contactPhone)
      .replace("{{formDataJSON}}", JSON.stringify(formData, null, 2))
      .replace("{{year}}", new Date().getFullYear());

    // 1️⃣ Send email to Admin (with PDF)
    await transporter.sendMail({
      from: `"${process.env.FROM_NAME}" <${process.env.EMAIL_USER}>`,
      to: process.env.RECIPIENT_EMAIL || process.env.EMAIL_USER,
      subject: `New Onboarding Form Submission: ${formData.businessName}`,
      html: personalizedAdminHTML,
      attachments: [
        {
          filename: `${formData.businessName.replace(/\s+/g, "_")}_Onboarding.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    // 2️⃣ Send Thank You email to Client
    // const personalizedThankYouHTML = thankYouHTML
    //   .replace("{{name}}", formData.contactName)
    //   .replace("{{business}}", formData.businessName);

    // await transporter.sendMail({
    //   from: `"${process.env.FROM_NAME}" <${process.env.EMAIL_USER}>`,
    //   to: formData.contactEmail,
    //   subject: `Thanks for submitting your onboarding form, ${formData.contactName}!`,
    //   html: personalizedThankYouHTML,
    // });

    res.status(200).json({ 
      success: true, 
      message: "Form and emails sent successfully" 
    });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));