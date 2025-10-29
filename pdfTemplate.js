import PDFDocument from "pdfkit";
import { Buffer } from "buffer";

export const generatePDFBuffer = async (formData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: "A4" });
      const buffers = [];

      // Brand colors
      const brandGreen = [21, 135, 63];
      const darkGray = [45, 45, 45];
      const lightGray = [245, 245, 245];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      // === HEADER ===
      doc.rect(0, 0, doc.page.width, 100).fillColor(brandGreen).fill();
      doc.fillColor([255, 255, 255]).fontSize(32).font("Helvetica-Bold").text("LUVIX", 50, 30);
      doc.fontSize(11).font("Helvetica").text("Client Onboarding System", 50, 68);
      doc.y = 130;

      // === DOCUMENT TITLE ===
      doc.fillColor(brandGreen).fontSize(22).font("Helvetica-Bold")
         .text("Onboarding Form Submission", 50, doc.y, { align: "center" });
      doc.moveDown(0.3);
      doc.fillColor(darkGray).fontSize(10).font("Helvetica")
         .text(`Submitted: ${formData.signatureDate || "N/A"}`, { align: "center" });
      doc.moveDown(1.5);

      // === CONTACT INFORMATION ===
      const leftMargin = 50;
      const rowHeight = 22;
      let yPos = doc.y;

      const contactRows = [
        { label: "Business Name:", value: formData.businessName || "" },
        { label: "Contact Name:", value: formData.contactName || "" },
        { label: "Email Address:", value: formData.contactEmail || "" },
        { label: "Phone Number:", value: formData.contactPhone || "" },
      ];

      // Section header
      doc.rect(40, yPos, doc.page.width - 80, 28).fillColor(brandGreen).fill();
      doc.fillColor([255, 255, 255]).fontSize(14).font("Helvetica-Bold").text("Contact Information", 50, yPos + 8);
      doc.moveDown(1.5);
      yPos += 30;

      // Contact info rows with alternating backgrounds
      contactRows.forEach((row, idx) => {
        if (idx % 2 === 0) doc.rect(40, yPos, doc.page.width - 80, rowHeight).fillColor(lightGray).fill();
        doc.fillColor(darkGray).fontSize(11).font("Helvetica-Bold").text(row.label, leftMargin, yPos + 6);
        doc.font("Helvetica").text(row.value, leftMargin + 150, yPos + 6);
        yPos += rowHeight;
      });

      doc.y = yPos + 30;

      // === SELECTED PLAN ===
      doc.roundedRect(40, doc.y, doc.page.width - 80, 45, 5).lineWidth(3).strokeColor(brandGreen)
         .fillAndStroke([250, 255, 252], brandGreen);
      doc.fillColor(brandGreen).fontSize(13).font("Helvetica-Bold").text("Selected Plan:", 50, doc.y + 12);
      doc.fontSize(18).text(formData.selectedPlan || "N/A", leftMargin + 150, doc.y - 6);
      doc.moveDown(3);

      // === BUSINESS INFORMATION ===
      doc.rect(40, doc.y, doc.page.width - 80, 28).fillColor(brandGreen).fill();
      doc.fillColor([255, 255, 255]).fontSize(14).font("Helvetica-Bold").text("Business Information", 50, doc.y + 8);
      doc.moveDown(1.5);
      yPos = doc.y;

      const businessRows = [
        { label: "Industry:", value: formData.industry || "" },
        { label: "Website:", value: formData.website || "Not Provided" },
        { label: "Communication Style:", value: formData.communicationStyle || "" },
      ];

      businessRows.forEach((row, idx) => {
        if (idx % 2 === 0) doc.rect(40, yPos, doc.page.width - 80, rowHeight).fillColor(lightGray).fill();
        doc.fillColor(darkGray).fontSize(11).font("Helvetica-Bold").text(row.label, leftMargin, yPos + 6);
        doc.font("Helvetica").text(row.value, leftMargin + 150, yPos + 6);
        yPos += rowHeight;
      });

      doc.y = yPos + 30;
      doc.fillColor(darkGray).fontSize(11).font("Helvetica-Bold").text("Business Description:", leftMargin);
      doc.moveDown(0.3);
      doc.font("Helvetica").fontSize(10).text(formData.businessDescription || "", leftMargin, doc.y, { width: 500, align: "justify" });
      doc.moveDown(1.5);

      // === PROJECT TIMELINE ===
      doc.rect(40, doc.y, doc.page.width - 80, 28).fillColor(brandGreen).fill();
      doc.fillColor([255, 255, 255]).fontSize(14).font("Helvetica-Bold").text("Project Timeline", 50, doc.y + 8);
      doc.moveDown(1.5);
      yPos = doc.y;

      const timelineRows = [
        { label: "Training Date:", value: formData.trainingDate || "" },
        { label: "Go Live Date:", value: formData.goLiveDate || "" },
        { label: "Training Attendees:", value: formData.trainingAttendees || "" },
      ];

      timelineRows.forEach((row, idx) => {
        if (idx % 2 === 0) doc.rect(40, yPos, doc.page.width - 80, rowHeight).fillColor(lightGray).fill();
        doc.fillColor(darkGray).fontSize(11).font("Helvetica-Bold").text(row.label, leftMargin, yPos + 6);
        doc.font("Helvetica").text(row.value, leftMargin + 150, yPos + 6);
        yPos += rowHeight;
      });

      doc.y = yPos + 30;

      // === LEAD INFORMATION ===
      doc.rect(40, doc.y, doc.page.width - 80, 28).fillColor(brandGreen).fill();
      doc.fillColor([255, 255, 255]).fontSize(14).font("Helvetica-Bold").text("Lead Information", 50, doc.y + 8);
      doc.moveDown(1.5);
      (formData.leadInfo || []).forEach((item) => {
        doc.circle(leftMargin + 5, doc.y + 4, 2).fillColor(brandGreen).fill();
        doc.fillColor(darkGray).text(item, leftMargin + 15, doc.y);
        doc.moveDown(0.5);
      });

      doc.moveDown(1);

      // === INTEGRATIONS ===
      doc.rect(40, doc.y, doc.page.width - 80, 28).fillColor(brandGreen).fill();
      doc.fillColor([255, 255, 255]).fontSize(14).font("Helvetica-Bold").text("Integrations", 50, doc.y + 8);
      doc.moveDown(1.5);
      (formData.integrations || []).forEach((item) => {
        doc.circle(leftMargin + 5, doc.y + 4, 2).fillColor(brandGreen).fill();
        doc.fillColor(darkGray).text(item, leftMargin + 15, doc.y);
        doc.moveDown(0.5);
      });

      doc.moveDown(1);

      // === COMPLIANCE ===
      doc.rect(40, doc.y, doc.page.width - 80, 28).fillColor(brandGreen).fill();
      doc.fillColor([255, 255, 255]).fontSize(14).font("Helvetica-Bold").text("Compliance Requirements", 50, doc.y + 8);
      doc.moveDown(1.5);
      (formData.compliance || []).forEach((item) => {
        doc.circle(leftMargin + 5, doc.y + 4, 2).fillColor(brandGreen).fill();
        doc.fillColor(darkGray).text(item, leftMargin + 15, doc.y);
        doc.moveDown(0.5);
      });

      // === Remaining sections (Escalation, Agreements, Signature, Footer) ===
      // ... keep the same as your original code

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
