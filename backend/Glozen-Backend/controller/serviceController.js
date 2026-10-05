import Service from "../model/serviceModel.js";

// =====================================================
// HELPER: GENERATE SLUG
// =====================================================

const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

// =====================================================
// DEFAULT SERVICES
// =====================================================

const DEFAULT_SERVICES = [
  {
    title: "Managed Accounting & Financial Reporting",
    slug: "managed-accounting-financial-reporting",
    image:
      "/assets/Managed-Accounting-Financial-Reporting-Vector-image1-scaled.jpg",
    description:
      "We provide detailed and scalable accounting solutions, ensuring your books are always accurate and compliant with international standards.",
    path: "/services/accounting-financial-reporting",
    category: "Accounting",
  },

  {
    title: "Taxation & Regulatory Advisory",
    slug: "taxation-regulatory-advisory",
    image: "/assets/Taxation-Regulatory-Advisory.jpg",
    description:
      "Our expert team navigates the complexities of tax regulations, providing proactive strategies to minimize your liabilities while ensuring compliance.",
    path: "/services/taxation-regulatory-advisory",
    category: "Taxation",
  },

  {
    title: "Audit Support & Assurance",
    slug: "audit-support-assurance",
    image: "/assets/Audit-Support-Assurance.jpg",
    description:
      "We offer seamless audit support, bridging the gap between your records and auditor expectations to ensure a smooth assurance process.",
    path: "/services/audit-support-assurance",
    category: "Audit",
  },

  {
    title: "Corporate Secretarial & Entity Formation",
    slug: "corporate-secretarial-entity-formation",
    image: "/assets/Corporate-Secretarial-Entity-Formation.jpeg",
    description:
      "Let us handle the administrative and legal requirements of your business formation, allowing you to focus on your growth objectives.",
    path: "/services/corporate-secretarial",
    category: "Corporate",
  },

  {
    title: "Payroll Processing & Administration",
    slug: "payroll-processing-administration",
    image: "/assets/Global-Payroll-Administration.jpg",
    description:
      "Our payroll services ensure that your workforce is compensated accurately and on time, maintaining compliance with local regulations.",
    path: "/services/payroll-processing",
    category: "Payroll",
  },

  {
    title: "Strategic Advisory & Corporate Finance",
    slug: "strategic-advisory-corporate-finance",
    image: "/assets/Strategic-Advisory-Corporate-Finance.jpg",
    description:
      "Unlock capital and drive expansion through our sophisticated financial modeling and strategic insights tailored for your business.",
    path: "/services/strategic-advisory",
    category: "Advisory",
  },
];

// =====================================================
// GET ALL SERVICES
// =====================================================

export async function getServices(req, res) {
  try {
    let services = await Service.findAll({
      order: [["id", "ASC"]],
    });

    // Auto-seed default services if table is empty
    if (services.length === 0) {
      await Service.bulkCreate(DEFAULT_SERVICES);

      services = await Service.findAll({
        order: [["id", "ASC"]],
      });
    }

    res.status(200).json(services);
  } catch (error) {
    console.error("Error in getServices:", error);

    res.status(500).json({
      message: "Failed to fetch services",
      error: error.message,
    });
  }
}

// =====================================================
// ADD SERVICE
// =====================================================

export async function addService(req, res) {
  try {
    const {
      title,
      description,
      image,
      path,
      category,
    } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    // Automatically generate slug from title
    const slug = generateSlug(title);

    // Check whether slug already exists
    const existingService = await Service.findOne({
      where: { slug },
    });

    if (existingService) {
      return res.status(409).json({
        message: "A service with this title already exists",
      });
    }

    // Create service
    const newService = await Service.create({
      title,
      slug,
      description,
      image: image || "/Logo.png",
      path: path || "#",
      category: category || "General",
    });

    res.status(201).json({
      message: "Service created successfully",
      service: newService,
    });
  } catch (error) {
    console.error("Error in addService:", error);

    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

// =====================================================
// UPDATE SERVICE
// =====================================================

export async function updateService(req, res) {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      image,
      path,
      category,
    } = req.body;

    // Find service
    const service = await Service.findByPk(id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    // Generate new slug if title is changed
    let slug = service.slug;

    if (title && title !== service.title) {
      slug = generateSlug(title);

      // Check duplicate slug
      const existingService = await Service.findOne({
        where: {
          slug,
        },
      });

      if (existingService && existingService.id !== service.id) {
        return res.status(409).json({
          message: "Another service with this title already exists",
        });
      }
    }

    // Update service
    await Service.update(
      {
        title,
        slug,
        description,
        image,
        path,
        category,
      },
      {
        where: { id },
      }
    );

    // Get updated service
    const updatedService = await Service.findByPk(id);

    res.status(200).json({
      message: "Service updated successfully",
      service: updatedService,
    });
  } catch (error) {
    console.error("Error in updateService:", error);

    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

// =====================================================
// DELETE SERVICE
// =====================================================

export async function deleteService(req, res) {
  try {
    const { id } = req.params;

    // Find service first
    const service = await Service.findByPk(id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    // Delete service
    await Service.destroy({
      where: { id },
    });

    res.status(200).json({
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteService:", error);

    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}