import express from "express";

// =====================================================
// AUTH
// =====================================================

import {
  Login,
  Register,
} from "../controller/authController.js";

// =====================================================
// CAREER
// =====================================================

import {
  submitCareerForm,
  getCareers,
  deleteCareer,
  updateCareer,
} from "../controller/careerController.js";

// =====================================================
// ONBOARDING
// =====================================================

import {
  addOnBoarding,
  getAllOnBoardings,
  deleteOnBoarding,
  uploadSignature,
  uploadPdf,
  checked,
} from "../controller/onBoardingController.js";

// =====================================================
// CONTACT
// =====================================================

import {
  submitContactForm,
  getContactForms,
  deleteContact,
} from "../controller/contactController.js";

// =====================================================
// TEAM
// =====================================================

import {
  addTeam,
  getAllTeams,
  deleteTeam,
  editTeam,
} from "../controller/teamController.js";

// =====================================================
// PARTNERS
// =====================================================

import {
  createPartner,
  getAllPartners,
  getPartnerBySlug,
  updatePartner,
  deletePartner,
} from "../controller/partnerController.js";

// =====================================================
// PARTNER SUBMISSIONS
// =====================================================

import {
  submitPartnerForm,
  getAllPartnerSubmissions,
  getSubmissionsByPartner,
  getPartnerSubmissionById,
  deletePartnerSubmission,
} from "../controller/PartnerSubmissionController.js";

// =====================================================
// SETTINGS
// =====================================================

import {
  getSettings,
  updateSettings,
} from "../controller/settingsController.js";

// =====================================================
// CONTENT
// =====================================================

import {
  getAllContent,
  getContentBySection,
  updateContentBySection,
  uploadAsset,
} from "../controller/contentController.js";

// =====================================================
// SERVICES
// =====================================================

import {
  getServices,
  addService,
  updateService,
  deleteService,
} from "../controller/serviceController.js";

// =====================================================
// TESTIMONIALS
// =====================================================

import {
  getTestimonials,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../controller/testimonialController.js";

// =====================================================
// MIDDLEWARE
// =====================================================

import authorize from "../middleware/authorizeMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

// =====================================================
// ROUTER
// =====================================================

const router = express.Router();

// =====================================================
// AUTH
// =====================================================

router.post(
  "/login",
  Login
);

router.post(
  "/register",
  Register
);

// =====================================================
// CAREERS
// =====================================================

// ADMIN: GET ALL CAREERS

router.get(
  "/careers",
  authorize,
  adminMiddleware,
  getCareers
);

// PUBLIC: SUBMIT CAREER

router.post(
  "/careers",
  upload.single("cv"),
  submitCareerForm
);

// ADMIN: DELETE CAREER

router.delete(
  "/careers/:id",
  authorize,
  adminMiddleware,
  deleteCareer
);

// ADMIN: UPDATE CAREER

router.put(
  "/careers/:id",
  authorize,
  adminMiddleware,
  updateCareer
);

// =====================================================
// ONBOARDING
// =====================================================

// ADMIN: GET ALL ONBOARDINGS

router.get(
  "/onboarding",
  authorize,
  adminMiddleware,
  getAllOnBoardings
);

// PUBLIC: CREATE ONBOARDING

router.post(
  "/onboarding",
  addOnBoarding
);

// ADMIN: DELETE ONBOARDING

router.delete(
  "/onboarding/:id",
  authorize,
  adminMiddleware,
  deleteOnBoarding
);

// PUBLIC: UPLOAD SIGNATURE

router.post(
  "/onboarding/upload",
  upload.single("signatureImg"),
  uploadSignature
);

// PUBLIC: UPLOAD PDF

router.post(
  "/onboarding/pdfUpload",
  upload.single("pdf"),
  uploadPdf
);

// ADMIN: MARK ONBOARDING AS CHECKED

router.put(
  "/onboarding/:id",
  authorize,
  adminMiddleware,
  checked
);

// =====================================================
// CONTACT
// =====================================================

// ADMIN: GET CONTACT FORMS

router.get(
  "/contact",
  authorize,
  adminMiddleware,
  getContactForms
);

// PUBLIC: SUBMIT CONTACT FORM

router.post(
  "/contact",
  submitContactForm
);

// ADMIN: DELETE CONTACT

router.delete(
  "/contact/:id",
  authorize,
  adminMiddleware,
  deleteContact
);

// =====================================================
// TEAM
// =====================================================

// ADMIN: GET ALL TEAM

router.get(
  "/team",
  authorize,
  adminMiddleware,
  getAllTeams
);

// ADMIN: ADD TEAM

router.post(
  "/team",
  authorize,
  adminMiddleware,
  addTeam
);

// ADMIN: DELETE TEAM

router.delete(
  "/team/:id",
  authorize,
  adminMiddleware,
  deleteTeam
);

// ADMIN: UPDATE TEAM

router.put(
  "/team/:id",
  authorize,
  adminMiddleware,
  editTeam
);

// =====================================================
// SERVICES
// =====================================================

// PUBLIC: GET ALL SERVICES (used by homepage)
// NOTE: No auth required — public data

router.get(
  "/services",
  getServices
);

// ADMIN: ADD SERVICE

router.post(
  "/services",
  authorize,
  adminMiddleware,
  addService
);

// ADMIN: UPDATE SERVICE

router.put(
  "/services/:id",
  authorize,
  adminMiddleware,
  updateService
);

// ADMIN: DELETE SERVICE

router.delete(
  "/services/:id",
  authorize,
  adminMiddleware,
  deleteService
);

// =====================================================
// TESTIMONIALS
// =====================================================

// PUBLIC: GET ALL TESTIMONIALS (used by homepage)
// NOTE: No auth required — public data

router.get(
  "/testimonials",
  getTestimonials
);

// ADMIN: ADD TESTIMONIAL

router.post(
  "/testimonials",
  authorize,
  adminMiddleware,
  addTestimonial
);

// ADMIN: UPDATE TESTIMONIAL

router.put(
  "/testimonials/:id",
  authorize,
  adminMiddleware,
  updateTestimonial
);

// ADMIN: DELETE TESTIMONIAL

router.delete(
  "/testimonials/:id",
  authorize,
  adminMiddleware,
  deleteTestimonial
);

// =====================================================
// PARTNERS
// =====================================================

// PUBLIC: GET PARTNER BY SLUG
//
// GET:
// /api/v1/partners/abc-company-123

router.get(
  "/partners/:slug",
  getPartnerBySlug
);

// PUBLIC: SUBMIT PARTNER FORM
//
// POST:
// /api/v1/partners/abc-company-123/submit

router.post(
  "/partners/:slug/submit",
  submitPartnerForm
);

// ADMIN: GET ALL PARTNERS

router.get(
  "/partners",
  authorize,
  adminMiddleware,
  getAllPartners
);

// ADMIN: CREATE PARTNER

router.post(
  "/partners",
  authorize,
  adminMiddleware,
  upload.single("logo"),
  createPartner
);

// ADMIN: UPDATE PARTNER

router.put(
  "/partners/:id",
  authorize,
  adminMiddleware,
  upload.single("logo"),
  updatePartner
);

// ADMIN: DELETE PARTNER

router.delete(
  "/partners/:id",
  authorize,
  adminMiddleware,
  deletePartner
);

// =====================================================
// PARTNER SUBMISSIONS
// =====================================================

// ADMIN: GET ALL PARTNER SUBMISSIONS
//
// GET:
// /api/v1/partner-submissions

router.get(
  "/partner-submissions",
  authorize,
  adminMiddleware,
  getAllPartnerSubmissions
);

// ADMIN: GET ALL SUBMISSIONS FOR ONE PARTNER
//
// GET:
// /api/v1/partners/1/submissions

router.get(
  "/partners/:partnerId/submissions",
  authorize,
  adminMiddleware,
  getSubmissionsByPartner
);

// ADMIN: GET ONE SUBMISSION
//
// GET:
// /api/v1/partner-submissions/15

router.get(
  "/partner-submissions/:id",
  authorize,
  adminMiddleware,
  getPartnerSubmissionById
);

// ADMIN: DELETE ONE SUBMISSION
//
// DELETE:
// /api/v1/partner-submissions/15

router.delete(
  "/partner-submissions/:id",
  authorize,
  adminMiddleware,
  deletePartnerSubmission
);

// =====================================================
// CONTENT
// =====================================================

// GET ALL CONTENT

router.get(
  "/content",
  getAllContent
);

// GET CONTENT BY SECTION

router.get(
  "/content/:sectionKey",
  getContentBySection
);

// UPDATE CONTENT SECTION

router.put(
  "/content/:sectionKey",
  authorize,
  adminMiddleware,
  updateContentBySection
);

// UPLOAD GENERAL ASSET

router.post(
  "/content/upload",
  authorize,
  adminMiddleware,
  upload.single("file"),
  uploadAsset
);

// =====================================================
// SETTINGS
// =====================================================

// PUBLIC: GET SETTINGS (used by homepage for contact info, hours, etc.)
// NOTE: No auth required — public data
// ⚠️ If your settings contain SECRETS (API keys), split into a separate
//    admin-only route for those secrets.

router.get(
  "/settings",
  getSettings
);

// ADMIN: UPDATE SETTINGS

router.put(
  "/settings",
  authorize,
  adminMiddleware,
  updateSettings
);

// =====================================================
// TEST
// =====================================================

router.get(
  "/test",
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "API routes are working",
    });
  }
);

// =====================================================
// EXPORT
// =====================================================

export default router;