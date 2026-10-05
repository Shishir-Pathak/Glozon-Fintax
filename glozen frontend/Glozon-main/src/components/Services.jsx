import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useContent } from "../context/ContentContext";
import { getAssetUrl } from "../utils/assets";

// ==========================================
// HELPER — build detail page URL
// ==========================================

const slugify = (str) =>
  String(str || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const buildServiceLink = (service) => {
  const key = service?.id ?? slugify(service?.title);
  return `/services/${key}`;
};

const Services = () => {
  const { services, content } = useContent();
  const servicesContent = content?.services || {};

  const sectionTitle = servicesContent.title || "Our Services";
  const sectionSubtitle =
    servicesContent.subtitle ||
    "Discover our comprehensive suite of services designed to drive your business forward and ensure financial integrity.";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="bg-gray-50 py-24" id="services">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto mb-16 max-w-3xl text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-6 text-3xl font-bold text-orange-500 md:text-4xl lg:text-5xl">
            {sectionTitle}
          </h2>

          <p className="text-lg text-gray-600">
            {sectionSubtitle}
          </p>
        </motion.div>

        <motion.div
          className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {services.map((service, index) => (
            <motion.div
              key={service.id || service.path || index}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition-shadow duration-300 hover:shadow-2xl"
            >
              <div className="relative flex h-64 items-center justify-center overflow-hidden bg-blue-50/50 p-6">
                <div className="absolute inset-0 scale-0 rounded-full bg-blue-100/50 opacity-0 transition-transform duration-700 ease-in-out group-hover:scale-150 group-hover:opacity-100" />

                <motion.img
                  src={getAssetUrl(service.image || service.imageUrl || "/Logo.png")}
                  alt={service.title}
                  className="relative z-10 h-48 w-48 rounded-full bg-white object-cover shadow-md"
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="relative z-10 flex flex-grow flex-col bg-white p-8 text-center">
                <h3 className="mb-4 flex h-14 items-center justify-center text-xl font-bold text-gray-800">
                  {service.title}
                </h3>

                <p className="mb-8 flex-grow text-gray-600">
                  {service.description}
                </p>

                {/* ✅ Now links to the detail page */}
                <Link
                  to={buildServiceLink(service)}
                  className="inline-block w-full rounded-md bg-pink-600 px-6 py-3 text-center font-medium text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-pink-700 active:scale-95"
                >
                  Learn More About Our Services
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Services;