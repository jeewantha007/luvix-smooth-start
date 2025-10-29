import PDFDocument from "pdfkit";
import { Buffer } from "buffer";

export const generatePDFBuffer = async (formData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: "A4" });
      const buffers = [];
      
      // Brand colors (RGB values for PDFKit)
      const brandGreen = [21, 135, 63];
      const black = [0, 0, 0];
      const darkGray = [45, 45, 45];
      const lightGray = [245, 245, 245];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      // === HEADER WITH BRAND ===
      // Green header rectangle
      doc.rect(0, 0, doc.page.width, 100)
         .fillColor(brandGreen)
         .fill();
      
      // Company name in white
      doc.fillColor([255, 255, 255])
         .fontSize(32)
         .font("Helvetica-Bold")
         .text("LUVIX", 50, 30, { continued: false });
      
      // Subtitle
      doc.fontSize(11)
         .font("Helvetica")
         .text("Client Onboarding System", 50, 68);

      // Move down after header
      doc.y = 130;

      // === DOCUMENT TITLE ===
      doc.fillColor(brandGreen)
         .fontSize(22)
         .font("Helvetica-Bold")
         .text("Onboarding Form Submission", 50, doc.y, { align: "center" });
      
      doc.moveDown(0.3);
      doc.fillColor(darkGray)
         .fontSize(10)
         .font("Helvetica")
         .text(`Submitted: ${formData.signatureDate}`, { align: "center" });
      
      doc.moveDown(1.5);

      // === CONTACT INFORMATION ===
      const startY = doc.y;
      
      // Section header with green background
      doc.rect(40, doc.y, doc.page.width - 80, 28)
         .fillColor(brandGreen)
         .fill();
      
      doc.fillColor([255, 255, 255])
         .fontSize(14)
         .font("Helvetica-Bold")
         .text("Contact Information", 50, doc.y + 8);
      
      doc.moveDown(1.5);
      
      // Content with alternating backgrounds
      let yPos = doc.y;
      const leftMargin = 50;
      const rowHeight = 22;
      
      // Row 1 - Light gray background
      doc.rect(40, yPos, doc.page.width - 80, rowHeight)
         .fillColor(lightGray)
         .fill();
      doc.fillColor(darkGray)
         .fontSize(11)
         .font("Helvetica-Bold")
         .text("Business Name:", leftMargin, yPos + 6);
      doc.font("Helvetica")
         .text(formData.businessName, leftMargin + 150, yPos + 6);
      
      yPos += rowHeight;
      
      // Row 2 - White background
      doc.fillColor(darkGray)
         .font("Helvetica-Bold")
         .text("Contact Name:", leftMargin, yPos + 6);
      doc.font("Helvetica")
         .text(formData.contactName, leftMargin + 150, yPos + 6);
      
      yPos += rowHeight;
      
      // Row 3 - Light gray background
      doc.rect(40, yPos, doc.page.width - 80, rowHeight)
         .fillColor(lightGray)
         .fill();
      doc.fillColor(darkGray)
         .font("Helvetica-Bold")
         .text("Email Address:", leftMargin, yPos + 6);
      doc.font("Helvetica")
         .text(formData.contactEmail, leftMargin + 150, yPos + 6);
      
      yPos += rowHeight;
      
      // Row 4 - White background
      doc.fillColor(darkGray)
         .font("Helvetica-Bold")
         .text("Phone Number:", leftMargin, yPos + 6);
      doc.font("Helvetica")
         .text(formData.contactPhone, leftMargin + 150, yPos + 6);
      
      doc.y = yPos + 30;

      // === SELECTED PLAN (HIGHLIGHTED BOX) ===
      doc.roundedRect(40, doc.y, doc.page.width - 80, 45, 5)
         .lineWidth(3)
         .strokeColor(brandGreen)
         .fillAndStroke([250, 255, 252], brandGreen);
      
      doc.fillColor(brandGreen)
         .fontSize(13)
         .font("Helvetica-Bold")
         .text("Selected Plan:", 50, doc.y + 12);
      
      doc.fontSize(18)
         .text(formData.selectedPlan, leftMargin + 150, doc.y - 6);
      
      doc.moveDown(3);

      // === BUSINESS INFORMATION ===
      doc.rect(40, doc.y, doc.page.width - 80, 28)
         .fillColor(brandGreen)
         .fill();
      
      doc.fillColor([255, 255, 255])
         .fontSize(14)
         .font("Helvetica-Bold")
         .text("Business Information", 50, doc.y + 8);
      
      doc.moveDown(1.5);
      
      yPos = doc.y;
      
      // Industry
      doc.rect(40, yPos, doc.page.width - 80, rowHeight)
         .fillColor(lightGray)
         .fill();
      doc.fillColor(darkGray)
         .fontSize(11)
         .font("Helvetica-Bold")
         .text("Industry:", leftMargin, yPos + 6);
      doc.font("Helvetica")
         .text(formData.industry, leftMargin + 150, yPos + 6);
      
      yPos += rowHeight;
      
      // Website
      doc.fillColor(darkGray)
         .font("Helvetica-Bold")
         .text("Website:", leftMargin, yPos + 6);
      doc.font("Helvetica")
         .text(formData.website || "Not Provided", leftMargin + 150, yPos + 6);
      
      yPos += rowHeight;
      
      // Communication Style
      doc.rect(40, yPos, doc.page.width - 80, rowHeight)
         .fillColor(lightGray)
         .fill();
      doc.fillColor(darkGray)
         .font("Helvetica-Bold")
         .text("Communication Style:", leftMargin, yPos + 6);
      doc.font("Helvetica")
         .text(formData.communicationStyle, leftMargin + 150, yPos + 6);
      
      doc.y = yPos + 30;
      
      // Description box
      doc.fillColor(darkGray)
         .fontSize(11)
         .font("Helvetica-Bold")
         .text("Business Description:", leftMargin);
      
      doc.moveDown(0.3);
      doc.font("Helvetica")
         .fontSize(10)
         .text(formData.businessDescription, leftMargin, doc.y, {
           width: 500,
           align: "justify"
         });
      
      doc.moveDown(1.5);

      // === PROJECT TIMELINE ===
      doc.rect(40, doc.y, doc.page.width - 80, 28)
         .fillColor(brandGreen)
         .fill();
      
      doc.fillColor([255, 255, 255])
         .fontSize(14)
         .font("Helvetica-Bold")
         .text("Project Timeline", 50, doc.y + 8);
      
      doc.moveDown(1.5);
      
      yPos = doc.y;
      
      doc.rect(40, yPos, doc.page.width - 80, rowHeight)
         .fillColor(lightGray)
         .fill();
      doc.fillColor(darkGray)
         .fontSize(11)
         .font("Helvetica-Bold")
         .text("Training Date:", leftMargin, yPos + 6);
      doc.font("Helvetica")
         .text(formData.trainingDate, leftMargin + 150, yPos + 6);
      
      yPos += rowHeight;
      
      doc.fillColor(darkGray)
         .font("Helvetica-Bold")
         .text("Go Live Date:", leftMargin, yPos + 6);
      doc.font("Helvetica")
         .text(formData.goLiveDate, leftMargin + 150, yPos + 6);
      
      yPos += rowHeight;
      
      doc.rect(40, yPos, doc.page.width - 80, rowHeight)
         .fillColor(lightGray)
         .fill();
      doc.fillColor(darkGray)
         .font("Helvetica-Bold")
         .text("Training Attendees:", leftMargin, yPos + 6);
      doc.font("Helvetica")
         .text(formData.trainingAttendees, leftMargin + 150, yPos + 6);
      
      doc.y = yPos + 30;

      // === LEAD INFORMATION ===
      doc.rect(40, doc.y, doc.page.width - 80, 28)
         .fillColor(brandGreen)
         .fill();
      
      doc.fillColor([255, 255, 255])
         .fontSize(14)
         .font("Helvetica-Bold")
         .text("Lead Information", 50, doc.y + 8);
      
      doc.moveDown(1.5);
      
      doc.fillColor(darkGray)
         .fontSize(10)
         .font("Helvetica");
      
      formData.leadInfo.forEach((item, idx) => {
        doc.circle(leftMargin + 5, doc.y + 4, 2)
           .fillColor(brandGreen)
           .fill();
        doc.fillColor(darkGray)
           .text(item, leftMargin + 15, doc.y);
        doc.moveDown(0.5);
      });
      
      doc.moveDown(1);

      // === INTEGRATIONS ===
      doc.rect(40, doc.y, doc.page.width - 80, 28)
         .fillColor(brandGreen)
         .fill();
      
      doc.fillColor([255, 255, 255])
         .fontSize(14)
         .font("Helvetica-Bold")
         .text("Integrations", 50, doc.y + 8);
      
      doc.moveDown(1.5);
      
      doc.fillColor(darkGray)
         .fontSize(10)
         .font("Helvetica");
      
      formData.integrations.forEach((item) => {
        doc.circle(leftMargin + 5, doc.y + 4, 2)
           .fillColor(brandGreen)
           .fill();
        doc.fillColor(darkGray)
           .text(item, leftMargin + 15, doc.y);
        doc.moveDown(0.5);
      });
      
      doc.moveDown(1);

      // === COMPLIANCE ===
      doc.rect(40, doc.y, doc.page.width - 80, 28)
         .fillColor(brandGreen)
         .fill();
      
      doc.fillColor([255, 255, 255])
         .fontSize(14)
         .font("Helvetica-Bold")
         .text("Compliance Requirements", 50, doc.y + 8);
      
      doc.moveDown(1.5);
      
      doc.fillColor(darkGray)
         .fontSize(10)
         .font("Helvetica");
      
      formData.compliance.forEach((item) => {
        doc.circle(leftMargin + 5, doc.y + 4, 2)
           .fillColor(brandGreen)
           .fill();
        doc.fillColor(darkGray)
           .text(item, leftMargin + 15, doc.y);
        doc.moveDown(0.5);
      });
      
      doc.moveDown(1);

      // === ESCALATION CONTACT ===
      doc.rect(40, doc.y, doc.page.width - 80, 28)
         .fillColor(brandGreen)
         .fill();
      
      doc.fillColor([255, 255, 255])
         .fontSize(14)
         .font("Helvetica-Bold")
         .text("Escalation Contact", 50, doc.y + 8);
      
      doc.moveDown(1.5);
      
      yPos = doc.y;
      
      doc.rect(40, yPos, doc.page.width - 80, rowHeight)
         .fillColor(lightGray)
         .fill();
      doc.fillColor(darkGray)
         .fontSize(11)
         .font("Helvetica-Bold")
         .text("Type:", leftMargin, yPos + 6);
      doc.font("Helvetica")
         .text(formData.escalationType, leftMargin + 150, yPos + 6);
      
      yPos += rowHeight;
      
      doc.fillColor(darkGray)
         .font("Helvetica-Bold")
         .text("Contact:", leftMargin, yPos + 6);
      doc.font("Helvetica")
         .text(formData.escalationContact, leftMargin + 150, yPos + 6);
      
      doc.y = yPos + 30;

      // === AGREEMENTS ===
      doc.rect(40, doc.y, doc.page.width - 80, 28)
         .fillColor(brandGreen)
         .fill();
      
      doc.fillColor([255, 255, 255])
         .fontSize(14)
         .font("Helvetica-Bold")
         .text("Agreements & Confirmations", 50, doc.y + 8);
      
      doc.moveDown(1.5);
      
      const agreements = [
        { label: "Authority to Sign", value: formData.agreementAuthority },
        { label: "Terms Accepted", value: formData.agreementTerms },
        { label: "WhatsApp Communication", value: formData.agreementWhatsApp },
        { label: "Accuracy Confirmed", value: formData.agreementAccuracy }
      ];

      yPos = doc.y;
      
      agreements.forEach((item, idx) => {
        if (idx % 2 === 0) {
          doc.rect(40, yPos, doc.page.width - 80, rowHeight)
             .fillColor(lightGray)
             .fill();
        }
        
        doc.fillColor(darkGray)
           .fontSize(11)
           .font("Helvetica")
           .text(item.label + ":", leftMargin, yPos + 6);
        
        const statusColor = item.value ? brandGreen : [211, 47, 47];
        const statusText = item.value ? "✓ Yes" : "✗ No";
        
        doc.fillColor(statusColor)
           .font("Helvetica-Bold")
           .text(statusText, leftMargin + 180, yPos + 6);
        
        yPos += rowHeight;
      });

      doc.y = yPos + 20;

      // === SIGNATURE BOX ===
      doc.roundedRect(50, doc.y, 250, 55, 5)
         .lineWidth(2)
         .strokeColor(brandGreen)
         .stroke();
      
      doc.fillColor(darkGray)
         .fontSize(10)
         .font("Helvetica-Bold")
         .text("Authorized Signatory:", 60, doc.y + 10);
      
      doc.font("Helvetica")
         .fontSize(11)
         .text(formData.fullName, 60, doc.y + 26);
      
      doc.fontSize(9)
         .text("Date: " + formData.signatureDate, 60, doc.y + 40);

      // === FOOTER ===
      const footerY = doc.page.height - 40;
      doc.rect(0, footerY, doc.page.width, 40)
         .fillColor(brandGreen)
         .fill();
      
      doc.fillColor([255, 255, 255])
         .fontSize(9)
         .font("Helvetica")
         .text("Generated by Luvix Onboarding System", 50, footerY + 15);
      
      doc.text("Document ID: " + Date.now(), doc.page.width - 200, footerY + 15);

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};