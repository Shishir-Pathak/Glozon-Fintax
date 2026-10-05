import onboarding from "../model/onBoardingModel.js";

// =====================================================
// ADD ONBOARDING
// =====================================================

export async function addOnBoarding(req, res) {
  try {
    console.log("=================================");
    console.log("ADD ONBOARDING REQUEST");
    console.log("BODY:", req.body);
    console.log("=================================");

    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      country,

      // Personal information
      gender,
      maritalStatus,
      occupation,
      dob,

      // Common information
      visaType,
      investmentTrading,
      hasAbn,

      // Business information
      businessType,
      panId,
      corporateId,

      // Signature
      signatureName,
      signatureDate,
      signatureUrl,

      // PDF
      pdfUrl,
    } = req.body;

    // =====================================================
    // NORMALIZE VALUES
    // =====================================================

    const normalizedFirstName =
      typeof firstName === "string"
        ? firstName.trim()
        : "";

    const normalizedLastName =
      typeof lastName === "string"
        ? lastName.trim()
        : "";

    const normalizedEmail =
      typeof email === "string"
        ? email.trim()
        : "";

    const normalizedPhoneNumber =
      typeof phoneNumber === "string"
        ? phoneNumber.trim()
        : "";

    const normalizedAddress =
      typeof address === "string"
        ? address.trim()
        : "";

    const normalizedCountry =
      typeof country === "string" && country.trim()
        ? country.trim()
        : "Nepal";

    const normalizedOccupation =
      typeof occupation === "string"
        ? occupation.trim()
        : "";

    const normalizedPanId =
      typeof panId === "string"
        ? panId.trim()
        : "";

    const normalizedCorporateId =
      typeof corporateId === "string"
        ? corporateId.trim()
        : "";

    const normalizedSignatureName =
      typeof signatureName === "string"
        ? signatureName.trim()
        : "";

    const normalizedBusinessType =
      String(businessType || "individual")
        .trim()
        .toLowerCase();

    // -------------------------------------------------
    // VISA TYPE — OPTIONAL
    // Empty string / undefined / null → null
    // -------------------------------------------------

    const normalizedVisaType =
      typeof visaType === "string" && visaType.trim()
        ? visaType.trim()
        : null;

    const normalizedInvestmentTrading =
      typeof investmentTrading === "string"
        ? investmentTrading.trim()
        : "";

    const normalizedHasAbn =
      typeof hasAbn === "string"
        ? hasAbn.trim()
        : "";

    const normalizedMaritalStatus =
      typeof maritalStatus === "string"
        ? maritalStatus.trim()
        : "";

    const normalizedGender =
      typeof gender === "string"
        ? gender.trim()
        : "";

    // =====================================================
    // BUSINESS TYPE
    // =====================================================

    const isIndividual =
      normalizedBusinessType === "individual";

    const isCompany =
      normalizedBusinessType === "company";

    // =====================================================
    // BASIC VALIDATION
    // =====================================================

    if (!normalizedFirstName) {
      return res.status(400).json({
        success: false,
        message: "First name is required",
      });
    }

    if (!normalizedLastName) {
      return res.status(400).json({
        success: false,
        message: "Last name is required",
      });
    }

    if (!normalizedEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!normalizedPhoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    if (!normalizedAddress) {
      return res.status(400).json({
        success: false,
        message: "Address is required",
      });
    }

    if (!normalizedCountry) {
      return res.status(400).json({
        success: false,
        message: "Country is required",
      });
    }

    // =====================================================
    // BUSINESS TYPE VALIDATION
    // =====================================================

    if (!isIndividual && !isCompany) {
      return res.status(400).json({
        success: false,
        message:
          "Business type must be individual or company",
      });
    }

    // =====================================================
    // OCCUPATION VALIDATION
    // =====================================================

    if (!normalizedOccupation) {
      return res.status(400).json({
        success: false,
        message: "Occupation is required",
      });
    }

    // =====================================================
    // COMMON REQUIRED FIELDS
    // =====================================================

    if (!normalizedInvestmentTrading) {
      return res.status(400).json({
        success: false,
        message:
          "Investment/trading information is required",
      });
    }

    if (!normalizedHasAbn) {
      return res.status(400).json({
        success: false,
        message: "ABN information is required",
      });
    }

    // =====================================================
    // VALIDATE VISA TYPE (ONLY IF PROVIDED)
    // =====================================================

    const validVisaTypes = [
      "Student Visa",
      "Bridging Visa",
      "TR-Temporary VISA",
      "Australia Citizenship",
      "PR-Permanent VISA",
      "Other Type",
    ];

    if (
      normalizedVisaType !== null &&
      !validVisaTypes.includes(normalizedVisaType)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid visa type",
        validValues: validVisaTypes,
      });
    }

    // =====================================================
    // VALIDATE INVESTMENT/TRADING
    // =====================================================

    const validInvestmentTrading = [
      "Yes",
      "No",
    ];

    if (
      !validInvestmentTrading.includes(
        normalizedInvestmentTrading
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Investment/trading must be Yes or No",
      });
    }

    // =====================================================
    // VALIDATE ABN
    // =====================================================

    const validHasAbn = [
      "Yes",
      "No",
    ];

    if (
      !validHasAbn.includes(
        normalizedHasAbn
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "ABN information must be Yes or No",
      });
    }

    // =====================================================
    // INDIVIDUAL VALIDATION
    // =====================================================

    if (isIndividual) {
      // -------------------------------------------------
      // GENDER
      // -------------------------------------------------

      if (!normalizedGender) {
        return res.status(400).json({
          success: false,
          message:
            "Gender is required for individual",
        });
      }

      const validGenders = [
        "Male",
        "Female",
        "Other",
      ];

      if (!validGenders.includes(normalizedGender)) {
        return res.status(400).json({
          success: false,
          message: "Invalid gender",
        });
      }

      // -------------------------------------------------
      // MARITAL STATUS
      // -------------------------------------------------

      if (!normalizedMaritalStatus) {
        return res.status(400).json({
          success: false,
          message:
            "Marital status is required for individual",
        });
      }

      const validMaritalStatuses = [
        "Single",
        "Married",
        "Divorced",
      ];

      if (
        !validMaritalStatuses.includes(
          normalizedMaritalStatus
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid marital status",
        });
      }

      // -------------------------------------------------
      // DATE OF BIRTH
      // -------------------------------------------------

      if (!dob) {
        return res.status(400).json({
          success: false,
          message:
            "Date of birth is required for individual",
        });
      }
    }

    // =====================================================
    // COMPANY VALIDATION
    // =====================================================

    if (isCompany) {
      if (!normalizedCorporateId) {
        return res.status(400).json({
          success: false,
          message:
            "ABN / Corporate ID is required for company",
        });
      }
    }

    // =====================================================
    // PAN / TAX ID
    // =====================================================

    if (!normalizedPanId) {
      return res.status(400).json({
        success: false,
        message:
          "TFN / PAN / Tax ID is required",
      });
    }

    // =====================================================
    // SIGNATURE VALIDATION
    // =====================================================

    if (!normalizedSignatureName) {
      return res.status(400).json({
        success: false,
        message: "Signature name is required",
      });
    }

    if (!signatureDate) {
      return res.status(400).json({
        success: false,
        message: "Signature date is required",
      });
    }

    // =====================================================
    // DEBUG BEFORE DATABASE
    // =====================================================

    console.log(
      "================================="
    );

    console.log(
      "FINAL DATA GOING TO DATABASE:"
    );

    console.log({
      firstName: normalizedFirstName,
      lastName: normalizedLastName,
      email: normalizedEmail,
      phoneNumber: normalizedPhoneNumber,
      address: normalizedAddress,
      country: normalizedCountry,

      gender: isIndividual
        ? normalizedGender
        : null,

      maritalStatus: isIndividual
        ? normalizedMaritalStatus
        : null,

      occupation: normalizedOccupation,

      visaType: normalizedVisaType,

      investmentTrading:
        normalizedInvestmentTrading,

      hasAbn:
        normalizedHasAbn,

      businessType:
        normalizedBusinessType,

      panId:
        normalizedPanId,

      dob: isIndividual
        ? dob
        : null,

      corporateId: isCompany
        ? normalizedCorporateId
        : null,

      signatureName:
        normalizedSignatureName,

      signatureDate:
        signatureDate,

      signatureUrl:
        signatureUrl || null,

      pdfUrl:
        pdfUrl || null,

      checked: false,
    });

    console.log(
      "================================="
    );

    // =====================================================
    // CREATE ONBOARDING
    // =====================================================

    const newOnboarding =
      await onboarding.create({

        // =================================================
        // PERSONAL INFORMATION
        // =================================================

        firstName:
          normalizedFirstName,

        lastName:
          normalizedLastName,

        email:
          normalizedEmail,

        phoneNumber:
          normalizedPhoneNumber,

        address:
          normalizedAddress,

        country:
          normalizedCountry,

        // =================================================
        // INDIVIDUAL INFORMATION
        // =================================================

        gender:
          isIndividual
            ? normalizedGender
            : null,

        maritalStatus:
          isIndividual
            ? normalizedMaritalStatus
            : null,

        // IMPORTANT:
        // Occupation is NEVER null.
        occupation:
          normalizedOccupation,

        dob:
          isIndividual
            ? dob
            : null,

        // =================================================
        // COMMON INFORMATION
        // =================================================

        // Visa type is OPTIONAL → may be null
        visaType:
          normalizedVisaType,

        investmentTrading:
          normalizedInvestmentTrading,

        hasAbn:
          normalizedHasAbn,

        // =================================================
        // BUSINESS INFORMATION
        // =================================================

        businessType:
          normalizedBusinessType,

        panId:
          normalizedPanId,

        corporateId:
          isCompany
            ? normalizedCorporateId
            : null,

        // =================================================
        // SIGNATURE
        // =================================================

        signatureName:
          normalizedSignatureName,

        signatureDate:
          signatureDate,

        signatureUrl:
          signatureUrl || null,

        // =================================================
        // PDF
        // =================================================

        pdfUrl:
          pdfUrl || null,

        // =================================================
        // ADMIN STATUS
        // =================================================

        checked: false,
      });

    // =====================================================
    // SUCCESS LOG
    // =====================================================

    console.log(
      "================================="
    );

    console.log(
      "ONBOARDING CREATED SUCCESSFULLY"
    );

    console.log(
      "CREATED DATA:",
      newOnboarding.toJSON()
    );

    console.log(
      "================================="
    );

    // =====================================================
    // SUCCESS RESPONSE
    // =====================================================

    return res.status(201).json({
      success: true,

      message:
        "Onboarding added successfully",

      onboardingId:
        newOnboarding.id,

      data:
        newOnboarding,
    });

  } catch (error) {

    // =====================================================
    // DATABASE ERROR
    // =====================================================

    console.error(
      "================================="
    );

    console.error(
      "ADD ONBOARDING DATABASE ERROR"
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
      "PARENT:",
      error.parent
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

    // =====================================================
    // SEQUELIZE VALIDATION ERROR
    // =====================================================

    if (
      error.name ===
      "SequelizeValidationError"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Validation failed",

        errors:
          error.errors?.map(
            (item) => ({
              field:
                item.path,

              message:
                item.message,

              value:
                item.value,
            })
          ) || [],
      });
    }

    // =====================================================
    // OTHER ERROR
    // =====================================================

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to create onboarding",
    });
  }
}


// =====================================================
// GET ALL ONBOARDINGS
// =====================================================

export async function getAllOnBoardings(
  req,
  res
) {
  try {
    console.log(
      "GET ALL ONBOARDINGS"
    );

    // =================================================
    // ADMIN CHECK
    // =================================================

    if (
      !req.user ||
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // =================================================
    // GET DATA
    // =================================================

    const onboardings =
      await onboarding.findAll({
        order: [
          [
            "createdAt",
            "DESC",
          ],
        ],
      });

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,

      count:
        onboardings.length,

      data:
        onboardings,
    });

  } catch (error) {

    console.error(
      "GET ONBOARDINGS ERROR:"
    );

    console.error(error);

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to fetch onboardings",
    });
  }
}


// =====================================================
// DELETE ONBOARDING
// =====================================================

export async function deleteOnBoarding(
  req,
  res
) {
  try {
    const { id } =
      req.params;

    console.log(
      "DELETE ONBOARDING ID:",
      id
    );

    // =================================================
    // DELETE
    // =================================================

    const deleted =
      await onboarding.destroy({
        where: {
          id,
        },
      });

    // =================================================
    // NOT FOUND
    // =================================================

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message:
          "Onboarding not found",
      });
    }

    // =================================================
    // SUCCESS
    // =================================================

    return res.status(200).json({
      success: true,

      message:
        "Onboarding deleted successfully",
    });

  } catch (error) {

    console.error(
      "DELETE ONBOARDING ERROR:"
    );

    console.error(error);

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to delete onboarding",
    });
  }
}


// =====================================================
// UPLOAD SIGNATURE
// =====================================================

export async function uploadSignature(
  req,
  res
) {
  try {
    console.log(
      "================================="
    );

    console.log(
      "SIGNATURE UPLOAD CONTROLLER"
    );

    console.log(
      "REQ.FILE:",
      req.file
    );

    console.log(
      "REQ.BODY:",
      req.body
    );

    console.log(
      "================================="
    );

    // =================================================
    // CHECK FILE
    // =================================================

    if (!req.file) {
      return res.status(400).json({
        success: false,

        message:
          "No signature file received",
      });
    }

    // =================================================
    // FILE INFORMATION
    // =================================================

    console.log(
      "FIELD NAME:",
      req.file.fieldname
    );

    console.log(
      "ORIGINAL NAME:",
      req.file.originalname
    );

    console.log(
      "MIME TYPE:",
      req.file.mimetype
    );

    console.log(
      "PATH:",
      req.file.path
    );

    console.log(
      "SECURE URL:",
      req.file.secure_url
    );

    console.log(
      "URL:",
      req.file.url
    );

    console.log(
      "FILENAME:",
      req.file.filename
    );

    // =================================================
    // GET CLOUDINARY URL
    // =================================================

    const fileUrl =
      req.file.path ||
      req.file.secure_url ||
      req.file.url;

    // =================================================
    // CHECK URL
    // =================================================

    if (!fileUrl) {
      console.error(
        "Cloudinary did not return a URL."
      );

      console.error(
        "FULL FILE OBJECT:",
        JSON.stringify(
          req.file,
          null,
          2
        )
      );

      return res.status(500).json({
        success: false,

        message:
          "Signature uploaded but Cloudinary URL was not generated",
      });
    }

    // =================================================
    // SUCCESS
    // =================================================

    console.log(
      "SIGNATURE UPLOAD SUCCESS"
    );

    console.log(
      "SIGNATURE URL:",
      fileUrl
    );

    return res.status(200).json({
      success: true,

      message:
        "Signature uploaded successfully",

      url:
        fileUrl,

      data: {
        url:
          fileUrl,

        public_id:
          req.file.filename ||
          null,
      },
    });

  } catch (error) {

    console.error(
      "================================="
    );

    console.error(
      "UPLOAD SIGNATURE ERROR"
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
        "Signature upload failed",
    });
  }
}


// =====================================================
// UPLOAD PDF
// =====================================================

export async function uploadPdf(
  req,
  res
) {
  try {
    console.log(
      "================================="
    );

    console.log(
      "PDF UPLOAD CONTROLLER"
    );

    console.log(
      "REQ.FILE:",
      req.file
    );

    console.log(
      "REQ.BODY:",
      req.body
    );

    console.log(
      "================================="
    );

    // =================================================
    // CHECK FILE
    // =================================================

    if (!req.file) {
      return res.status(400).json({
        success: false,

        message:
          "No PDF file received",
      });
    }

    // =================================================
    // GET CLOUDINARY URL
    // =================================================

    const fileUrl =
      req.file.path ||
      req.file.secure_url ||
      req.file.url;

    // =================================================
    // CHECK URL
    // =================================================

    if (!fileUrl) {
      console.error(
        "Cloudinary PDF URL missing"
      );

      console.error(
        "FULL PDF FILE:",
        JSON.stringify(
          req.file,
          null,
          2
        )
      );

      return res.status(500).json({
        success: false,

        message:
          "PDF uploaded but Cloudinary URL was not generated",
      });
    }

    // =================================================
    // SUCCESS
    // =================================================

    console.log(
      "PDF UPLOAD SUCCESS"
    );

    console.log(
      "PDF URL:",
      fileUrl
    );

    return res.status(200).json({
      success: true,

      message:
        "PDF uploaded successfully",

      url:
        fileUrl,

      data: {
        url:
          fileUrl,

        public_id:
          req.file.filename ||
          null,
      },
    });

  } catch (error) {

    console.error(
      "================================="
    );

    console.error(
      "UPLOAD PDF ERROR"
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
        "PDF upload failed",
    });
  }
}


// =====================================================
// MARK ONBOARDING AS CHECKED
// =====================================================

export async function checked(
  req,
  res
) {
  try {
    const { id } =
      req.params;

    console.log(
      "MARK CHECKED ID:",
      id
    );

    // =================================================
    // UPDATE
    // =================================================

    const [updated] =
      await onboarding.update(
        {
          checked: true,
        },
        {
          where: {
            id,
          },
        }
      );

    // =================================================
    // NOT FOUND
    // =================================================

    if (!updated) {
      return res.status(404).json({
        success: false,

        message:
          "Onboarding not found",
      });
    }

    // =================================================
    // SUCCESS
    // =================================================

    return res.status(200).json({
      success: true,

      message:
        "Onboarding marked as checked",
    });

  } catch (error) {

    console.error(
      "CHECKED ERROR:"
    );

    console.error(error);

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to update onboarding",
    });
  }
}