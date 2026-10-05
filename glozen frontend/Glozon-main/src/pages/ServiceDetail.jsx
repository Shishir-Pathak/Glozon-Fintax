import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { useContent } from "../context/ContentContext";
import { getAssetUrl } from "../utils/assets";

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

const ServiceDetail = () => {
  const { id } = useParams();
  const { services } = useContent();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const allServices = Array.isArray(services) ? services : [];

  const current = allServices.find((s) => {
    if (!s) return false;
    const sid = String(s.id);
    const sSlug = slugify(s.title);
    const sPath = String(s.path || "").replace(/^\/+/, "").replace(/^services\//, "");
    return sid === String(id) || sSlug === String(id) || sPath === String(id);
  });

  const otherServices = allServices.filter((s) => String(s.id) !== String(current?.id));

  if (!current) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-24 text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-800">Service not found</h1>
        <p className="mb-8 max-w-md text-gray-600">
          The service you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="rounded-md bg-green-500 px-6 py-3 font-medium text-white shadow-md transition hover:bg-green-600">
          Back to Home
        </Link>
      </div>
    );
  }

  const heroImage = getAssetUrl(current.image || current.imageUrl || "/Logo.png");
  const longDescription = current.longDescription || current.fullDescription || current.details || current.description || "";
  const features = current.features || current.benefits || current.highlights || [];

  return (
    <div className="bg-white">
      {/* ============ DARK HERO BANNER ============ */}
      <section className="bg-[#2b2626] py-10 md:py-14">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            {/* LEFT: LEARN + title */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="mb-4 text-3xl font-bold tracking-wide text-white md:text-4xl">
                LEARN
              </p>
              <div className="inline-block rounded-md bg-green-500 px-6 py-3 shadow-lg">
                <h1 className="text-2xl font-bold text-white md:text-3xl">
                  {current.title}
                </h1>
              </div>
            </motion.div>

            {/* RIGHT: image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex justify-center md:justify-end"
            >
              <img
                src={heroImage}
                alt={current.title}
                className="h-48 w-auto object-contain md:h-64"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ MAIN CONTENT + SIDEBAR ============ */}
      <section className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr]">
          
          {/* LEFT: content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
              {current.title}
            </h2>

            <div className="whitespace-pre-line text-base leading-relaxed text-gray-700">
              {longDescription}
            </div>

            {features.length > 0 && (
              <div className="mt-10">
                <h3 className="mb-4 text-xl font-bold text-gray-900">What's Included</h3>
                <ul className="space-y-3">
                  {features.map((feature, i) => {
                    const text = typeof feature === "string" ? feature : feature?.text || feature?.title || "";
                    if (!text) return null;
                    return (
                      <li key={i} className="flex items-start gap-3 text-gray-700">
                        <span className="mt-1 text-green-600">✓</span>
                        <span>{text}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </motion.article>

          {/* RIGHT: sidebar — Latest Courses */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <div className="border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 border-b-2 border-green-500 pb-2 text-xl font-bold text-gray-900">
                Other Services
              </h3>

              {otherServices.length === 0 ? (
                <p className="text-sm text-gray-500">No other services available.</p>
              ) : (
                <ul className="space-y-3">
                  {otherServices.map((service) => (
                    <li key={service.id}>
                      <Link
                        to={buildServiceLink(service)}
                        className="block border-b border-gray-100 py-2 text-sm text-gray-700 transition hover:text-green-600"
                      >
                        {service.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.aside>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;