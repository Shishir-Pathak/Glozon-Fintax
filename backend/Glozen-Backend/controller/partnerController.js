import PDFDocument from "pdfkit";
import  cloudinary  from "../utils/cloudinary.js";
import Partner from "../model/partnerModel.js";

// =====================================================
// HELPER: GET CLOUDINARY URL
// =====================================================

function getCloudinaryUrl(file) {
  if (!file) {
    return null;
  }

  return (
    file.secure_url ||
    file.path ||
    file.url ||
    null
  );
}

// =====================================================
// HELPER: GENERATE PARTNER PDF
// =====================================================

function generatePartnerPDF(partner) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
      });

      const chunks = [];

      // Collect PDF chunks
      doc.on("data", (chunk) => {
        chunks.push(chunk);
      });

      // PDF finished
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(chunks);

        resolve(pdfBuffer);
      });

      // PDF error
      doc.on("error", (error) => {
        reject(error);
      });

      // =================================================
      // HEADER
      // =================================================

      doc
        .fontSize(24)
        .font("Helvetica-Bold")
        .fillColor("#000000")
        .text("Glozon FinTax", {
          align: "center",
        });

      doc.moveDown(0.5);

      doc
        .fontSize(18)
        .font("Helvetica-Bold")
        .text("Partner Registration", {
          align: "center",
        });

      doc.moveDown(1);

      // =================================================
      // LINE
      // =================================================

      doc
        .moveTo(50, doc.y)
        .lineTo(545, doc.y)
        .stroke();

      doc.moveDown(1.5);

      // =================================================
      // COMPANY INFORMATION
      // =================================================

      doc
        .fontSize(15)
        .font("Helvetica-Bold")
        .fillColor("#000000")
        .text("Company Information");

      doc.moveDown(0.7);

      doc
        .fontSize(11)
        .font("Helvetica")
        .text(
          `Company Name: ${
            partner.name || "-"
          }`
        );

      doc.moveDown(0.3);

      doc.text(
        `Registration Number: ${
          partner.registrationNumber || "-"
        }`
      );

      doc.moveDown(0.3);

      doc.text(
        `Email: ${
          partner.email || "-"
        }`
      );

      doc.moveDown(0.3);

      doc.text(
        `Phone: ${
          partner.phone || "-"
        }`
      );

      doc.moveDown(1.5);

      // =================================================
      // CONTACT PERSON
      // =================================================

      doc
        .fontSize(15)
        .font("Helvetica-Bold")
        .text("Contact Person");

      doc.moveDown(0.7);

      doc
        .fontSize(11)
        .font("Helvetica")
        .text(
          `Full Name: ${
            partner.contactName || "-"
          }`
        );

      doc.moveDown(0.3);

      doc.text(
        `Position: ${
          partner.position || "-"
        }`
      );

      doc.moveDown(1.5);

      // =================================================
      // COMPANY ADDRESS
      // =================================================

      doc
        .fontSize(15)
        .font("Helvetica-Bold")
        .text("Company Address");

      doc.moveDown(0.7);

      doc
        .fontSize(11)
        .font("Helvetica")
        .text(
          partner.address || "-"
        );

      doc.moveDown(2);

      // =================================================
      // PARTNER INFORMATION
      // =================================================

      doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor("#555555")
        .text(
          `Partner ID: ${partner.id}`
        );

      doc.moveDown(0.3);

      doc.text(
        `Registration Link Slug: ${
          partner.slug
        }`
      );

      doc.moveDown(0.3);

      doc.text(
        `Generated On: ${
          new Date().toLocaleString()
        }`
      );

      // =================================================
      // FOOTER
      // =================================================

      doc.moveDown(3);

      doc
        .fontSize(9)
        .fillColor("#777777")
        .text(
          "This document was generated automatically by Glozon FinTax.",
          {
            align: "center",
          }
        );

      // =================================================
      // FINISH PDF
      // =================================================

      doc.end();

    } catch (error) {
      reject(error);
    }
  });
}

// =====================================================
// CREATE PARTNER
// ADMIN
// =====================================================

export async function createPartner(req, res) {
  try {
    console.log("=================================");
    console.log("CREATE PARTNER");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("=================================");

    const {
      name,
      registrationNumber,
      email,
      phone,
      contactName,
      position,
      address,
    } = req.body;

    // =================================================
    // VALIDATE COMPANY NAME
    // =================================================

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Partner name is required",
      });
    }

    // =================================================
    // VALIDATE LOGO
    // =================================================

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Partner logo is required",
      });
    }

    // =================================================
    // GET LOGO URL
    // =================================================

    const logoUrl = getCloudinaryUrl(req.file);

    if (!logoUrl) {
      return res.status(500).json({
        success: false,
        message:
          "Partner logo URL was not generated",
      });
    }

    // =================================================
    // CREATE SLUG
    // =================================================

    const slug =
      name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") +
      "-" +
      Date.now();

    // =================================================
    // CREATE PARTNER
    // =================================================

    const partner = await Partner.create({
      name: name.trim(),

      registrationNumber:
        registrationNumber?.trim() || null,

      email:
        email?.trim() || null,

      phone:
        phone?.trim() || null,

      contactName:
        contactName?.trim() || null,

      position:
        position?.trim() || null,

      address:
        address?.trim() || null,

      slug,

      logoUrl,

      pdfUrl: null,

      isActive: true,
    });

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(201).json({
      success: true,
      message:
        "Partner created successfully",
      data: partner,
    });

  } catch (error) {
    console.error(
      "CREATE PARTNER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to create partner",
    });
  }
}

// =====================================================
// PUBLIC PARTNER FORM SUBMISSION
// =====================================================

export async function submitPartnerForm(req, res) {
  try {
    console.log("=================================");
    console.log("PARTNER FORM SUBMISSION");
    console.log("=================================");

    const { slug } = req.params;

    const {
      companyName,
      registrationNumber,
      email,
      phone,
      contactName,
      position,
      address,
    } = req.body;

    console.log("BODY:", req.body);
    console.log("SLUG:", slug);
    console.log("FILE:", req.file);

    // =================================================
    // FIND EXISTING PARTNER
    // =================================================

    const partner = await Partner.findOne({
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
    // VALIDATE COMPANY NAME
    // =================================================

    if (
      !companyName ||
      !companyName.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Company name is required.",
      });
    }

    // =================================================
    // KEEP EXISTING LOGO
    // =================================================

    let logoUrl = partner.logoUrl;

    // =================================================
    // IF NEW LOGO WAS SENT
    // =================================================

    if (req.file) {
      const uploadedLogo =
        getCloudinaryUrl(req.file);

      if (!uploadedLogo) {
        return res.status(500).json({
          success: false,
          message:
            "Partner logo URL was not generated.",
        });
      }

      logoUrl = uploadedLogo;
    }

    // =================================================
    // UPDATE PARTNER INFORMATION
    // =================================================

    await partner.update({
      name: companyName.trim(),

      registrationNumber:
        registrationNumber?.trim() || null,

      email:
        email?.trim() || null,

      phone:
        phone?.trim() || null,

      contactName:
        contactName?.trim() || null,

      position:
        position?.trim() || null,

      address:
        address?.trim() || null,

      logoUrl,
    });

    // =================================================
    // RELOAD PARTNER
    // =================================================

    await partner.reload();

    console.log(
      "PARTNER UPDATED:"
    );

    console.log(
      partner.toJSON()
    );

    // =================================================
    // GENERATE PDF
    // =================================================

    console.log(
      "================================="
    );

    console.log(
      "GENERATING PARTNER PDF..."
    );

    const pdfBuffer =
      await generatePartnerPDF(
        partner
      );

    console.log(
      "PDF GENERATED"
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
        (resolve, reject) => {

          const uploadStream =
            cloudinary.uploader.upload_stream(
              {
                folder:
                  "glozonfintax/partners",

                resource_type:
                  "raw",

                public_id:
                  `${partner.slug}-partner-registration`,

                format: "pdf",
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

    await partner.update({
      pdfUrl,
    });

    // =================================================
    // RELOAD
    // =================================================

    await partner.reload();

    console.log(
      "PDF URL SAVED TO DATABASE"
    );

    console.log(
      "FINAL PARTNER:",
      partner.toJSON()
    );

    console.log(
      "================================="
    );

    // =================================================
    // SUCCESS
    // =================================================

    return res.status(200).json({
      success: true,

      message:
        "Partner registration submitted successfully.",

      data: partner,
    });

  } catch (error) {

    console.error(
      "================================="
    );

    console.error(
      "SUBMIT PARTNER FORM ERROR:"
    );

    console.error(error);

    console.error(
      "================================="
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to submit partner registration.",
    });
  }
}

// =====================================================
// GET ALL PARTNERS
// ADMIN
// =====================================================

export async function getAllPartners(req, res) {
  try {
    console.log(
      "GET ALL PARTNERS"
    );

    const partners =
      await Partner.findAll({
        order: [
          ["createdAt", "DESC"],
        ],
      });

    return res.status(200).json({
      success: true,

      count:
        partners.length,

      data:
        partners,
    });

  } catch (error) {

    console.error(
      "GET PARTNERS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to fetch partners",
    });
  }
}

// =====================================================
// GET PARTNER BY SLUG
// PUBLIC
// =====================================================

export async function getPartnerBySlug(req, res) {
  try {
    const { slug } = req.params;

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
          "Partner not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: partner,
    });

  } catch (error) {

    console.error(
      "GET PARTNER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to fetch partner",
    });
  }
}

// =====================================================
// UPDATE PARTNER
// ADMIN
// =====================================================

export async function updatePartner(req, res) {
  try {
    const { id } = req.params;

    const {
      name,
      registrationNumber,
      email,
      phone,
      contactName,
      position,
      address,
    } = req.body;

    // =================================================
    // FIND PARTNER
    // =================================================

    const partner =
      await Partner.findByPk(id);

    if (!partner) {
      return res.status(404).json({
        success: false,
        message:
          "Partner not found",
      });
    }

    // =================================================
    // UPDATE DATA
    // =================================================

    const updateData = {};

    if (
      name !== undefined &&
      name.trim()
    ) {
      updateData.name =
        name.trim();
    }

    if (
      registrationNumber !==
      undefined
    ) {
      updateData.registrationNumber =
        registrationNumber?.trim() ||
        null;
    }

    if (email !== undefined) {
      updateData.email =
        email?.trim() ||
        null;
    }

    if (phone !== undefined) {
      updateData.phone =
        phone?.trim() ||
        null;
    }

    if (
      contactName !==
      undefined
    ) {
      updateData.contactName =
        contactName?.trim() ||
        null;
    }

    if (
      position !==
      undefined
    ) {
      updateData.position =
        position?.trim() ||
        null;
    }

    if (
      address !==
      undefined
    ) {
      updateData.address =
        address?.trim() ||
        null;
    }

    // =================================================
    // UPDATE LOGO
    // =================================================

    if (req.file) {
      const logoUrl =
        getCloudinaryUrl(
          req.file
        );

      if (logoUrl) {
        updateData.logoUrl =
          logoUrl;
      }
    }

    // =================================================
    // SAVE
    // =================================================

    await partner.update(
      updateData
    );

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,

      message:
        "Partner updated successfully",

      data:
        partner,
    });

  } catch (error) {

    console.error(
      "UPDATE PARTNER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to update partner",
    });
  }
}

// =====================================================
// DELETE PARTNER
// ADMIN
// =====================================================

export async function deletePartner(req, res) {
  try {
    const { id } = req.params;

    console.log(
      "DELETE PARTNER ID:",
      id
    );

    const deleted =
      await Partner.destroy({
        where: {
          id,
        },
      });

    if (!deleted) {
      return res.status(404).json({
        success: false,

        message:
          "Partner not found",
      });
    }

    return res.status(200).json({
      success: true,

      message:
        "Partner deleted successfully",
    });

  } catch (error) {

    console.error(
      "DELETE PARTNER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to delete partner",
    });
  }
}