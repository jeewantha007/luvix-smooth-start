import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generatePDFBuffer } from "./pdfTemplate.js";
import { createClient } from "@supabase/supabase-js";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";


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

    // Prepare Supabase insert data
    const supabaseData = {
      // Step 0
      business_name: formData.businessName,
      industry: formData.industry,
      industry_other: formData.industryOther,
      website: formData.website,
      contact_name: formData.contactName,
      contact_email: formData.contactEmail,
      contact_phone: formData.contactPhone,
      contact_whatsapp: formData.contactWhatsApp,
      
      // Step 1
      whatsapp_number: formData.whatsappNumber,
      whatsapp_status: formData.whatsappStatus,
      meta_business_manager: formData.metaBusinessManager,
      meta_business_manager_id: formData.metaBusinessManagerId,
      
      // Step 2
      business_hours_start: formData.businessHoursStart,
      business_hours_end: formData.businessHoursEnd,
      timezone: formData.timezone,
      message_volume: formData.messageVolume,
      team_members: formData.teamMembers || [],
      
      // Step 3
      top_questions: formData.topQuestions || [],
      business_description: formData.businessDescription,
      communication_style: formData.communicationStyle,
      share_pricing: formData.sharePricing,
      pricing_details: formData.pricingDetails,
      
      // Step 4
      lead_info: formData.leadInfo || [],
      lead_info_custom: formData.leadInfoCustom,
      priority_leads: formData.priorityLeads || [],
      appointment_booking: formData.appointmentBooking,
      calendar_email: formData.calendarEmail,
      
      // Step 5
      escalation_rules: formData.escalationRules || [],
      escalation_messages: formData.escalationMessages,
      escalation_contact: formData.escalationContact,
      escalation_type: formData.escalationType,
      
      // Step 6
      current_crm: formData.currentCRM,
      crm_other: formData.crmOther,
      integrations: formData.integrations || [],
      integrations_other: formData.integrationsOther,
      
      // Step 7
      compliance: formData.compliance || [],
      compliance_other: formData.complianceOther,
      language: formData.language,
      language_other: formData.languageOther,
      data_storage: formData.dataStorage,
      
      // Step 8
      go_live_date: formData.goLiveDate || null,
      training_date: formData.trainingDate || null,
      training_attendees: formData.trainingAttendees,
      selected_plan: formData.selectedPlan,
      
      // Step 9
      success_looks: formData.successLooks,
      challenges: formData.challenges,
      special_requirements: formData.specialRequirements,
      referral_source: formData.referralSource || [],
      referral_name: formData.referralName,
      referral_other: formData.referralOther,
      agreement_authority: formData.agreementAuthority || false,
      agreement_terms: formData.agreementTerms || false,
      agreement_whatsapp: formData.agreementWhatsApp || false,
      agreement_accuracy: formData.agreementAccuracy || false,
      full_name: formData.fullName,
      signature_date: formData.signatureDate || null,
    };

    // 1️⃣ Send email to Admin (with PDF) and 2️⃣ Save to Supabase in parallel
    const [emailResult, supabaseResult] = await Promise.allSettled([
      // Email operation
      transporter.sendMail({
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
      }),
      // Supabase operation
      supabase
        ? supabase.from("onboarding_submissions").insert(supabaseData)
        : Promise.resolve({ error: null, data: null }),
    ]);

    // Handle email result
    if (emailResult.status === "rejected") {
      console.error("Error sending email:", emailResult.reason);
      throw new Error(`Email failed: ${emailResult.reason.message}`);
    } else {
      console.log("✅ Email sent successfully");
    }

    // Handle Supabase result
    if (supabase) {
      if (supabaseResult.status === "fulfilled") {
        const { error: supabaseError } = supabaseResult.value;
        if (supabaseError) {
          console.error("Error saving to Supabase:", supabaseError);
        } else {
          console.log("✅ Form submission saved to Supabase successfully");
        }
      } else {
        console.error("Error saving to Supabase:", supabaseResult.reason);
      }
    } else {
      console.warn("⚠️  Supabase not configured, skipping database save");
    }

    // 3️⃣ Send Thank You email to Client (optional, commented out)
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

// GET endpoint to fetch all onboarding submissions
app.get("/api/submissions", async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ 
        success: false, 
        error: "Supabase client not configured. Please check your environment variables." 
      });
    }

    const { data, error } = await supabase
      .from("onboarding_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching submissions:", error);
      return res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }

    res.status(200).json({ 
      success: true, 
      submissions: data || [],
      count: data?.length || 0
    });
  } catch (err) {
    console.error("Error in /api/submissions:", err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

// Helper function to convert database row to form data format
const convertDbRowToFormData = (row) => {
  return {
    businessName: row.business_name || "",
    industry: row.industry || "",
    industryOther: row.industry_other || "",
    website: row.website || "",
    contactName: row.contact_name || "",
    contactEmail: row.contact_email || "",
    contactPhone: row.contact_phone || "",
    contactWhatsApp: row.contact_whatsapp || "",
    whatsappNumber: row.whatsapp_number || "",
    whatsappStatus: row.whatsapp_status || "",
    metaBusinessManager: row.meta_business_manager || "",
    metaBusinessManagerId: row.meta_business_manager_id || "",
    businessHoursStart: row.business_hours_start || "",
    businessHoursEnd: row.business_hours_end || "",
    timezone: row.timezone || "",
    messageVolume: row.message_volume || "",
    teamMembers: row.team_members || [],
    topQuestions: row.top_questions || [],
    businessDescription: row.business_description || "",
    communicationStyle: row.communication_style || "",
    sharePricing: row.share_pricing || "",
    pricingDetails: row.pricing_details || "",
    leadInfo: row.lead_info || [],
    leadInfoCustom: row.lead_info_custom || "",
    priorityLeads: row.priority_leads || [],
    appointmentBooking: row.appointment_booking || "",
    calendarEmail: row.calendar_email || "",
    escalationRules: row.escalation_rules || [],
    escalationMessages: row.escalation_messages || "",
    escalationContact: row.escalation_contact || "",
    escalationType: row.escalation_type || "",
    currentCRM: row.current_crm || "",
    crmOther: row.crm_other || "",
    integrations: row.integrations || [],
    integrationsOther: row.integrations_other || "",
    compliance: row.compliance || [],
    complianceOther: row.compliance_other || "",
    language: row.language || "",
    languageOther: row.language_other || "",
    dataStorage: row.data_storage || "",
    goLiveDate: row.go_live_date || "",
    trainingDate: row.training_date || "",
    trainingAttendees: row.training_attendees || "",
    selectedPlan: row.selected_plan || "",
    successLooks: row.success_looks || "",
    challenges: row.challenges || "",
    specialRequirements: row.special_requirements || "",
    referralSource: row.referral_source || [],
    referralName: row.referral_name || "",
    referralOther: row.referral_other || "",
    agreementAuthority: row.agreement_authority || false,
    agreementTerms: row.agreement_terms || false,
    agreementWhatsApp: row.agreement_whatsapp || false,
    agreementAccuracy: row.agreement_accuracy || false,
    fullName: row.full_name || "",
    signatureDate: row.signature_date || "",
  };
};

// Helper function to generate Word document
const generateWordDocument = async (formData) => {
  const children = [
        new Paragraph({
          text: "LUVIX",
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "Client Onboarding Form Submission",
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: `Submitted: ${formData.signatureDate || "N/A"}`,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),
        
        // Contact Information
        new Paragraph({
          text: "Contact Information",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Business Name: ", bold: true }),
            new TextRun({ text: formData.businessName || "N/A" }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Contact Name: ", bold: true }),
            new TextRun({ text: formData.contactName || "N/A" }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Email Address: ", bold: true }),
            new TextRun({ text: formData.contactEmail || "N/A" }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Phone Number: ", bold: true }),
            new TextRun({ text: formData.contactPhone || "N/A" }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "WhatsApp Number: ", bold: true }),
            new TextRun({ text: formData.contactWhatsApp || "N/A" }),
          ],
          spacing: { after: 300 },
        }),

        // Selected Plan
        new Paragraph({
          text: "Selected Plan",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 },
        }),
        new Paragraph({
          text: formData.selectedPlan || "N/A",
          spacing: { after: 300 },
        }),

        // Business Information
        new Paragraph({
          text: "Business Information",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Industry: ", bold: true }),
            new TextRun({ text: formData.industry || "N/A" }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Website: ", bold: true }),
            new TextRun({ text: formData.website || "N/A" }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Communication Style: ", bold: true }),
            new TextRun({ text: formData.communicationStyle || "N/A" }),
          ],
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Business Description: ", bold: true }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: formData.businessDescription || "N/A",
          spacing: { after: 300 },
        }),

        // Business Operations
        new Paragraph({
          text: "Business Operations",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Business Hours: ", bold: true }),
            new TextRun({ text: `${formData.businessHoursStart || "N/A"} - ${formData.businessHoursEnd || "N/A"}` }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Timezone: ", bold: true }),
            new TextRun({ text: formData.timezone || "N/A" }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Message Volume: ", bold: true }),
            new TextRun({ text: formData.messageVolume || "N/A" }),
          ],
          spacing: { after: 200 },
        }),
        ...(formData.teamMembers && formData.teamMembers.length > 0 ? [
          new Paragraph({
            children: [
              new TextRun({ text: "Team Members: ", bold: true }),
            ],
            spacing: { after: 100 },
          }),
          ...formData.teamMembers.map(member => 
            new Paragraph({
              text: `• ${member.name} (${member.email})`,
              spacing: { after: 50 },
            })
          ),
        ] : []),

        // Top Questions
        ...(formData.topQuestions && formData.topQuestions.length > 0 ? [
          new Paragraph({
            text: "Top Questions",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 },
          }),
          ...formData.topQuestions.map(question => 
            new Paragraph({
              text: `• ${question}`,
              spacing: { after: 100 },
            })
          ),
        ] : []),

        // Lead Management
        new Paragraph({
          text: "Lead Management",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 },
        }),
        ...(formData.leadInfo && formData.leadInfo.length > 0 ? [
          new Paragraph({
            children: [
              new TextRun({ text: "Lead Information Needed: ", bold: true }),
            ],
            spacing: { after: 100 },
          }),
          ...formData.leadInfo.map(info => 
            new Paragraph({
              text: `• ${info}`,
              spacing: { after: 50 },
            })
          ),
        ] : []),
        ...(formData.priorityLeads && formData.priorityLeads.length > 0 ? [
          new Paragraph({
            children: [
              new TextRun({ text: "Priority Leads: ", bold: true }),
            ],
            spacing: { before: 200, after: 100 },
          }),
          ...formData.priorityLeads.map(lead => 
            new Paragraph({
              text: `• ${lead}`,
              spacing: { after: 50 },
            })
          ),
        ] : []),
        new Paragraph({
          children: [
            new TextRun({ text: "Appointment Booking: ", bold: true }),
            new TextRun({ text: formData.appointmentBooking || "N/A" }),
          ],
          spacing: { after: 300 },
        }),

        // Escalation
        new Paragraph({
          text: "Escalation Rules",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 },
        }),
        ...(formData.escalationRules && formData.escalationRules.length > 0 ? [
          ...formData.escalationRules.map(rule => 
            new Paragraph({
              text: `• ${rule}`,
              spacing: { after: 100 },
            })
          ),
        ] : []),
        new Paragraph({
          children: [
            new TextRun({ text: "Escalation Contact: ", bold: true }),
            new TextRun({ text: formData.escalationContact || "N/A" }),
          ],
          spacing: { after: 300 },
        }),

        // Integrations
        new Paragraph({
          text: "Integrations",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Current CRM: ", bold: true }),
            new TextRun({ text: formData.currentCRM || "N/A" }),
          ],
          spacing: { after: 100 },
        }),
        ...(formData.integrations && formData.integrations.length > 0 ? [
          new Paragraph({
            children: [
              new TextRun({ text: "Integrations: ", bold: true }),
            ],
            spacing: { after: 100 },
          }),
          ...formData.integrations.map(integration => 
            new Paragraph({
              text: `• ${integration}`,
              spacing: { after: 50 },
            })
          ),
        ] : []),

        // Compliance & Settings
        new Paragraph({
          text: "Compliance & Settings",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 },
        }),
        ...(formData.compliance && formData.compliance.length > 0 ? [
          new Paragraph({
            children: [
              new TextRun({ text: "Compliance Requirements: ", bold: true }),
            ],
            spacing: { after: 100 },
          }),
          ...formData.compliance.map(comp => 
            new Paragraph({
              text: `• ${comp}`,
              spacing: { after: 50 },
            })
          ),
        ] : []),
        new Paragraph({
          children: [
            new TextRun({ text: "Language: ", bold: true }),
            new TextRun({ text: formData.language || "N/A" }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Data Storage: ", bold: true }),
            new TextRun({ text: formData.dataStorage || "N/A" }),
          ],
          spacing: { after: 300 },
        }),

        // Timeline
        new Paragraph({
          text: "Project Timeline",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Go Live Date: ", bold: true }),
            new TextRun({ text: formData.goLiveDate || "N/A" }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Training Date: ", bold: true }),
            new TextRun({ text: formData.trainingDate || "N/A" }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Training Attendees: ", bold: true }),
            new TextRun({ text: formData.trainingAttendees || "N/A" }),
          ],
          spacing: { after: 300 },
        }),

        // Final Details
        new Paragraph({
          text: "Final Details",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "What Does Success Look Like: ", bold: true }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: formData.successLooks || "N/A",
          spacing: { after: 200 },
        }),
        ...(formData.challenges ? [
          new Paragraph({
            children: [
              new TextRun({ text: "Current Challenges: ", bold: true }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: formData.challenges,
            spacing: { after: 200 },
          }),
        ] : []),
        ...(formData.specialRequirements ? [
          new Paragraph({
            children: [
              new TextRun({ text: "Special Requirements: ", bold: true }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: formData.specialRequirements,
            spacing: { after: 200 },
          }),
        ] : []),
        ...(formData.referralSource && formData.referralSource.length > 0 ? [
          new Paragraph({
            children: [
              new TextRun({ text: "Referral Source: ", bold: true }),
            ],
            spacing: { after: 100 },
          }),
          ...formData.referralSource.map(source => 
            new Paragraph({
              text: `• ${source}`,
              spacing: { after: 50 },
            })
          ),
        ] : []),

        // Agreements
        new Paragraph({
          text: "Agreements",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 },
        }),
        new Paragraph({
          text: `Authority to Enter Agreement: ${formData.agreementAuthority ? "Yes" : "No"}`,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: `Terms of Service Agreement: ${formData.agreementTerms ? "Yes" : "No"}`,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: `WhatsApp Business API Policies: ${formData.agreementWhatsApp ? "Yes" : "No"}`,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: `Information Accuracy Confirmation: ${formData.agreementAccuracy ? "Yes" : "No"}`,
          spacing: { after: 200 },
        }),

        // Signature
        new Paragraph({
          text: "Signature",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Full Name: ", bold: true }),
            new TextRun({ text: formData.fullName || "N/A" }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Date: ", bold: true }),
            new TextRun({ text: formData.signatureDate || "N/A" }),
          ],
          spacing: { after: 300 },
        }),
  ];

  const sections = [
    {
      properties: {},
      children: children,
    },
  ];

  return await Packer.toBuffer(new Document({ sections }));
};

// GET endpoint to export submission as Word document
app.get("/api/submissions/:id/export", async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ 
        success: false, 
        error: "Supabase client not configured." 
      });
    }

    const { id } = req.params;

    const { data, error } = await supabase
      .from("onboarding_submissions")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return res.status(404).json({ 
        success: false, 
        error: "Submission not found" 
      });
    }

    // Convert database row to form data format
    const formData = convertDbRowToFormData(data);

    // Generate Word document
    const docBuffer = await generateWordDocument(formData);

    // Set response headers for file download
    const fileName = `${formData.businessName.replace(/\s+/g, "_")}_Onboarding_Form.docx`;
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Length", docBuffer.length);

    res.send(docBuffer);
  } catch (err) {
    console.error("Error exporting submission:", err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));