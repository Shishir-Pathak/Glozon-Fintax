// =====================================================
// USER MODEL
// =====================================================

import User from "./userModel.js";

// =====================================================
// OTHER MODELS
// =====================================================

import "./careerModel.js";
import "./contactModel.js";
import "./contentModel.js";
import "./onBoardingModel.js";
import "./partnerModel.js";
import "./PartnerSubmission.js";
import "./serviceModel.js";
import "./settingsModel.js";
import "./teamModel.js";
import "./testimonialModel.js";

// =====================================================
// ASSOCIATIONS
// =====================================================

import "./partnerAssociations.js";

// =====================================================
// TEST
// =====================================================

console.log("USER MODEL LOADED:", !!User);