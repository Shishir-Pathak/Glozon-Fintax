import { motion } from "framer-motion";
import { useContent } from "../context/ContentContext";
import { getAssetUrl } from "../utils/assets";

const Testimonials = () => {
  const { testimonials, content } = useContent();
  const testContent = content?.testimonials || {};

  const sectionTitle = testContent.title || "Client Testimonials";
  const sectionSubtitle =
    testContent.subtitle ||
    "Discover what our satisfied clients have to say about our services and how we've helped their businesses succeed.";

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
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-24" id="testimonials">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 text-3xl font-bold text-orange-500 md:text-4xl lg:text-5xl">
            {sectionTitle}
          </h2>

          <div className="mx-auto mb-6 h-1 w-24 rounded-full bg-orange-500" />

          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600">
            {sectionSubtitle}
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              whileHover={{
                y: -8,
                boxShadow:
                  "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
              }}
              className="group relative rounded-2xl border border-gray-100 bg-white p-8 shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              {/* Quote */}
              <div className="relative z-10 mb-6">
                <span className="absolute -top-6 -left-4 text-6xl font-serif text-blue-100 transition-colors group-hover:text-blue-200">
                  "
                </span>

                <p className="relative z-10 pt-2 leading-relaxed text-gray-600 italic">
                  {testimonial.review || testimonial.text}
                </p>
              </div>

              {/* Author */}
              <div className="mt-8 flex items-center gap-4 border-t border-gray-100 pt-6">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-orange-200 blur transition-all group-hover:blur-md" />

                  {testimonial.image ? (
                    <img
                      src={getAssetUrl(testimonial.image)}
                      alt={testimonial.name}
                      className="relative z-10 h-20 w-20 rounded-full border-2 border-white object-cover shadow-sm"
                    />
                  ) : (
                    <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-lg font-bold text-gray-500 shadow-sm">
                      {(testimonial.name || "Client")
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                    {testimonial.name}
                  </h4>

                  <p className="text-sm font-medium text-pink-600">
                    {testimonial.role || testimonial.position}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;