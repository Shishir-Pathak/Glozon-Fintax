import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import API from "../API/Api.js";

export default function CareerForm() {
  const [sending, setSending] = useState(false);
  const [cvName, setCvName] = useState("");
  const [cvFile, setCvFile] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    country: "",
    position: "",
    experience: "",
    linkedInUrl: "",
    coverLetter: "",
  });

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // HANDLE CV CHANGE
  // =====================================================

  const handleCvChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setCvFile(file);
      setCvName(file.name);
    } else {
      setCvFile(null);
      setCvName("");
    }
  };

  // =====================================================
  // HANDLE SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ---------------------------------------------------
    // CHECK CV
    // ---------------------------------------------------

    if (!cvFile) {
      toast.error("Please upload your CV before submitting.");
      return;
    }

    setSending(true);

    try {
      // -------------------------------------------------
      // CREATE FORM DATA
      // -------------------------------------------------

      const dataPayload = new FormData();

      dataPayload.append(
        "fullName",
        formData.fullName || ""
      );

      dataPayload.append(
        "email",
        formData.email || ""
      );

      dataPayload.append(
        "phoneNumber",
        formData.phoneNumber || ""
      );

      dataPayload.append(
        "country",
        formData.country || ""
      );

      dataPayload.append(
        "position",
        formData.position || ""
      );

      dataPayload.append(
        "experience",
        formData.experience || ""
      );

      dataPayload.append(
        "linkedInUrl",
        formData.linkedInUrl || ""
      );

      dataPayload.append(
        "coverLetter",
        formData.coverLetter || ""
      );

      dataPayload.append(
        "cv",
        cvFile
      );

      // -------------------------------------------------
      // SEND REQUEST
      // -------------------------------------------------

      await API.post(
        "/careers",
        dataPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // -------------------------------------------------
      // RESET FORM
      // -------------------------------------------------

      e.target.reset();

      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        country: "",
        position: "",
        experience: "",
        linkedInUrl: "",
        coverLetter: "",
      });

      setCvName("");
      setCvFile(null);

      // -------------------------------------------------
      // SUCCESS TOAST
      // -------------------------------------------------

      toast.success(
        "Application submitted successfully!"
      );

    } catch (err) {
      console.error(
        "Submission error:",
        err
      );

      // -------------------------------------------------
      // ERROR TOAST
      // -------------------------------------------------

      toast.error(
        err.response?.data?.message ||
        "Failed to submit application. Please try again."
      );

    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-gray-50 py-16 md:py-20 mb-16">

      {/* =================================================
          CAREERS HEADING
      ================================================= */}

      <div className="max-w-3xl mx-auto text-center px-4 mb-10">

        <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
          Careers
        </h1>

        <p className="text-gray-600 leading-relaxed text-lg">
          We welcome applications from professionals who share
          our commitment to quality offshore financial and
          taxation services. Complete the form below and attach
          your CV — our team will review your application by
          email.
        </p>

      </div>

      {/* =================================================
          FORM BOX
      ================================================= */}

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200"
      >

        <h2 className="text-2xl font-bold text-blue-900 mb-2">
          Apply Now
        </h2>

        <p className="text-gray-600 mb-6">
          Fill the form below and upload your CV.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* =================================================
              FULL NAME
          ================================================= */}

          <div>

            <label className="block text-sm font-medium mb-1">
              Full Name *
            </label>

            <input
              type="text"
              required
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* =================================================
              EMAIL + MOBILE
          ================================================= */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* EMAIL */}

            <div>

              <label className="block text-sm font-medium mb-1">
                Email *
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* MOBILE */}

            <div>

              <label className="block text-sm font-medium mb-1">
                Mobile *
              </label>

              <input
                type="tel"
                required
                placeholder="+977 9845971220"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

          </div>

          {/* =================================================
              COUNTRY
          ================================================= */}

          <div>

            <label className="block text-sm font-medium mb-1">
              Country *
            </label>

            <select
              required
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >

              <option value="">
                Select Country
              </option>

              <option value="Australia">
                Australia
              </option>

              <option value="Nepal">
                Nepal
              </option>

              <option value="India">
                India
              </option>

              <option value="Dubai">
                Dubai
              </option>

            </select>

          </div>

          {/* =================================================
              POSITION
          ================================================= */}

          <div>

            <label className="block text-sm font-medium mb-1">
              Position *
            </label>

            <select
              required
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >

              <option value="">
                Select Position
              </option>

              <option value="Accounting & Financial Reporting">
                Accounting & Financial Reporting
              </option>

              <option value="Taxation & Regulatory Advisory">
                Taxation & Regulatory Advisory
              </option>

              <option value="Audit Support & Assurance">
                Audit Support & Assurance
              </option>

              <option value="Payroll Processing & Administration">
                Payroll Processing & Administration
              </option>

              <option value="Strategic Advisory & Corporate Finance">
                Strategic Advisory & Corporate Finance
              </option>

               <option value="Internship or Training">
                Internship or Training
              </option>

            </select>

          </div>

          {/* =================================================
              EXPERIENCE
          ================================================= */}

          <div>

            <label className="block text-sm font-medium mb-1">
              Experience *
            </label>

            <select
              required
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >

              <option value="">
                Select Experience
              </option>

              <option value="Fresher">
                Fresher
              </option>

              <option value="0-1 years">
                0-1 years
              </option>

              <option value="1-3 years">
                1-3 years
              </option>

              <option value="3-5 years">
                3-5 years
              </option>

              <option value="5+ years">
                5+ years
              </option>

            </select>

          </div>

          {/* =================================================
              LINKEDIN
          ================================================= */}

          <div>

            <label className="block text-sm font-medium mb-1">
              LinkedIn (optional)
            </label>

            <input
              type="url"
              placeholder="https://linkedin.com/in/..."
              name="linkedInUrl"
              value={formData.linkedInUrl}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* =================================================
              COVER LETTER
          ================================================= */}

          <div>

            <label className="block text-sm font-medium mb-1">
              Cover Letter *
            </label>

            <textarea
              rows={5}
              required
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              placeholder="Tell us about your skills and why you want to join GFA…"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* =================================================
              CV UPLOAD
          ================================================= */}

          <div>

            <label className="block text-sm font-medium mb-1">
              Upload CV *
            </label>

            <input
              type="file"
              required
              accept=".pdf,.doc,.docx"
              onChange={handleCvChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {cvName && (
              <p className="text-sm text-gray-500 mt-2">
                Selected: {cvName}
              </p>
            )}

          </div>

          {/* =================================================
              SUBMIT BUTTON
          ================================================= */}

          <div className="pt-4">

            <button
              type="submit"
              disabled={sending}
              className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >

              {sending
                ? "Submitting..."
                : "Submit Application"
              }

            </button>

          </div>

        </form>

      </motion.div>

    </div>
  );
}