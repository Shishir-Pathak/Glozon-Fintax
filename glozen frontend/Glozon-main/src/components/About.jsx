import { motion } from "framer-motion";
import { useContent } from "../context/ContentContext";
import { getAssetUrl } from "../utils/assets";

const About = () => {
  const { content, settings } = useContent();
  const aboutContent = content?.about || {};

  const logo = getAssetUrl(aboutContent.logo || settings?.logo || "/assets/logo.png");
  const heading = aboutContent.heading || "Discover Glozon FinTax & Advisory";
  const paragraph1 =
    aboutContent.paragraph1 ||
    "Glozon FinTax & Advisory is a professional accounting, taxation, and financial advisory firm providing reliable and cost-effective solutions to businesses across Nepal, Australia, India, and the UAE. Our team of qualified accountants and advisors specializes in bookkeeping, tax compliance, payroll management, financial reporting, and business advisory services. We help businesses maintain compliance, improve financial visibility, and make informed decisions.";
  const paragraph2 =
    aboutContent.paragraph2 ||
    "With a strong focus on accuracy, confidentiality, and client satisfaction, we deliver tailored solutions to startups, SMEs, and established enterprises. Our mission is to be a trusted financial partner, supporting sustainable growth through expertise, integrity, and practical business insight.";

  return (
    <section id="about" className="overflow-hidden bg-white py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 md:flex-row-reverse lg:gap-20">
          {/* Left side: Logo */}
          <motion.div
            className="relative flex w-full justify-center md:w-5/12 md:justify-end"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              {/* Decorative blobs */}
              <motion.div
                className="absolute -left-12 top-0 z-0 h-24 w-24 rounded-tl-full rounded-tr-full rounded-bl-full rounded-br-sm bg-blue-200 opacity-80"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <motion.div
                className="absolute -bottom-8 -right-8 z-0 h-16 w-16 rounded-full bg-blue-100 opacity-80"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />

              <img
                src={logo}
                alt="Glozon FinTax & Advisory Logo"
                className="relative z-10 w-full max-w-[280px] object-contain"
              />
            </div>
          </motion.div>

          {/* Right side: Content */}
          <motion.div
            className="w-full text-left md:w-7/12"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
              {heading.includes("Glozon") ? (
                <>
                  Discover <span style={{ color: "#036B09" }}>Glozon</span>{" "}
                  <span style={{ color: "#2A17B4" }}>FinTax</span>
                  {" & "}
                  <span style={{ color: "#FFAB09" }}>Advisory</span>
                </>
              ) : (
                heading
              )}
            </h2>

            <div className="space-y-6 text-justify text-lg leading-8 text-gray-600">
              <p>{paragraph1}</p>
              {paragraph2 && <p>{paragraph2}</p>}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
