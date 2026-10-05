import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useContent } from "../context/ContentContext";
import { getAssetUrl } from "../utils/assets";

const SLIDE_INTERVAL_MS = 6000;

const DEFAULT_SLIDES = [
  { src: "/tax2.jpg", alt: "Glozon FinTax advisory services" },
];

const Hero = () => {
  const { content } = useContent();
  const heroContent = content?.hero || {};

  const slides = (heroContent.slides && heroContent.slides.length > 0)
    ? heroContent.slides
    : DEFAULT_SLIDES;

  const [currentSlide, setCurrentSlide] = useState(0);
  const slideCount = slides.length;

  const goToSlide = useCallback(
    (index) => {
      setCurrentSlide(((index % slideCount) + slideCount) % slideCount);
    },
    [slideCount]
  );

  const nextSlide = useCallback(() => {
    goToSlide(currentSlide + 1);
  }, [currentSlide, goToSlide]);

  useEffect(() => {
    if (slideCount <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideCount);
    }, SLIDE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [slideCount]);

  const slide = slides[currentSlide] || slides[0] || DEFAULT_SLIDES[0];

  const headingPrefix = heroContent.headingPrefix || "Glozon";
  const headingHighlight = heroContent.headingHighlight || "FinTax";
  const headingSuffix = heroContent.headingSuffix || "Advisory";
  const description =
    heroContent.description ||
    "Glozon FinTax & Advisory (GFA) is a premier financial and taxation consultancy firm headquartered in Lalitpur, Nepal. We specialize in providing comprehensive offshore and outsourced services tailored specifically for firms and clients in Australia, India, Dubai and Nepal.";
  const primaryBtnText = heroContent.primaryBtnText || "Get Started Today";
  const primaryBtnLink = heroContent.primaryBtnLink || "/client-onboarding";
  const secondaryBtnText = heroContent.secondaryBtnText || "Contact Us";
  const secondaryBtnLink = heroContent.secondaryBtnLink || "/contact-us";

  return (
    <div className="relative h-[80vh] min-h-[600px] w-full overflow-hidden bg-blue-950">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <img
            src={getAssetUrl(slide.src)}
            alt={slide.alt || "Glozon FinTax Banner"}
            className="h-full w-full object-cover object-center"
            loading={currentSlide === 0 ? "eager" : "lazy"}
            decoding="async"
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay */}
     <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />

      {/* Dots */}
      {slideCount > 1 && (
        <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === currentSlide ? "true" : undefined}
              onClick={() => goToSlide(i)}
              className={`h-2.5 rounded-full transition-all ${
                i === currentSlide
                  ? "w-8 bg-pink-500"
                  : "w-2.5 bg-white/60 hover:bg-white"
              }`}
            />
          ))}
        </div>
      )}

      {/* Arrows */}
      {slideCount > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => goToSlide(currentSlide - 1)}
            className="absolute left-3 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/30 px-3 py-2 text-2xl text-white backdrop-blur-sm hover:bg-black/50 md:left-6"
          >
            ‹
          </button>

          <button
            type="button"
            aria-label="Next slide"
            onClick={nextSlide}
            className="absolute right-3 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/30 px-3 py-2 text-2xl text-white backdrop-blur-sm hover:bg-black/50 md:right-6"
          >
            ›
          </button>
        </>
      )}

      {/* Content */}
      <div className="container relative z-20 mx-auto flex h-full flex-col items-start justify-center px-4 text-white sm:px-6 lg:px-8">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
      <h1 className="mb-6 text-4xl font-extrabold leading-tight drop-shadow-2xl sm:text-5xl lg:text-6xl">
  <span className="text-green-400">{headingPrefix}</span>{" "}
  <span className="text-blue-400">{headingHighlight}</span>
  {" & "}
  <span className="text-yellow-300">{headingSuffix}</span>
</h1>

          <motion.p
            className="mb-10 text-justify text-lg text-gray-200 sm:text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {description}
          </motion.p>

          <motion.div
            className="flex flex-col gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link to={primaryBtnLink}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer rounded-md bg-pink-600 px-8 py-3 text-center font-medium text-white shadow-lg transition-colors hover:bg-pink-700"
              >
                {primaryBtnText}
              </motion.div>
            </Link>

            <Link to={secondaryBtnLink}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer rounded-md border-2 border-white bg-transparent px-8 py-3 text-center font-medium text-white transition-colors hover:bg-white hover:text-blue-950"
              >
                {secondaryBtnText}
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;