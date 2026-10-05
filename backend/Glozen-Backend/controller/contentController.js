import Content from "../model/contentModel.js";
import { getFileUrl } from "../middleware/uploadMiddleware.js";

const DEFAULT_SECTIONS = {
  hero: {
    slides: [
      { src: "/tax2.jpg", alt: "Glozon FinTax advisory services" },
    ],
    headingPrefix: "Glozon",
    headingHighlight: "FinTax",
    headingSuffix: "Advisory",
    description:
      "Glozon FinTax & Advisory (GFA) is a premier financial and taxation consultancy firm headquartered in Lalitpur, Nepal. We specialize in providing comprehensive offshore and outsourced services tailored specifically for firms and clients in Australia, India, Dubai and Nepal.",
    primaryBtnText: "Get Started Today",
    primaryBtnLink: "/client-onboarding",
    secondaryBtnText: "Contact Us",
    secondaryBtnLink: "/contact-us",
  },
  about: {
    heading: "Discover Glozon FinTax & Advisory",
    logo: "/assets/logo.png",
    paragraph1:
      "Glozon FinTax & Advisory is a professional accounting, taxation, and financial advisory firm providing reliable and cost-effective solutions to businesses across Nepal, Australia, India, and the UAE. Our team of qualified accountants and advisors specializes in bookkeeping, tax compliance, payroll management, financial reporting, and business advisory services. We help businesses maintain compliance, improve financial visibility, and make informed decisions.",
    paragraph2:
      "With a strong focus on accuracy, confidentiality, and client satisfaction, we deliver tailored solutions to startups, SMEs, and established enterprises. Our mission is to be a trusted financial partner, supporting sustainable growth through expertise, integrity, and practical business insight.",
  },
  whyChooseUs: {
    title: "Why Choose Us",
    image: "/assets/Why-choose-us-150x150.png",
    reasons: [
      {
        title: "Elite Professional Talent",
        description:
          "Your accounts are managed by a highly skilled team of FCA, CA, ACCA, CPA, and MBA qualified professionals. Our experts possess deep knowledge of Australian tax laws (ITR, CTR, BAS, FBT) and ATO/ASIC compliance requirements.",
        color: "text-green-500",
        barColor: "bg-green-500",
        icon: "fi fi-rr-users-alt",
        delay: 0.1,
      },
      {
        title: "Advanced Cloud Expertise",
        description:
          "We are specialists in leading cloud accounting platforms, including Xero, QuickBooks Online, MYOB, Zoho Books, and BGL. We utilize AI-powered tools for faster, more accurate reconciliations.",
        color: "text-blue-500",
        barColor: "bg-blue-500",
        icon: "fi fi-rr-headset",
        delay: 0.2,
      },
      {
        title: "Security & Data Privacy",
        description:
          "We prioritize confidentiality with strict NDA provisions aligned with Australian Privacy Principles, secure VPNs, and encrypted file-sharing protocols.",
        color: "text-yellow-500",
        barColor: "bg-yellow-500",
        icon: "fi fi-rr-shield-check",
        delay: 0.3,
      },
      {
        title: "The Time-Zone Advantage",
        description:
          "Located in Nepal (GMT +5:45), we provide a unique 'work while you sleep' advantage. This allows for same-day turnaround on urgent tasks and ensures strict deadlines are met without delay.",
        color: "text-green-500",
        barColor: "bg-green-500",
        icon: "fi fi-rr-clock-three",
        delay: 0.4,
      },
      {
        title: "Significant Cost Efficiency",
        description:
          "Our outsourcing model allows you to reduce operational overheads by 50–60% compared to local hiring. You pay only for the work delivered through flexible hourly, per-client, or fixed-fee structures.",
        color: "text-blue-500",
        barColor: "bg-blue-500",
        icon: "fi fi-rr-piggy-bank",
        delay: 0.5,
      },
      {
        title: "Proven Compliance Record",
        description:
          "We maintain a 'zero or minimal compliance error' standard for all statutory lodgments. Our financials are audit-ready, providing clean records for smooth internal and external reviews.",
        color: "text-orange-500",
        barColor: "bg-orange-500",
        icon: "fi fi-rr-chart-line-up",
        delay: 0.6,
      },
    ],
  },
  mission: {
    title: "Our Mission Statement",
    subtitle:
      "Providing exceptional financial services designed for your growth and peace of mind.",
    bgImage: "/mission.jpg",
    buttonText: "Read The Rest Of Mission",
    buttonLink: "#",
    stats: [
      {
        target: 128,
        text: "Providing exceptional financial services designed for your growth and peace of mind.",
        delay: 0.1,
      },
      {
        target: 87,
        text: "Empowering businesses with strategic insights and compliance support.",
        delay: 0.2,
      },
      {
        target: 37,
        text: "Building long-term relationships based on trust and excellent service.",
        delay: 0.3,
      },
      {
        target: 55,
        text: "Fostering a culture of continuous improvement and innovation in financial practices.",
        delay: 0.4,
      },
    ],
  },
};

export async function getAllContent(req, res) {
  try {
    const contents = await Content.findAll();
    const result = { ...DEFAULT_SECTIONS };

    contents.forEach((item) => {
      let parsed = item.data;
      if (typeof parsed === "string") {
        try {
          parsed = JSON.parse(parsed);
        } catch {}
      }
      result[item.sectionKey] = parsed;
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getAllContent:", error);
    res.status(200).json(DEFAULT_SECTIONS);
  }
}

export async function getContentBySection(req, res) {
  try {
    const { sectionKey } = req.params;
    const content = await Content.findOne({ where: { sectionKey } });

    if (!content) {
      const defaultData = DEFAULT_SECTIONS[sectionKey] || {};
      return res.status(200).json(defaultData);
    }

    let parsed = content.data;
    if (typeof parsed === "string") {
      try {
        parsed = JSON.parse(parsed);
      } catch {}
    }

    res.status(200).json(parsed);
  } catch (error) {
    console.error("Error in getContentBySection:", error);
    const defaultData = DEFAULT_SECTIONS[req.params.sectionKey] || {};
    res.status(200).json(defaultData);
  }
}

export async function updateContentBySection(req, res) {
  try {
    const { sectionKey } = req.params;
    const payload = req.body;

    const existing = await Content.findOne({ where: { sectionKey } });
    if (existing) {
      await Content.update(
        { data: payload },
        { where: { sectionKey } }
      );
    } else {
      await Content.create({
        sectionKey,
        data: payload,
      });
    }

    res.status(200).json({
      message: `Section ${sectionKey} updated successfully`,
      data: payload,
    });
  } catch (error) {
    console.error("Error in updateContentBySection:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function uploadAsset(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No asset file provided" });
    }
    const fileUrl = getFileUrl(req.file);
    res.status(200).json({
      message: "Asset uploaded successfully",
      url: fileUrl,
    });
  } catch (error) {
    console.error("Error in uploadAsset:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
