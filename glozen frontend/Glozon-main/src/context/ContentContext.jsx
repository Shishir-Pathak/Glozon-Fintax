import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import API from "../API/Api";
import { getAssetUrl } from "../utils/assets";

const DEFAULT_CONTENT = {
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

const DEFAULT_SERVICES = [
  {
    id: 1,
    title: "Managed Accounting & Financial Reporting",
    image:
      "/assets/Managed-Accounting-Financial-Reporting-Vector-image1-scaled.jpg",
    description:
      "We provide detailed and scalable accounting solutions, ensuring your books are always accurate and compliant with international standards.",
    path: "/services/accounting-financial-reporting",
    category: "Accounting",
  },
  {
    id: 2,
    title: "Taxation & Regulatory Advisory",
    image: "/assets/Taxation-Regulatory-Advisory.jpg",
    description:
      "Our expert team navigates the complexities of tax regulations, providing proactive strategies to minimize your liabilities while ensuring compliance.",
    path: "/assets/services/taxation-regulatory-advisory",
    category: "Taxation",
  },
  {
    id: 3,
    title: "Audit Support & Assurance",
    image: "/assets/Audit-Support-Assurance.jpg",
    description:
      "We offer seamless audit support, bridging the gap between your records and auditor expectations to ensure a smooth assurance process.",
    path: "/services/audit-support-assurance",
    category: "Audit",
  },
  {
    id: 4,
    title: "Corporate Secretarial & Entity Formation",
    image: "/assets/Corporate-Secretarial-Entity-Formation.jpeg",
    description:
      "Let us handle the administrative and legal requirements of your business formation, allowing you to focus on your growth objectives.",
    path: "/services/corporate-secretarial",
    category: "Corporate",
  },
  {
    id: 5,
    title: "Payroll Processing & Administration",
    image: "/assets/Global-Payroll-Administration.jpg",
    description:
      "Our payroll services ensure that your workforce is compensated accurately and on time, maintaining compliance with local regulations.",
    path: "/services/payroll-processing",
    category: "Payroll",
  },
  {
    id: 6,
    title: "Strategic Advisory & Corporate Finance",
    image: "/assets/Strategic-Advisory-Corporate-Finance.jpg",
    description:
      "Unlock capital and drive expansion through our sophisticated financial modeling and strategic insights tailored for your business.",
    path: "/services/strategic-advisory",
    category: "Advisory",
  },
];

const DEFAULT_TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Director, Sydney Accounting Group",
    image: "/testimonial-1.jpg",
    review:
      "Glozon FinTax has transformed the way we manage our offshore accounting operations. Their accuracy, responsiveness, and deep understanding of Australian compliance requirements are exceptional.",
  },
  {
    id: 2,
    name: "Rajesh Mehta",
    role: "Founder, Mehta Exports",
    image: "/testimonial-2.jpg",
    review:
      "The team provides outstanding bookkeeping and payroll support. We have reduced operational costs significantly while improving reporting quality and turnaround time.",
  },
  {
    id: 3,
    name: "Aisha Al Mansoori",
    role: "Finance Manager, Dubai Ventures",
    image: "/testimonial-3.jpg",
    review:
      "Professional, reliable, and highly confidential. Their advisory support helped us streamline compliance and make better financial decisions for our growing business.",
  },
];

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
  googleMapUrl: "https://www.google.com/maps?q=Gaushala+Kathmandu&output=embed",
  facebook: "https://facebook.com",
  linkedin: "https://linkedin.com",
  instagram: "https://instagram.com",
  twitter: "https://twitter.com",
  footerDescription:
    "Professional accounting, taxation, payroll, and advisory solutions for businesses across Nepal, Australia, India, and the UAE.",
  businessHours: [
    { day: "Sunday", isOpen: true, openTime: "10:00 AM", closeTime: "5:00 PM" },
    { day: "Monday", isOpen: true, openTime: "10:00 AM", closeTime: "5:00 PM" },
    { day: "Tuesday", isOpen: true, openTime: "10:00 AM", closeTime: "5:00 PM" },
    { day: "Wednesday", isOpen: true, openTime: "10:00 AM", closeTime: "5:00 PM" },
    { day: "Thursday", isOpen: true, openTime: "10:00 AM", closeTime: "5:00 PM" },
    { day: "Friday", isOpen: false },
    { day: "Saturday", isOpen: false },
  ],
};

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const fetchAllData = useCallback(async () => {
    try {
      const [contentRes, servicesRes, testimonialsRes, settingsRes] =
        await Promise.allSettled([
          API.get("/content"),
          API.get("/services"),
          API.get("/testimonials"),
          API.get("/settings"),
        ]);

      if (contentRes.status === "fulfilled" && contentRes.value.data) {
        setContent((prev) => ({
          ...prev,
          ...contentRes.value.data,
        }));
      }

      if (
        servicesRes.status === "fulfilled" &&
        Array.isArray(servicesRes.value.data) &&
        servicesRes.value.data.length > 0
      ) {
        setServices(servicesRes.value.data);
      }

      if (
        testimonialsRes.status === "fulfilled" &&
        Array.isArray(testimonialsRes.value.data) &&
        testimonialsRes.value.data.length > 0
      ) {
        setTestimonials(testimonialsRes.value.data);
      }

      if (settingsRes.status === "fulfilled" && settingsRes.value.data) {
        setSettings((prev) => ({
          ...prev,
          ...settingsRes.value.data,
        }));
      }
    } catch (e) {
      console.warn("Using fallback content defaults:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const value = {
    content,
    services,
    testimonials,
    settings,
    loading,
    refreshContent: fetchAllData,
    getAssetUrl,
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    return {
      content: DEFAULT_CONTENT,
      services: DEFAULT_SERVICES,
      testimonials: DEFAULT_TESTIMONIALS,
      settings: DEFAULT_SETTINGS,
      loading: false,
      refreshContent: () => {},
      getAssetUrl,
    };
  }
  return ctx;
}
