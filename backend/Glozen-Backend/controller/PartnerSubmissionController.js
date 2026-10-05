import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import cloudinary from "../utils/cloudinary.js";

import Partner from "../model/partnerModel.js";
import PartnerSubmission from "../model/PartnerSubmission.js";

// =====================================================
// CURRENT FILE DIRECTORY
// =====================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =====================================================
// GLOZON FINTAX LOGO
// =====================================================

const glozonLogoPath = path.join(
  process.cwd(),
  "assets",
  "Logo.png"
);

// =====================================================
// CHECK GLOZON LOGO
// =====================================================

function getGlozonLogo() {
  console.log("=================================");
  console.log("CHECKING GLOZON LOGO");
  console.log("=================================");

  console.log("Current working directory:");
  console.log(process.cwd());

  console.log("Controller directory:");
  console.log(__dirname);

  console.log("Logo path:");
  console.log(glozonLogoPath);

  try {
    if (!fs.existsSync(glozonLogoPath)) {
      console.error("❌ GLOZON LOGO NOT FOUND");
      console.error("Expected location:");
      console.error(glozonLogoPath);

      console.log("=================================");

      return null;
    }

    const stats = fs.statSync(glozonLogoPath);

    console.log("✅ GLOZON LOGO FOUND");
    console.log("Logo size:", stats.size, "bytes");

    console.log("=================================");

    return glozonLogoPath;
  } catch (error) {
    console.error(
      "❌ GLOZON LOGO CHECK ERROR:",
      error.message
    );

    return null;
  }
}

// =====================================================
// DOWNLOAD PARTNER LOGO FROM CLOUDINARY
// =====================================================

async function getImageBuffer(imageUrl) {
  if (!imageUrl) {
    console.log(
      "⚠️ NO PARTNER LOGO URL PROVIDED"
    );

    return null;
  }

  try {
    console.log("=================================");
    console.log("DOWNLOADING PARTNER LOGO");
    console.log("URL:", imageUrl);
    console.log("=================================");

    const response = await fetch(imageUrl);

    if (!response.ok) {
      console.error(
        "❌ FAILED TO DOWNLOAD PARTNER LOGO"
      );

      console.error(
        "STATUS:",
        response.status
      );

      console.error(
        "STATUS TEXT:",
        response.statusText
      );

      return null;
    }

    const arrayBuffer =
      await response.arrayBuffer();

    const buffer =
      Buffer.from(arrayBuffer);

    console.log(
      "✅ PARTNER LOGO DOWNLOADED"
    );

    console.log(
      "SIZE:",
      buffer.length,
      "bytes"
    );

    return buffer;
  } catch (error) {
    console.error(
      "❌ PARTNER LOGO DOWNLOAD ERROR:",
      error.message
    );

    return null;
  }
}

// =====================================================
// HELPER: DRAW SECTION TITLE
// =====================================================

function drawSectionTitle(
  doc,
  title,
  x,
  y,
  width
) {
  // Green vertical bar
  doc
    .save()
    .rect(
      x,
      y + 2,
      4,
      17
    )
    .fill("#036B09")
    .restore();

  // Section title
  doc
    .font("Helvetica-Bold")
    .fontSize(13)
    .fillColor("#0F172A")
    .text(
      title,
      x + 12,
      y,
      {
        width: width - 12,
      }
    );

  // Small line
  doc
    .moveTo(
      x + 12,
      y + 22
    )
    .lineTo(
      x + width,
      y + 22
    )
    .lineWidth(0.6)
    .strokeColor("#DDE4E8")
    .stroke();
}

// =====================================================
// HELPER: DRAW INFORMATION ROW
// =====================================================

function drawInfoRow(
  doc,
  label,
  value,
  x,
  y,
  labelWidth,
  valueWidth
) {
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor("#475569")
    .text(
      `${label}:`,
      x,
      y,
      {
        width: labelWidth,
      }
    );

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#111827")
    .text(
      value || "-",
      x + labelWidth,
      y,
      {
        width: valueWidth,
      }
    );
}

// =====================================================
// HELPER: DRAW INFORMATION BOX
// =====================================================

function drawInfoBox(
  doc,
  x,
  y,
  width,
  height
) {
  doc
    .save()
    .roundedRect(
      x,
      y,
      width,
      height,
      6
    )
    .fillAndStroke(
      "#F8FAFC",
      "#E2E8F0"
    )
    .restore();
}

// =====================================================
// HELPER: LOCATION ICON
// =====================================================

function drawLocationIcon(
  doc,
  x,
  y
) {
  doc
    .save()
    .fillColor("#036B09")
    .circle(
      x + 7,
      y + 7,
      6
    )
    .fill();

  doc
    .save()
    .fillColor("#FFFFFF")
    .circle(
      x + 7,
      y + 7,
      2
    )
    .fill();

  doc
    .save()
    .fillColor("#036B09")
    .moveTo(
      x + 2,
      y + 9
    )
    .lineTo(
      x + 7,
      y + 19
    )
    .lineTo(
      x + 12,
      y + 9
    )
    .fill()
    .restore();
}

// =====================================================
// HELPER: PHONE ICON
// =====================================================

function drawPhoneIcon(
  doc,
  x,
  y
) {
  doc
    .save()
    .font("Helvetica-Bold")
    .fontSize(16)
    .fillColor("#036B09")
    .text(
      "☎",
      x,
      y,
      {
        width: 20,
      }
    )
    .restore();
}

// =====================================================
// HELPER: EMAIL ICON
// =====================================================

function drawEmailIcon(
  doc,
  x,
  y
) {
  doc
    .save()
    .roundedRect(
      x,
      y + 3,
      14,
      10,
      2
    )
    .fill("#036B09")
    .restore();

  doc
    .save()
    .strokeColor("#FFFFFF")
    .lineWidth(1)
    .moveTo(
      x + 1,
      y + 4
    )
    .lineTo(
      x + 7,
      y + 9
    )
    .lineTo(
      x + 13,
      y + 4
    )
    .stroke()
    .restore();
}

// =====================================================
// HELPER: WEB ICON
// =====================================================

function drawWebIcon(
  doc,
  x,
  y
) {
  doc
    .save()
    .strokeColor("#036B09")
    .lineWidth(1.5)
    .circle(
      x + 7,
      y + 8,
      7
    )
    .stroke();

  doc
    .moveTo(
      x + 1,
      y + 8
    )
    .lineTo(
      x + 13,
      y + 8
    )
    .stroke();

  doc
    .moveTo(
      x + 7,
      y + 1
    )
    .lineTo(
      x + 7,
      y + 15
    )
    .stroke();

  doc
    .restore();
}

// =====================================================
// HELPER: DRAW FOOTER
// =====================================================

function drawFooter(
  doc,
  pageWidth,
  pageHeight
) {
  // ===================================================
  // FOOTER POSITION
  // ===================================================

  // IMPORTANT:
  // Footer is moved DOWN so that the declaration
  // and address section never touch it.

  const footerTop =
    pageHeight - 105;

  // ===================================================
  // TOP FOOTER LINE
  // ===================================================

  doc
    .moveTo(
      40,
      footerTop
    )
    .lineTo(
      pageWidth - 40,
      footerTop
    )
    .lineWidth(0.8)
    .strokeColor("#94A3B8")
    .stroke();

  // ===================================================
  // FOOTER CONTENT
  // ===================================================

  const contentY =
    footerTop + 16;

  // ===================================================
  // VERTICAL SEPARATOR 1
  // ===================================================

  doc
    .moveTo(
      218,
      contentY + 2
    )
    .lineTo(
      218,
      contentY + 43
    )
    .lineWidth(0.7)
    .strokeColor("#036B09")
    .stroke();

  // ===================================================
  // VERTICAL SEPARATOR 2
  // ===================================================

  doc
    .moveTo(
      395,
      contentY + 2
    )
    .lineTo(
      395,
      contentY + 43
    )
    .lineWidth(0.7)
    .strokeColor("#036B09")
    .stroke();

  // ===================================================
  // ADDRESS ICON
  // ===================================================

  drawLocationIcon(
    doc,
    48,
    contentY + 1
  );

  // ===================================================
  // ADDRESS
  // ===================================================

  doc
    .font("Helvetica-Bold")
    .fontSize(8.5)
    .fillColor("#036B09")
    .text(
      "Changathali 07, Mahalaxmi",
      68,
      contentY,
      {
        width: 135,
      }
    );

  doc
    .font("Helvetica")
    .fontSize(8.5)
    .fillColor("#475569")
    .text(
      "Lalitpur, Kathmandu Valley, Nepal",
      68,
      contentY + 14,
      {
        width: 140,
      }
    );

  // ===================================================
  // PHONE ICON
  // ===================================================

  drawPhoneIcon(
    doc,
    238,
    contentY
  );

  // ===================================================
  // PHONE TITLE
  // ===================================================

  doc
    .font("Helvetica-Bold")
    .fontSize(8.5)
    .fillColor("#036B09")
    .text(
      "Phone",
      267,
      contentY,
      {
        width: 45,
      }
    );

  // ===================================================
  // PHONE NUMBERS
  // ===================================================

  doc
    .font("Helvetica")
    .fontSize(8.5)
    .fillColor("#475569")
    .text(
      "+977 9845971220",
      267,
      contentY + 14,
      {
        width: 110,
      }
    );

  doc
    .font("Helvetica")
    .fontSize(8.5)
    .fillColor("#475569")
    .text(
      "+977 9803003837",
      267,
      contentY + 28,
      {
        width: 110,
      }
    );

  // ===================================================
  // EMAIL ICON
  // ===================================================

  drawEmailIcon(
    doc,
    416,
    contentY + 1
  );

  // ===================================================
  // EMAIL TITLE
  // ===================================================

  doc
    .font("Helvetica-Bold")
    .fontSize(8.5)
    .fillColor("#036B09")
    .text(
      "Email",
      438,
      contentY,
      {
        width: 45,
      }
    );

  // ===================================================
  // EMAIL
  // ===================================================

  doc
    .font("Helvetica")
    .fontSize(8.5)
    .fillColor("#475569")
    .text(
      "gfa@glozonfintax.com",
      438,
      contentY + 14,
      {
        width: 120,
      }
    );

  // ===================================================
  // WEB ICON
  // ===================================================

  drawWebIcon(
    doc,
    416,
    contentY + 29
  );

  // ===================================================
  // WEBSITE TITLE
  // ===================================================

  doc
    .font("Helvetica-Bold")
    .fontSize(8.5)
    .fillColor("#036B09")
    .text(
      "Web",
      438,
      contentY + 28,
      {
        width: 45,
      }
    );

  // ===================================================
  // WEBSITE
  // ===================================================

  doc
    .font("Helvetica")
    .fontSize(8.5)
    .fillColor("#475569")
    .text(
      "glozonfintax.com",
      438,
      contentY + 42,
      {
        width: 120,
      }
    );

  // ===================================================
  // COLOR FOOTER STRIPE
  // ===================================================

  const stripeY =
    pageHeight - 40;

  // Orange stripe
  doc
    .rect(
      0,
      stripeY,
      pageWidth * 0.58,
      8
    )
    .fill("#FFAB09");

  // Blue stripe
  doc
    .rect(
      pageWidth * 0.58,
      stripeY,
      pageWidth * 0.42,
      8
    )
    .fill("#2A17B4");

  // Green accent
  doc
    .rect(
      0,
      stripeY + 8,
      pageWidth,
      3
    )
    .fill("#036B09");

  // ===================================================
  // FOOTER COPYRIGHT
  // ===================================================

  doc
    .font("Helvetica")
    .fontSize(7)
    .fillColor("#94A3B8")
    .text(
      "Glozon FinTax  •  Partner Registration Submission",
      50,
      pageHeight - 25,
      {
        width:
          pageWidth - 100,
        align: "center",
      }
    );
}

// =====================================================
// GENERATE PARTNER SUBMISSION PDF
// =====================================================

async function generatePartnerSubmissionPDF(
  submission,
  partner
) {
  console.log("=================================");
  console.log("STARTING PDF GENERATION");
  console.log("=================================");

  // ===================================================
  // GLOZON LOGO
  // ===================================================

  const glozonLogo =
    getGlozonLogo();

  // ===================================================
  // PARTNER LOGO
  // ===================================================

  let partnerLogoBuffer = null;

  if (partner?.logoUrl) {
    console.log(
      "Partner logo URL found:"
    );

    console.log(
      partner.logoUrl
    );

    partnerLogoBuffer =
      await getImageBuffer(
        partner.logoUrl
      );
  } else {
    console.log(
      "⚠️ PARTNER HAS NO LOGO URL"
    );
  }

  // ===================================================
  // CREATE PDF
  // ===================================================

  return new Promise(
    (resolve, reject) => {
      try {
        const doc =
          new PDFDocument({
            size: "A4",
            margin: 0,
            autoFirstPage: true,
          });

        const chunks = [];

        // =================================================
        // COLLECT PDF BUFFER
        // =================================================

        doc.on(
          "data",
          (chunk) => {
            chunks.push(chunk);
          }
        );

        // =================================================
        // PDF FINISHED
        // =================================================

        doc.on(
          "end",
          () => {
            const pdfBuffer =
              Buffer.concat(chunks);

            console.log(
              "================================="
            );

            console.log(
              "✅ PDF BUFFER CREATED"
            );

            console.log(
              "PDF SIZE:",
              pdfBuffer.length,
              "bytes"
            );

            console.log(
              "================================="
            );

            resolve(
              pdfBuffer
            );
          }
        );

        // =================================================
        // PDF ERROR
        // =================================================

        doc.on(
          "error",
          (error) => {
            console.error(
              "❌ PDF DOCUMENT ERROR:",
              error
            );

            reject(error);
          }
        );

        // =================================================
        // PAGE SETTINGS
        // =================================================

        const pageWidth =
          595.28;

        const pageHeight =
          841.89;

        const leftMargin =
          55;

        const rightMargin =
          55;

        const contentWidth =
          pageWidth -
          leftMargin -
          rightMargin;

        // =================================================
        // HEADER
        // =================================================

        const headerTop =
          25;

        const logoWidth =
          150;

        const logoHeight =
          65;

        // =================================================
        // GLOZON LOGO - LEFT
        // =================================================

        if (glozonLogo) {
          try {
            console.log(
              "ADDING GLOZON LOGO TO PDF..."
            );

            doc.image(
              glozonLogo,
              leftMargin,
              headerTop,
              {
                fit: [
                  logoWidth,
                  logoHeight,
                ],
                align: "left",
                valign: "center",
              }
            );

            console.log(
              "✅ GLOZON LOGO ADDED"
            );
          } catch (error) {
            console.error(
              "❌ FAILED TO ADD GLOZON LOGO:",
              error.message
            );
          }
        }

        // =================================================
        // PARTNER LOGO - RIGHT
        // =================================================

        if (partnerLogoBuffer) {
          try {
            console.log(
              "ADDING PARTNER LOGO TO PDF..."
            );

            const partnerLogoX =
              pageWidth -
              rightMargin -
              logoWidth;

            doc.image(
              partnerLogoBuffer,
              partnerLogoX,
              headerTop,
              {
                fit: [
                  logoWidth,
                  logoHeight,
                ],
                align: "right",
                valign: "center",
              }
            );

            console.log(
              "✅ PARTNER LOGO ADDED"
            );
          } catch (error) {
            console.error(
              "❌ FAILED TO ADD PARTNER LOGO:",
              error.message
            );
          }
        }

        // =================================================
        // PARTNER ID + REGISTRATION SLUG
        // =================================================

        const centerInfoX =
          leftMargin +
          logoWidth +
          20;

        const centerInfoWidth =
          pageWidth -
          leftMargin -
          rightMargin -
          logoWidth * 2 -
          40;

        // =================================================
        // PARTNER ID
        // =================================================

        doc
          .font("Helvetica-Bold")
          .fontSize(8)
          .fillColor("#036B09")
          .text(
            "Partner ID",
            centerInfoX,
            42,
            {
              width:
                centerInfoWidth,
              align: "center",
            }
          );

        doc
          .font("Helvetica")
          .fontSize(8)
          .fillColor("#475569")
          .text(
            String(
              partner?.id || "-"
            ),
            centerInfoX,
            54,
            {
              width:
                centerInfoWidth,
              align: "center",
            }
          );

        // =================================================
        // REGISTRATION SLUG
        // =================================================

        doc
          .font("Helvetica-Bold")
          .fontSize(8)
          .fillColor("#036B09")
          .text(
            "Registration Slug",
            centerInfoX,
            67,
            {
              width:
                centerInfoWidth,
              align: "center",
            }
          );

        doc
          .font("Helvetica")
          .fontSize(7.5)
          .fillColor("#475569")
          .text(
            partner?.slug || "-",
            centerInfoX,
            79,
            {
              width:
                centerInfoWidth,
              align: "center",
            }
          );

        // =================================================
        // HEADER COLOR LINE
        // =================================================

        const lineY =
          102;

        // Green
        doc
          .moveTo(
            0,
            lineY
          )
          .lineTo(
            pageWidth * 0.15,
            lineY
          )
          .lineWidth(3)
          .strokeColor("#036B09")
          .stroke();

        // Orange
        doc
          .moveTo(
            pageWidth * 0.15,
            lineY
          )
          .lineTo(
            pageWidth * 0.55,
            lineY
          )
          .lineWidth(3)
          .strokeColor("#FFAB09")
          .stroke();

        // Blue
        doc
          .moveTo(
            pageWidth * 0.55,
            lineY
          )
          .lineTo(
            pageWidth,
            lineY
          )
          .lineWidth(3)
          .strokeColor("#2A17B4")
          .stroke();

        // =================================================
        // MAIN TITLE
        // =================================================

        doc
          .font("Helvetica-Bold")
          .fontSize(21)
          .fillColor("#036B09")
          .text(
            "PARTNER REGISTRATION",
            leftMargin,
            125,
            {
              width:
                contentWidth,
              align: "center",
            }
          );

        doc
          .font("Helvetica")
          .fontSize(9)
          .fillColor("#64748B")
          .text(
            "Partner Registration Submission",
            leftMargin,
            151,
            {
              width:
                contentWidth,
              align: "center",
            }
          );

        // =================================================
        // SUBMISSION INFORMATION
        // =================================================

        const infoY =
          178;

        doc
          .font("Helvetica-Bold")
          .fontSize(8)
          .fillColor("#036B09")
          .text(
            `Submission ID: ${
              submission.id || "-"
            }`,
            leftMargin,
            infoY
          );

        doc
          .font("Helvetica")
          .fontSize(8)
          .fillColor("#64748B")
          .text(
            `Submitted On: ${
              submission.createdAt
                ? new Date(
                    submission.createdAt
                  ).toLocaleString()
                : new Date().toLocaleString()
            }`,
            pageWidth - 255,
            infoY,
            {
              width: 200,
              align: "right",
            }
          );

        // =================================================
        // PARTNER INFORMATION
        // =================================================

        const partnerSectionY =
          205;

        drawSectionTitle(
          doc,
          "Partner Information",
          leftMargin,
          partnerSectionY,
          contentWidth
        );

        const partnerBoxY =
          partnerSectionY + 32;

        const partnerBoxHeight =
          72;

        drawInfoBox(
          doc,
          leftMargin,
          partnerBoxY,
          contentWidth,
          partnerBoxHeight
        );

        // Partner Name
        drawInfoRow(
          doc,
          "Partner Name",
          partner?.name || "-",
          leftMargin + 15,
          partnerBoxY + 15,
          110,
          175
        );

        // Partner ID
        drawInfoRow(
          doc,
          "Partner ID",
          partner?.id || "-",
          330,
          partnerBoxY + 15,
          80,
          90
        );

        // Registration Slug
        drawInfoRow(
          doc,
          "Registration Slug",
          partner?.slug || "-",
          leftMargin + 15,
          partnerBoxY + 43,
          110,
          175
        );

        // =================================================
        // COMPANY INFORMATION
        // =================================================

        const companySectionY =
          partnerBoxY +
          partnerBoxHeight +
          22;

        drawSectionTitle(
          doc,
          "Company Information",
          leftMargin,
          companySectionY,
          contentWidth
        );

        const companyBoxY =
          companySectionY + 32;

        // Slightly reduced so lower sections have
        // comfortable space.
        const companyBoxHeight =
          118;

        drawInfoBox(
          doc,
          leftMargin,
          companyBoxY,
          contentWidth,
          companyBoxHeight
        );

        // Company Name
        drawInfoRow(
          doc,
          "Company Name",
          submission.name || "-",
          leftMargin + 15,
          companyBoxY + 14,
          125,
          175
        );

        // Registration Number
        drawInfoRow(
          doc,
          "Registration Number",
          submission.registrationNumber || "-",
          leftMargin + 15,
          companyBoxY + 40,
          125,
          175
        );

        // Email
        drawInfoRow(
          doc,
          "Email",
          submission.email || "-",
          leftMargin + 15,
          companyBoxY + 66,
          125,
          175
        );

        // Phone
        drawInfoRow(
          doc,
          "Phone",
          submission.phone || "-",
          leftMargin + 15,
          companyBoxY + 92,
          125,
          175
        );

        // =================================================
        // CONTACT PERSON
        // =================================================

        const contactSectionY =
          companyBoxY +
          companyBoxHeight +
          20;

        drawSectionTitle(
          doc,
          "Contact Person",
          leftMargin,
          contactSectionY,
          contentWidth
        );

        const contactBoxY =
          contactSectionY + 32;

        const contactBoxHeight =
          68;

        drawInfoBox(
          doc,
          leftMargin,
          contactBoxY,
          contentWidth,
          contactBoxHeight
        );

        // Full Name
        drawInfoRow(
          doc,
          "Full Name",
          submission.contactName || "-",
          leftMargin + 15,
          contactBoxY + 14,
          110,
          175
        );

        // Position
        drawInfoRow(
          doc,
          "Position",
          submission.position || "-",
          leftMargin + 15,
          contactBoxY + 40,
          110,
          175
        );

        // =================================================
        // COMPANY ADDRESS
        // =================================================

        const addressSectionY =
          contactBoxY +
          contactBoxHeight +
          19;

        drawSectionTitle(
          doc,
          "Company Address",
          leftMargin,
          addressSectionY,
          contentWidth
        );

        const addressBoxY =
          addressSectionY + 32;

        // Reduced height so declaration has
        // enough space before footer.
        const addressBoxHeight =
          58;

        drawInfoBox(
          doc,
          leftMargin,
          addressBoxY,
          contentWidth,
          addressBoxHeight
        );

        // =================================================
        // ADDRESS TEXT
        // =================================================

        doc
          .font("Helvetica")
          .fontSize(9.5)
          .fillColor("#111827")
          .text(
            submission.address || "-",
            leftMargin + 15,
            addressBoxY + 17,
            {
              width:
                contentWidth - 30,
              height:
                addressBoxHeight - 20,
              lineGap: 2,
            }
          );

        // =================================================
        // DECLARATION / NOTE
        //
        // IMPORTANT:
        // This is now safely separated from the
        // address box and footer.
        // =================================================

        const noteY =
          addressBoxY +
          addressBoxHeight +
          17;

        doc
          .font("Helvetica")
          .fontSize(8)
          .fillColor("#64748B")
          .text(
            "This document contains the information submitted through the Glozon FinTax partner registration form.",
            leftMargin,
            noteY,
            {
              width:
                contentWidth,
              align: "left",
              lineGap: 2,
            }
          );

        // =================================================
        // FOOTER
        // =================================================

        drawFooter(
          doc,
          pageWidth,
          pageHeight
        );

        // =================================================
        // FINISH PDF
        // =================================================

        doc.end();
      } catch (error) {
        console.error(
          "❌ PDF GENERATION ERROR:",
          error
        );

        reject(error);
      }
    }
  );
}

// =====================================================
// SUBMIT PARTNER FORM
//
// POST:
// /api/v1/partners/:slug/submit
// =====================================================

export async function submitPartnerForm(
  req,
  res
) {
  try {
    console.log(
      "================================="
    );

    console.log(
      "PARTNER SUBMISSION"
    );

    console.log(
      "BODY:",
      req.body
    );

    console.log(
      "PARAMS:",
      req.params
    );

    console.log(
      "FILE:",
      req.file
    );

    console.log(
      "================================="
    );

    // =================================================
    // GET SLUG
    // =================================================

    const {
      slug,
    } = req.params;

    // =================================================
    // GET FORM DATA
    // =================================================

    const {
      name,
      email,
      phone,
      registrationNumber,
      contactName,
      position,
      address,
    } = req.body;

    // =================================================
    // FIND PARTNER
    // =================================================

    const partner =
      await Partner.findOne({
        where: {
          slug,
          isActive: true,
        },
      });

    if (!partner) {
      return res.status(404).json({
        success: false,
        message:
          "Partner registration link is invalid or expired.",
      });
    }

    // =================================================
    // VALIDATE NAME
    // =================================================

    if (
      !name ||
      !name.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name is required.",
      });
    }

    // =================================================
    // VALIDATE EMAIL
    // =================================================

    if (
      !email ||
      !email.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Email is required.",
      });
    }

    // =================================================
    // VALIDATE EMAIL FORMAT
    // =================================================

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(
        email.trim()
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide a valid email address.",
      });
    }

    // =================================================
    // LOGO
    // =================================================

    let logoUrl =
      partner.logoUrl ||
      null;

    if (req.file) {
      logoUrl =
        req.file.secure_url ||
        req.file.path ||
        req.file.url ||
        logoUrl;
    }

    console.log(
      "PARTNER LOGO URL:",
      logoUrl
    );

    // =================================================
    // CREATE SUBMISSION
    // =================================================

    const submission =
      await PartnerSubmission.create({
        partnerId:
          partner.id,

        name:
          name.trim(),

        email:
          email.trim(),

        phone:
          phone?.trim() ||
          null,

        registrationNumber:
          registrationNumber?.trim() ||
          null,

        contactName:
          contactName?.trim() ||
          null,

        position:
          position?.trim() ||
          null,

        address:
          address?.trim() ||
          null,

        logoUrl,

        pdfUrl:
          null,
      });

    console.log(
      "================================="
    );

    console.log(
      "✅ PARTNER SUBMISSION CREATED"
    );

    console.log(
      submission.toJSON()
    );

    console.log(
      "================================="
    );

    // =================================================
    // GENERATE PDF
    // =================================================

    console.log(
      "GENERATING PARTNER PDF..."
    );

    const pdfBuffer =
      await generatePartnerSubmissionPDF(
        submission,
        partner
      );

    console.log(
      "✅ PDF GENERATED SUCCESSFULLY"
    );

    console.log(
      "PDF SIZE:",
      pdfBuffer.length,
      "bytes"
    );

    // =================================================
    // UPLOAD PDF TO CLOUDINARY
    // =================================================

    console.log(
      "UPLOADING PDF TO CLOUDINARY..."
    );

    const pdfUpload =
      await new Promise(
        (
          resolve,
          reject
        ) => {
          const uploadStream =
            cloudinary.uploader.upload_stream(
              {
                folder:
                  "glozonfintax/partner-submissions",

                resource_type:
                  "raw",

                public_id:
                  `submission-${submission.id}-${Date.now()}`,

                format:
                  "pdf",
              },

              (
                error,
                result
              ) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            );

          uploadStream.end(
            pdfBuffer
          );
        }
      );

    console.log(
      "PDF CLOUDINARY RESULT:",
      pdfUpload
    );

    // =================================================
    // GET PDF URL
    // =================================================

    const pdfUrl =
      pdfUpload?.secure_url ||
      pdfUpload?.url ||
      null;

    if (!pdfUrl) {
      throw new Error(
        "PDF uploaded but Cloudinary URL was not generated."
      );
    }

    console.log(
      "PDF URL:",
      pdfUrl
    );

    // =================================================
    // SAVE PDF URL
    // =================================================

    await submission.update({
      pdfUrl,
    });

    await submission.reload();

    console.log(
      "✅ PDF URL SAVED SUCCESSFULLY"
    );

    console.log(
      "FINAL SUBMISSION:",
      submission.toJSON()
    );

    // =================================================
    // SUCCESS
    // =================================================

    return res.status(201).json({
      success: true,

      message:
        "Partner form submitted successfully.",

      data: {
        submissionId:
          submission.id,

        partnerId:
          partner.id,

        partnerName:
          partner.name,

        pdfUrl,

        logoUrl,

        submission:
          submission.toJSON(),
      },
    });
  } catch (error) {
    console.error(
      "================================="
    );

    console.error(
      "❌ PARTNER SUBMISSION ERROR"
    );

    console.error(
      "NAME:",
      error.name
    );

    console.error(
      "MESSAGE:",
      error.message
    );

    console.error(
      "ORIGINAL:",
      error.original
    );

    console.error(
      "SQL:",
      error.sql
    );

    console.error(
      "STACK:",
      error.stack
    );

    console.error(
      "================================="
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to submit partner form.",
    });
  }
}

// =====================================================
// GET ALL PARTNER SUBMISSIONS
//
// GET:
// /api/v1/partner-submissions
// =====================================================

export async function getAllPartnerSubmissions(
  req,
  res
) {
  try {
    console.log(
      "GET ALL PARTNER SUBMISSIONS"
    );

    const submissions =
      await PartnerSubmission.findAll({
        order: [
          [
            "createdAt",
            "DESC",
          ],
        ],
      });

    return res.status(200).json({
      success: true,

      count:
        submissions.length,

      data:
        submissions,
    });
  } catch (error) {
    console.error(
      "GET ALL PARTNER SUBMISSIONS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to fetch partner submissions.",
    });
  }
}

// =====================================================
// GET SUBMISSIONS BY PARTNER
//
// GET:
// /api/v1/partners/:partnerId/submissions
// =====================================================

export async function getSubmissionsByPartner(
  req,
  res
) {
  try {
    const {
      partnerId,
    } = req.params;

    console.log(
      "GET SUBMISSIONS FOR PARTNER:",
      partnerId
    );

    // =================================================
    // FIND PARTNER
    // =================================================

    const partner =
      await Partner.findByPk(
        partnerId
      );

    if (!partner) {
      return res.status(404).json({
        success: false,

        message:
          "Partner not found.",
      });
    }

    // =================================================
    // GET SUBMISSIONS
    // =================================================

    const submissions =
      await PartnerSubmission.findAll({
        where: {
          partnerId,
        },

        order: [
          [
            "createdAt",
            "DESC",
          ],
        ],
      });

    // =================================================
    // SUCCESS
    // =================================================

    return res.status(200).json({
      success: true,

      partner: {
        id:
          partner.id,

        name:
          partner.name,

        slug:
          partner.slug,

        logoUrl:
          partner.logoUrl,
      },

      count:
        submissions.length,

      data:
        submissions,
    });
  } catch (error) {
    console.error(
      "GET SUBMISSIONS BY PARTNER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to fetch partner submissions.",
    });
  }
}

// =====================================================
// GET SINGLE PARTNER SUBMISSION
//
// GET:
// /api/v1/partner-submissions/:id
// =====================================================

export async function getPartnerSubmissionById(
  req,
  res
) {
  try {
    const {
      id,
    } = req.params;

    console.log(
      "GET PARTNER SUBMISSION:",
      id
    );

    // =================================================
    // FIND SUBMISSION
    // =================================================

    const submission =
      await PartnerSubmission.findByPk(
        id
      );

    if (!submission) {
      return res.status(404).json({
        success: false,

        message:
          "Partner submission not found.",
      });
    }

    // =================================================
    // FIND PARTNER
    // =================================================

    const partner =
      await Partner.findByPk(
        submission.partnerId
      );

    // =================================================
    // SUCCESS
    // =================================================

    return res.status(200).json({
      success: true,

      data: {
        submission,

        partner:
          partner
            ? {
                id:
                  partner.id,

                name:
                  partner.name,

                slug:
                  partner.slug,

                logoUrl:
                  partner.logoUrl,
              }
            : null,
      },
    });
  } catch (error) {
    console.error(
      "GET PARTNER SUBMISSION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to fetch partner submission.",
    });
  }
}

// =====================================================
// DELETE PARTNER SUBMISSION
//
// DELETE:
// /api/v1/partner-submissions/:id
// =====================================================

export async function deletePartnerSubmission(
  req,
  res
) {
  try {
    const {
      id,
    } = req.params;

    console.log(
      "DELETE PARTNER SUBMISSION:",
      id
    );

    // =================================================
    // FIND SUBMISSION
    // =================================================

    const submission =
      await PartnerSubmission.findByPk(
        id
      );

    if (!submission) {
      return res.status(404).json({
        success: false,

        message:
          "Partner submission not found.",
      });
    }

    // =================================================
    // DELETE
    // =================================================

    await submission.destroy();

    console.log(
      "PARTNER SUBMISSION DELETED:",
      id
    );

    // =================================================
    // SUCCESS
    // =================================================

    return res.status(200).json({
      success: true,

      message:
        "Partner submission deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE PARTNER SUBMISSION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to delete partner submission.",
    });
  }
}