import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useContent } from "../context/ContentContext";

const DEFAULT_FOOTER_SETTINGS = {
  footerDescription:
    "Professional accounting, taxation, payroll, and advisory solutions for businesses across Nepal, Australia, India, and the UAE.",
  primaryEmail: "info@glozonfintax.com",
  facebook: "https://facebook.com",
  linkedin: "https://linkedin.com",
  instagram: "https://instagram.com",
  twitter: "https://twitter.com",
};

const Footer = () => {
  const { settings: dynamicSettings, services: dynamicServices } = useContent();
  const settings = dynamicSettings || DEFAULT_FOOTER_SETTINGS;

  const socialLinks = [
    settings.facebook && {
      id: "f",
      icon: "fi fi-brands-facebook",
      color: "bg-blue-600 hover:bg-blue-500",
      href: settings.facebook,
    },
    settings.linkedin && {
      id: "in",
      icon: "fi fi-brands-linkedin",
      color: "bg-blue-400 hover:bg-blue-300",
      href: settings.linkedin,
    },
    settings.instagram && {
      id: "ig",
      icon: "fi fi-brands-instagram",
      color: "bg-pink-600 hover:bg-pink-500",
      href: settings.instagram,
    },
    settings.twitter && {
      id: "tw",
      icon: "fi fi-brands-twitter",
      color: "bg-slate-700 hover:bg-slate-600",
      href: settings.twitter,
    },
    settings.primaryEmail && {
      id: "mail",
      icon: "fi fi-rr-envelope",
      color: "bg-gray-600 hover:bg-gray-500",
      href: `mailto:${settings.primaryEmail}`,
    },
  ].filter(Boolean);

  return (
    <footer className="bg-gray-950 py-16 text-gray-400">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-16">
          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="mb-6 text-xl font-bold tracking-wide text-orange-500">
              <span style={{ color: "#036B09" }}>Glozon</span>{" "}
              <span style={{ color: "#2A17B4" }}>FinTax</span>
              {" & "}
              <span style={{ color: "#FFAB09" }}>Advisory</span>
            </h3>

            <p className="mb-6 text-sm leading-relaxed text-gray-400">
              {settings.footerDescription}
            </p>

            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg transition-colors ${social.color}`}
                >
                  <i className={`${social.icon} mt-1 text-lg leading-none`}></i>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Important Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:ml-12"
          >
            <h3 className="mb-6 text-xl font-bold tracking-wide text-white">
              Important Links
            </h3>

            <ul className="space-y-4">
              {[
                { name: "Home", path: "/" },
                { name: "About Us", path: "/about" },
                { name: "Services", path: "/services" },
                { name: "Careers", path: "/career" },
                { name: "Contact", path: "/contact-us" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="group flex items-center transition-colors hover:text-orange-500"
                  >
                    <span className="mr-3 h-2 w-2 -translate-x-2 rounded-full bg-orange-500 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="mb-6 text-xl font-bold tracking-wide text-white">
              Our Services
            </h3>

            <ul className="space-y-4">
              {[
                { name: "Accounting & Financial Reporting", path: "/services/accounting-financial-reporting" },
                { name: "Audit Support & Assurance", path: "/services/audit-support-assurance" },
                { name: "Corporate Secretarial", path: "/services/corporate-secretarial" },
                { name: "Human Capital & Professional Development", path: "/services/human-capital-professional-development" },
                { name: "Payroll Processing", path: "/services/payroll-processing" },
                { name: "Strategic Advisory", path: "/services/strategic-advisory" },
                { name: "Taxation & Regulatory Advisory", path: "/services/taxation-regulatory-advisory" },
              ].map((service, index) => (
                <li key={index}>
                  <Link
                    to={service.path}
                    className="group flex items-center transition-colors hover:text-orange-500"
                  >
                    <span className="mr-3 h-2 w-2 -translate-x-2 rounded-full bg-orange-500 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      {service.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 text-center md:flex-row">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Glozon FinTax & Advisory. All rights reserved.
          </p>

          <div className="flex gap-4 text-sm text-gray-500">
            <a href="#" className="transition-colors hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;