import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useContent } from "../context/ContentContext";
import { getAssetUrl } from "../utils/assets";

const DEFAULT_STATS = [
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
];

const Counter = ({ target }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 2000;
    const numericTarget = Number(target) || 0;
    const increment = numericTarget / (duration / 16);

    const timer = setInterval(() => {
      start += increment;

      if (start >= numericTarget) {
        setCount(numericTarget);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span
      ref={ref}
      className="text-4xl font-extrabold text-pink-600 md:text-5xl"
    >
      {count}
    </span>
  );
};

const MissionStatement = () => {
  const { content } = useContent();
  const missionContent = content?.mission || {};

  const title = missionContent.title || "Our Mission Statement";
  const subtitle =
    missionContent.subtitle ||
    "Providing exceptional financial services designed for your growth and peace of mind.";
  const missionBg = getAssetUrl(missionContent.bgImage || "/mission.jpg");
  const buttonText = missionContent.buttonText || "Read The Rest Of Mission";
  const buttonLink = missionContent.buttonLink || "#";
  const stats = (missionContent.stats && missionContent.stats.length > 0)
    ? missionContent.stats
    : DEFAULT_STATS;

  return (
    <section
      className="relative bg-cover bg-center bg-fixed py-24 md:py-32"
      style={{ backgroundImage: `url(${missionBg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 z-0 bg-black/60 backdrop-blur-[3px]" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-16 lg:flex-row lg:gap-12">
          {/* Left Side */}
          <motion.div
            className="text-white lg:w-5/12"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="mb-6 text-4xl font-bold leading-tight md:text-5xl">
              {title}
            </h2>

            <div className="mb-8 h-1 w-16 rounded-full bg-pink-600" />

            <p className="mb-10 text-lg leading-relaxed font-light text-gray-200 md:text-xl">
              {subtitle}
            </p>

            <motion.a
              href={buttonLink}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block rounded bg-pink-600 px-8 py-3 font-medium text-white shadow-lg transition-colors hover:bg-pink-700"
            >
              {buttonText}
            </motion.a>
          </motion.div>

          {/* Right Side */}
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:w-7/12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: stat.delay || 0.1 * index }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group rounded-xl border border-white/20 bg-white/95 p-8 text-center shadow-2xl backdrop-blur-md"
              >
                <div className="mb-4">
                  <Counter target={stat.target} />
                </div>

                <p className="text-sm leading-relaxed font-medium text-gray-700 md:text-base">
                  {stat.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionStatement;