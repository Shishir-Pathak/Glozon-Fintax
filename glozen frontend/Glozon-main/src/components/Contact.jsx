import React, { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import API from "../API/Api";
import { useContent } from "../context/ContentContext";
import { getAssetUrl } from "../utils/assets";

const DEFAULT_CONTACT_IMG = "/contactus.jpg";

const COUNTRY_OPTIONS = ["Australia", "Nepal", "India", "Dubai"];

const inputClass =
  "w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors";

const labelClass =
  "block text-sm font-semibold text-gray-800 mb-1.5";

// Changathali, Mahalaxmi, Lalitpur
const CHANGATHALI_LAT = 27.65436;
const CHANGATHALI_LNG = 85.36826;

// Google Maps URL for clickable address
const GOOGLE_MAP_LINK_URL =
  `https://www.google.com/maps/search/?api=1&query=${CHANGATHALI_LAT},${CHANGATHALI_LNG}`;

// Google Maps embed URL
const GOOGLE_MAP_EMBED_URL =
  `https://www.google.com/maps?q=${CHANGATHALI_LAT},${CHANGATHALI_LNG}&z=16&output=embed`;

const CHANGATHALI_ADDRESS =
  "Changathali 07, Mahalaxmi, Lalitpur, Kathmandu Valley, Nepal";

export default function Contact() {
  const { settings, content } = useContent();

  const contactSettings = settings || {};
  const contactContent = content?.contact || {};

  const primaryEmail =
    contactSettings.primaryEmail || "gfa@glozonfintax.com";

  const primaryPhone =
    contactSettings.primaryPhone || "+977 9845971220";

  const address =
    contactSettings.address || CHANGATHALI_ADDRESS;

  const contactIllustration = getAssetUrl(
    contactContent.image || DEFAULT_CONTACT_IMG
  );

  const [sending, setSending] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    phoneNumber: "",
    subject: "",
    message: "",
  });

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // HANDLE FORM SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSending(true);

    try {
      await API.post("/contact", formData);

      toast.success("Message Submitted Successfully!");

      setFormData({
        name: "",
        email: "",
        country: "",
        phoneNumber: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error("Error submitting contact form:", err);

      toast.error("Failed to submit message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="py-16 bg-white" id="contact">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">

        {/* ==========================================
            HEADING
        ========================================== */}

        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-orange-500 mb-6 uppercase tracking-wider"
          >
            Contact Us
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <img
              src={contactIllustration}
              alt="Contact Us Illustration"
              className="mx-auto w-[300px] h-[234px] object-contain"
            />
          </motion.div>
        </div>

        {/* ==========================================
            CONTENT
        ========================================== */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-start mb-20">

          {/* ==========================================
              LEFT SIDE - CONTACT INFORMATION
          ========================================== */}

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col space-y-10 items-center text-center mt-8"
          >

            {/* ADDRESS */}

            <a
              href={GOOGLE_MAP_LINK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center group px-4 py-4 rounded-lg hover:bg-slate-50 transition-colors"
              aria-label="Open Changathali location in Google Maps"
            >
              <div className="w-16 h-16 rounded-full border-2 border-red-500 flex items-center justify-center mb-3 mx-auto group-hover:bg-red-50 transition-colors">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>

              <h3 className="text-red-500 font-bold text-lg mb-2">
                Address
              </h3>

              <p className="text-gray-700 text-sm max-w-xs mx-auto">
                {address}
              </p>

              <p className="text-blue-600 text-xs font-semibold mt-2">
                View on Google Maps →
              </p>
            </a>

            {/* PHONE */}

            <a
              href={`tel:${primaryPhone.replace(/\s+/g, "")}`}
              className="block text-center group px-4 py-4 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="w-16 h-16 rounded-full border-2 border-green-500 flex items-center justify-center mb-3 mx-auto group-hover:bg-green-50 transition-colors">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a2 2 0 011.21-.502l4.493 1.498a2 2 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>

              <h3 className="text-green-500 font-bold text-lg mb-2">
                Phone
              </h3>

              <p className="text-gray-700 text-sm">
                {primaryPhone}
              </p>
            </a>

            {/* EMAIL */}

            <a
              href={`mailto:${primaryEmail}`}
              className="block text-center group px-4 py-4 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="w-16 h-16 rounded-full border-2 border-yellow-400 flex items-center justify-center mb-3 mx-auto group-hover:bg-yellow-50 transition-colors">
                <svg
                  className="w-8 h-8 text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <h3 className="text-yellow-500 font-bold text-lg mb-2">
                Email
              </h3>

              <p className="text-blue-500 text-sm break-all">
                {primaryEmail}
              </p>
            </a>

          </motion.div>

          {/* ==========================================
              RIGHT SIDE - CONTACT FORM
          ========================================== */}

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <h3 className="text-2xl font-bold text-blue-600 mb-2 uppercase text-center md:text-left">
              Get In Touch
            </h3>

            <p className="text-sm text-gray-600 mb-6 text-center md:text-left">
              Fill out the form below and we will get back to you soon.
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col space-y-4"
            >

              {/* FULL NAME */}

              <div>
                <label className={labelClass}>
                  Full Name *
                </label>

                <input
                  type="text"
                  required
                  className={inputClass}
                  value={formData.name}
                  onChange={handleChange}
                  name="name"
                  placeholder="Enter your full name"
                />
              </div>

              {/* EMAIL */}

              <div>
                <label className={labelClass}>
                  Email Address *
                </label>

                <input
                  type="email"
                  required
                  className={inputClass}
                  value={formData.email}
                  onChange={handleChange}
                  name="email"
                  placeholder="Enter your email"
                />
              </div>

              {/* COUNTRY */}

              <div>
                <label className={labelClass}>
                  Country *
                </label>

                <select
                  required
                  value={formData.country}
                  className={inputClass}
                  onChange={handleChange}
                  name="country"
                >
                  <option value="" disabled>
                    Select country
                  </option>

                  {COUNTRY_OPTIONS.map((country) => (
                    <option
                      key={country}
                      value={country}
                    >
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              {/* PHONE */}

              <div>
                <label className={labelClass}>
                  Mobile Number
                </label>

                <input
                  type="tel"
                  className={inputClass}
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  name="phoneNumber"
                  placeholder="Enter your mobile number"
                />
              </div>

              {/* SUBJECT */}

              <div>
                <label className={labelClass}>
                  Subject
                </label>

                <input
                  type="text"
                  className={inputClass}
                  value={formData.subject}
                  onChange={handleChange}
                  name="subject"
                  placeholder="Enter subject"
                />
              </div>

              {/* MESSAGE */}

              <div>
                <label className={labelClass}>
                  Message *
                </label>

                <textarea
                  required
                  rows={5}
                  className={`${inputClass} resize-y min-h-[120px]`}
                  value={formData.message}
                  onChange={handleChange}
                  name="message"
                  placeholder="Write your message..."
                />
              </div>

              {/* SUBMIT */}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={sending}
                  className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase tracking-wide rounded-sm shadow transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </div>

            </form>
          </motion.div>
        </div>

        {/* ==========================================
            GOOGLE MAP
        ========================================== */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="w-full h-[450px] border border-gray-200 overflow-hidden rounded-sm"
        >
          <iframe
            src={GOOGLE_MAP_EMBED_URL}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Glozon FinTax Changathali Location Map"
          />
        </motion.div>

      </div>
    </section>
  );
}