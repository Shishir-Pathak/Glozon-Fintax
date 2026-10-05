import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

// ============================================
// CLOUDINARY STORAGE
// ============================================

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => {
    console.log("CLOUDINARY PARAMS:", {
      fieldname: file.fieldname,
      mimetype: file.mimetype,
      originalname: file.originalname,
    });

    // ==========================================
    // SETTINGS / GENERAL ASSET
    // ==========================================

    if (file.fieldname === "file") {
      return {
        folder: "glozonfintax/assets",
        resource_type: "image",
        public_id: Date.now() + "-asset",
      };
    }

    // ==========================================
    // PARTNER LOGO
    // ==========================================

    if (file.fieldname === "logo") {
      return {
        folder: "glozonfintax/partners",
        resource_type: "image",
        public_id: Date.now() + "-partner-logo",
      };
    }

    // ==========================================
    // SIGNATURE
    // ==========================================

    if (file.fieldname === "signatureImg") {
      return {
        folder: "glozonfintax/signatures",
        resource_type: "image",
        public_id: Date.now() + "-signature",
        format: "png",
      };
    }

    // ==========================================
    // PDF
    // ==========================================

    if (file.fieldname === "pdf") {
      return {
        folder: "glozonfintax/pdfs",
        resource_type: "raw",
        public_id: Date.now() + "-document",
        format: "pdf",
      };
    }

    // ==========================================
    // CAREER CV
    // ==========================================

    if (file.fieldname === "cv") {
      return {
        folder: "glozonfintax/cvs",
        resource_type: "raw",
        public_id:
          Date.now() +
          "-cv-" +
          file.originalname
            .replace(/\.[^/.]+$/, "")
            .replace(/[^a-zA-Z0-9-_]/g, "-"),
      };
    }

    // ==========================================
    // INVALID FIELD
    // ==========================================

    throw new Error(
      `Invalid upload field: ${file.fieldname}`
    );
  },
});

// ============================================
// FILE FILTER
// ============================================

const fileFilter = (req, file, cb) => {
  console.log("FILE FILTER:", {
    fieldname: file.fieldname,
    mimetype: file.mimetype,
    originalname: file.originalname,
  });

  // ==========================================
  // GENERAL ASSET
  // ==========================================

  if (file.fieldname === "file") {
    const allowedImages = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];

    if (allowedImages.includes(file.mimetype)) {
      return cb(null, true);
    }

    return cb(
      new Error(
        "Only PNG, JPG, JPEG and WEBP images are allowed"
      )
    );
  }

  // ==========================================
  // PARTNER LOGO
  // ==========================================

  if (file.fieldname === "logo") {
    const allowedImages = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];

    if (allowedImages.includes(file.mimetype)) {
      return cb(null, true);
    }

    return cb(
      new Error(
        "Only PNG, JPG, JPEG and WEBP images are allowed for partner logo"
      )
    );
  }

  // ==========================================
  // SIGNATURE
  // ==========================================

  if (file.fieldname === "signatureImg") {
    const allowedImages = [
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];

    if (allowedImages.includes(file.mimetype)) {
      return cb(null, true);
    }

    return cb(
      new Error(
        "Only PNG, JPG and JPEG images are allowed for signature"
      )
    );
  }

  // ==========================================
  // PDF
  // ==========================================

  if (file.fieldname === "pdf") {
    if (file.mimetype === "application/pdf") {
      return cb(null, true);
    }

    return cb(
      new Error("Only PDF files are allowed")
    );
  }

  // ==========================================
  // CAREER CV
  // ==========================================

  if (file.fieldname === "cv") {
    const allowedCVTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedCVTypes.includes(file.mimetype)) {
      return cb(null, true);
    }

    return cb(
      new Error(
        "Only PDF, DOC and DOCX files are allowed for CV"
      )
    );
  }

  // ==========================================
  // UNEXPECTED FIELD
  // ==========================================

  return cb(
    new Error(
      `Unexpected field: ${file.fieldname}`
    )
  );
};

// ============================================
// MULTER
// ============================================

const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

// ============================================
// GET FILE URL
// ============================================

export function getFileUrl(file) {
  if (!file) {
    return null;
  }

  // CloudinaryStorage URL
  if (file.path) {
    return file.path;
  }

  // Cloudinary secure URL
  if (file.secure_url) {
    return file.secure_url;
  }

  // Other URL fallback
  if (file.url) {
    return file.url;
  }

  return null;
}

// ============================================
// EXPORT
// ============================================

export default upload;