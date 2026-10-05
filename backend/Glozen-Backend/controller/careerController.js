import Career from "../model/careerModel.js";
import { sendEmail } from "../utils/sendEmail.js";

// =====================================================
// SUBMIT CAREER FORM
// =====================================================

export async function submitCareerForm(req, res) {
  try {
    console.log("========================================");
    console.log("CAREER FORM SUBMISSION");
    console.log("========================================");

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const {
      fullName,
      email,
      phoneNumber,
      country,
      position,
      experience,
      linkedInUrl,
      coverLetter,
    } = req.body || {};

    // CHECK REQUIRED FIELDS
    if (
      !fullName ||
      !email ||
      !phoneNumber ||
      !country ||
      !position ||
      !experience ||
      !coverLetter
    ) {
      return res.status(400).json({
        message: "All required fields must be filled.",
      });
    }

    // CHECK CV
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload your CV.",
      });
    }

    // GET CLOUDINARY CV URL
    const resumeUrl =
      req.file.path ||
      req.file.secure_url ||
      req.file.url ||
      null;

    if (!resumeUrl) {
      return res.status(500).json({
        message: "CV uploaded but URL could not be obtained.",
      });
    }

    console.log("CV URL:", resumeUrl);

    // CREATE CAREER APPLICATION
    const newCareerForm = await Career.create({
      fullName,
      email,
      phoneNumber,
      country,
      position,
      experience,
      linkedInUrl: linkedInUrl || null,
      coverLetter: coverLetter || null,
      resumeUrl,
      approveStatus: "pending",
    });

    console.log("CAREER APPLICATION SAVED TO DATABASE:", newCareerForm.id);

    // SEND EMAIL NOTIFICATION
    try {
      await sendEmail({
        to: process.env.CAREER_NOTIFICATION_EMAIL,
        subject: `New Career Application - ${position}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #036B09;">New Career Application</h2>
            <p>A new career application has been submitted through the Glozon FinTax website.</p>
            <hr />
            
            <h3>Applicant Details</h3>
            <p><strong>Full Name:</strong> ${fullName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone Number:</strong> ${phoneNumber}</p>
            <p><strong>Country:</strong> ${country}</p>
            <p><strong>Position:</strong> ${position}</p>
            <p><strong>Experience:</strong> ${experience}</p>
            
            ${
              linkedInUrl
                ? `<p><strong>LinkedIn:</strong> <a href="${linkedInUrl}" target="_blank">${linkedInUrl}</a></p>`
                : ""
            }
            
            <h3>Cover Letter</h3>
            <p>${coverLetter}</p>
            
            <hr />
            
            <h3>CV / Resume</h3>
            <p>
              <a href="${resumeUrl}" target="_blank" style="display: inline-block; padding: 10px 18px; background-color: #036B09; color: white; text-decoration: none; border-radius: 5px;">
                View / Download CV
              </a>
            </p>
            
            <hr />
            <p style="font-size: 13px; color: #777;">
              This is an automated notification from the Glozon FinTax career application system.
            </p>
          </div>
        `,
      });
      console.log("CAREER EMAIL NOTIFICATION SENT SUCCESSFULLY");
    } catch (emailError) {
      console.error("========================================");
      console.error("CAREER EMAIL FAILED TO SEND (But data is saved)");
      console.error("========================================");
      console.error(emailError);
    }

    // SUCCESS RESPONSE
    return res.status(201).json({
      message: "Career form submitted successfully",
      careerFormId: newCareerForm.id,
      resumeUrl: newCareerForm.resumeUrl,
    });

  } catch (error) {
    console.error("========================================");
    console.error("CAREER FORM SUBMISSION ERROR");
    console.error("========================================");
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

// =====================================================
// GET ALL CAREERS
// =====================================================

export async function getCareers(req, res) {
  try {
    const careers = await Career.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(careers);
  } catch (error) {
    console.error("GET CAREERS ERROR:", error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

// =====================================================
// DELETE CAREER
// =====================================================

export async function deleteCareer(req, res) {
  try {
    const { id } = req.params;

    const deletedCareer = await Career.destroy({
      where: {
        id,
      },
    });

    if (!deletedCareer) {
      return res.status(404).json({
        message: "Career application not found",
      });
    }

    return res.status(200).json({
      message: "Career deleted successfully",
    });
  } catch (error) {
    console.error("DELETE CAREER ERROR:", error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

// =====================================================
// UPDATE CAREER STATUS
// =====================================================

export async function updateCareer(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body || {};

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    const allowedStatuses = [
      "pending",
      "shortlisted",
      "approved",
      "rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const [updatedRows] = await Career.update(
      {
        approveStatus: status,
      },
      {
        where: {
          id,
        },
      }
    );

    if (updatedRows === 0) {
      return res.status(404).json({
        message: "Career application not found",
      });
    }

    return res.status(200).json({
      message: "Career status changed successfully",
    });
  } catch (error) {
    console.error("UPDATE CAREER ERROR:", error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}