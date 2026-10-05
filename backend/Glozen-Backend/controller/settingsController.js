import Settings from "../model/settingsModel.js";

// ==========================================
// DEFAULT SETTINGS
// ==========================================

const DEFAULT_SETTINGS = {
  companyName: "Glozon FinTax",

  tagline: "Finance, Tax & Advisory Solutions",

  logo: "/Logo.png",

  primaryEmail: "info@glozonfintax.com",

  secondaryEmail: "support@glozonfintax.com",

  primaryPhone: "+977 9845971220",

  secondaryPhone: "+977 9811111111",

  whatsapp: "+977 9845971220",

  address: "Gaushala, Kathmandu, Nepal",

  website: "https://glozonfintax.com",

  googleMapUrl:
    "https://www.google.com/maps?q=Gaushala+Kathmandu&output=embed",

  facebook: "https://facebook.com",

  linkedin: "https://linkedin.com",

  instagram: "https://instagram.com",

  twitter: "https://twitter.com",

  footerDescription:
    "Professional accounting, taxation, payroll, and advisory solutions for businesses across Nepal, Australia, India, and the UAE.",

  // ==========================================
  // CLIENT ONBOARDING DECLARATION
  // ==========================================

  declaration:
    "I declare that the information provided above is true and correct to the best of my knowledge and belief.\n\nI authorize Glozon FinTax & Advisory Pvt. Ltd. to act on my behalf in relation to my taxation and accounting affairs.",

  // ==========================================
  // BUSINESS HOURS
  // ==========================================

  businessHours: [
    {
      day: "Sunday",
      isOpen: true,
      openTime: "10:00 AM",
      closeTime: "5:00 PM",
    },

    {
      day: "Monday",
      isOpen: true,
      openTime: "10:00 AM",
      closeTime: "5:00 PM",
    },

    {
      day: "Tuesday",
      isOpen: true,
      openTime: "10:00 AM",
      closeTime: "5:00 PM",
    },

    {
      day: "Wednesday",
      isOpen: true,
      openTime: "10:00 AM",
      closeTime: "5:00 PM",
    },

    {
      day: "Thursday",
      isOpen: true,
      openTime: "10:00 AM",
      closeTime: "5:00 PM",
    },

    {
      day: "Friday",
      isOpen: false,
    },

    {
      day: "Saturday",
      isOpen: false,
    },
  ],
};

// ==========================================
// GET SETTINGS
// ==========================================

export async function getSettings(req, res) {
  try {
    let settings = await Settings.findOne();

    // If settings don't exist, create default settings
    if (!settings) {
      settings = await Settings.create(DEFAULT_SETTINGS);
    }

    res.status(200).json(settings);
  } catch (error) {
    console.error("Error in getSettings:", error);

    // Return default settings if database fails
    res.status(200).json(DEFAULT_SETTINGS);
  }
}

// ==========================================
// UPDATE SETTINGS
// ==========================================

export async function updateSettings(req, res) {
  try {
    let settings = await Settings.findOne();

    const payload = req.body;

    // ==========================================
    // CREATE SETTINGS IF NOT EXISTS
    // ==========================================

    if (!settings) {
      settings = await Settings.create({
        ...DEFAULT_SETTINGS,
        ...payload,
      });
    }

    // ==========================================
    // UPDATE EXISTING SETTINGS
    // ==========================================

    else {
      await settings.update(payload);
    }

    // Reload from database so response contains
    // the latest saved values
    await settings.reload();

    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(200).json(settings);
  } catch (error) {
    console.error("Error in updateSettings:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
}