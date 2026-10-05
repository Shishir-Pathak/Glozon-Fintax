import { motion } from "framer-motion";
import { useContent } from "../context/ContentContext";
import { getAssetUrl } from "../utils/assets";

const DEFAULT_REASONS = [
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
];

const WhyChooseUs = () => {
  const { content } = useContent();
  const whyContent = content?.whyChooseUs || {};

  const title = whyContent.title || "Why Choose Us";
  const whyChooseUsImg = getAssetUrl(
    whyContent.image || "/assets/Why-choose-us-150x150.png"
  );
  const reasons = (whyContent.reasons && whyContent.reasons.length > 0)
    ? whyContent.reasons
    : DEFAULT_REASONS;

  return (
    <section className="relative overflow-hidden bg-white py-24">
      {/* Decorative background */}
      <div className="absolute right-0 top-0 -z-10 h-64 w-64 rounded-bl-full bg-gray-50 opacity-60" />
      <div className="absolute bottom-0 left-0 -z-10 h-64 w-64 rounded-tr-full bg-gray-50 opacity-60" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-20 flex flex-col items-center text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.img
            src={whyChooseUsImg}
            alt="Why Choose Us"
            className="mb-6 h-28 w-28 object-contain"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          <h2 className="text-3xl font-extrabold uppercase tracking-wider text-orange-500 md:text-4xl lg:text-5xl">
            {title}
          </h2>

          <div className="mt-6 h-1 w-24 rounded-full bg-orange-500" />
        </motion.div>

        {/* Cards */}
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-3 hover:border-blue-200 hover:shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: reason.delay || 0.1 * index }}
            >
              {/* Animated top bar */}
              <div
                className={`absolute left-1/2 top-0 h-1 w-12 -translate-x-1/2 rounded-full transition-all duration-300 group-hover:w-24 ${reason.barColor || "bg-orange-500"}`}
              />

              {/* Icon with hover glow */}
              <div className="relative mb-5 flex justify-center">
                <div className="absolute inset-0 mx-auto h-16 w-16 rounded-full bg-blue-100 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
                <i
                  className={`${reason.icon || "fi fi-rr-star"} relative z-10 text-5xl transition-transform duration-300 group-hover:scale-110 ${reason.color || "text-orange-500"}`}
                ></i>
              </div>

              <h3
                className={`mb-4 text-[16px] font-extrabold uppercase tracking-wide ${reason.color || "text-orange-500"}`}
              >
                {reason.title}
              </h3>

              <p className="text-sm leading-relaxed text-gray-600 md:text-base">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
