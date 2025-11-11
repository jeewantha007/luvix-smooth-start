import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generatePDFBuffer } from "./pdfTemplate.js";
import { createClient } from "@supabase/supabase-js";


const require = createRequire(import.meta.url);
const cors = require("cors");

dotenv.config();

// Initialize Supabase client
// Use service role key for admin operations (bypasses RLS)
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn("⚠️  Supabase credentials not found. User fetching will not work.");
}

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

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

// GET endpoint to fetch all users from Supabase Auth with token and response balances
app.get("/api/users", async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ 
        success: false, 
        error: "Supabase client not configured. Please check your environment variables." 
      });
    }

    // Fetch all authentication users using Admin API
    // This requires the service role key to access auth.users
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.error("Error fetching users:", authError);
      return res.status(500).json({ 
        success: false, 
        error: authError.message 
      });
    }

    const authUsers = authData?.users || [];

    // Fetch all token balances
    const { data: tokenBalances, error: tokenError } = await supabase
      .from("token_balance")
      .select("user_id, remaining_tokens");

    if (tokenError) {
      console.error("Error fetching token balances:", tokenError);
      // Continue even if token balance fetch fails
    }

    // Fetch all response balances
    const { data: responseBalances, error: responseError } = await supabase
      .from("response_balance")
      .select("user_id, total");

    if (responseError) {
      console.error("Error fetching response balances:", responseError);
      // Continue even if response balance fetch fails
    }

    // Create maps for quick lookup
    const tokenBalanceMap = new Map();
    (tokenBalances || []).forEach(balance => {
      tokenBalanceMap.set(balance.user_id, balance.remaining_tokens);
    });

    const responseBalanceMap = new Map();
    (responseBalances || []).forEach(balance => {
      responseBalanceMap.set(balance.user_id, balance.total);
    });

    // Transform the response to include user data with balances
    const users = authUsers.map(user => ({
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
      email_confirmed_at: user.email_confirmed_at,
      phone: user.phone,
      user_metadata: user.user_metadata,
      app_metadata: user.app_metadata,
      remaining_tokens: tokenBalanceMap.get(user.id) ?? 0,
      remaining_responses: responseBalanceMap.get(user.id) ?? 0,
    }));

    res.status(200).json({ 
      success: true, 
      users: users,
      count: users.length
    });
  } catch (err) {
    console.error("Error in /api/users:", err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

// POST endpoint to register a new user with token and response balances
app.post("/api/users/register", async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ 
        success: false, 
        error: "Supabase client not configured. Please check your environment variables." 
      });
    }

    const { email, password, total_tokens, total_responses } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: "Email and password are required" 
      });
    }

    if (total_tokens === undefined || total_responses === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: "total_tokens and total_responses are required" 
      });
    }

    // Convert to numbers
    const tokens = parseInt(total_tokens);
    const responses = parseInt(total_responses);

    if (isNaN(tokens) || isNaN(responses) || tokens < 0 || responses < 0) {
      return res.status(400).json({ 
        success: false, 
        error: "total_tokens and total_responses must be valid positive numbers" 
      });
    }

    // Create user in Supabase Auth using Admin API
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Auto-confirm email
    });

    if (createError) {
      console.error("Error creating user:", createError);
      return res.status(400).json({ 
        success: false, 
        error: createError.message 
      });
    }

    const userId = userData.user.id;

    // Insert token balance
    // Note: client_id is typically the same as user_id in Supabase
    const { error: tokenError } = await supabase
      .from("token_balance")
      .insert({
        user_id: userId,
        client_id: userId, // Add client_id (assuming it's the same as user_id)
        total_tokens: tokens, // Required column
        remaining_tokens: tokens, // Initially same as total_tokens
      });

    if (tokenError) {
      console.error("Error creating token balance:", tokenError);
      // If token balance fails, try to delete the user to maintain consistency
      await supabase.auth.admin.deleteUser(userId);
      return res.status(500).json({ 
        success: false, 
        error: `Failed to create token balance: ${tokenError.message}` 
      });
    }

    // Insert response balance
    const { error: responseError } = await supabase
      .from("response_balance")
      .insert({
        user_id: userId,
        total: responses, // Changed from 'remaining' to 'total'
      });

    if (responseError) {
      console.error("Error creating response balance:", responseError);
      // If response balance fails, clean up: delete token balance and user
      await supabase.from("token_balance").delete().eq("user_id", userId);
      await supabase.auth.admin.deleteUser(userId);
      return res.status(500).json({ 
        success: false, 
        error: `Failed to create response balance: ${responseError.message}` 
      });
    }

    res.status(201).json({ 
      success: true, 
      message: "User registered successfully",
      user: {
        id: userId,
        email: userData.user.email,
        total_tokens: tokens,
        total_responses: responses,
      }
    });
  } catch (err) {
    console.error("Error in /api/users/register:", err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
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