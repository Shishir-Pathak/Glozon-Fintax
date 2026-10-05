import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import API from "../API/Api";

export default function PartnerForm() {
  // =====================================================
  // GET SLUG FROM URL
  // Example:
  // /partner/sangalo-tech-1787658926854
  // =====================================================

  const { slug } = useParams();

  // =====================================================
  // STATE
  // =====================================================

  const [partner, setPartner] = useState(null);

  const [loadingPartner, setLoadingPartner] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [submitted, setSubmitted] = useState(false);

  const [pdfUrl, setPdfUrl] = useState("");

  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({
    companyName: "",
    registrationNumber: "",
    email: "",
    phone: "",
    contactName: "",
    position: "",
    address: "",
  });

  // =====================================================
  // FETCH PARTNER
  // =====================================================

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        setLoadingPartner(true);

        console.log("=================================");
        console.log("FETCHING PARTNER");
        console.log("SLUG:", slug);
        console.log("=================================");

        if (!slug) {
          console.error("Partner slug is missing.");
          setPartner(null);
          return;
        }

        const response = await API.get(`/partners/${slug}`);

        console.log("PARTNER RESPONSE:", response.data);

        if (response.data?.success && response.data?.data) {
          const partnerData = response.data.data;

          console.log("PARTNER DATA:", partnerData);

          setPartner(partnerData);

          setFormData({
            companyName: partnerData.name || "",
            registrationNumber:
              partnerData.registrationNumber || "",
            email: partnerData.email || "",
            phone: partnerData.phone || "",
            contactName: partnerData.contactName || "",
            position: partnerData.position || "",
            address: partnerData.address || "",
          });
        } else {
          console.error("Partner not found.");
          setPartner(null);
        }
      } catch (error) {
        console.error("=================================");
        console.error("FETCH PARTNER ERROR");
        console.error("STATUS:", error.response?.status);
        console.error("RESPONSE:", error.response?.data);
        console.error("ERROR:", error);
        console.error("=================================");

        setPartner(null);
      } finally {
        setLoadingPartner(false);
      }
    };

    fetchPartner();
  }, [slug]);

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // NOTIFY ADMIN DASHBOARD
  // =====================================================

  const notifyAdminDashboard = (submissionData) => {
    try {
      const notificationData = {
        type: "PARTNER_SUBMISSION_CREATED",

        partnerId: partner?.id || null,

        slug: partner?.slug || slug,

        submission: submissionData,

        timestamp: Date.now(),
      };

      // =================================================
      // LOCAL STORAGE
      // =================================================

      localStorage.setItem(
        "partnerUpdated",
        JSON.stringify(notificationData)
      );

      // =================================================
      // BROADCAST CHANNEL
      // =================================================

      if ("BroadcastChannel" in window) {
        const channel = new BroadcastChannel(
          "partner_updates"
        );

        channel.postMessage(notificationData);

        channel.close();
      }

      console.log(
        "ADMIN DASHBOARD NOTIFICATION SENT"
      );
    } catch (error) {
      console.error(
        "ADMIN NOTIFICATION ERROR:",
        error
      );
    }
  };

  // =====================================================
  // HANDLE FORM SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // =================================================
    // CHECK SLUG
    // =================================================

    if (!slug) {
      toast.error(
        "Invalid partner registration link."
      );

      return;
    }

    // =================================================
    // CHECK PARTNER
    // =================================================

    if (!partner) {
      toast.error(
        "Partner information could not be loaded."
      );

      return;
    }

    // =================================================
    // VALIDATE COMPANY NAME
    // =================================================

    if (!formData.companyName.trim()) {
      toast.error("Please enter company name.");
      return;
    }

    // =================================================
    // VALIDATE EMAIL
    // =================================================

    if (!formData.email.trim()) {
      toast.error("Please enter email.");
      return;
    }

    // =================================================
    // BASIC EMAIL VALIDATION
    // =================================================

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email.trim())) {
      toast.error(
        "Please enter a valid email address."
      );

      return;
    }

    try {
      setSubmitting(true);

      setPdfUrl("");

      setSubmitted(false);

      // =================================================
      // DATA FOR BACKEND
      // =================================================

      const data = {
        name: formData.companyName.trim(),

        registrationNumber:
          formData.registrationNumber.trim() || null,

        email: formData.email.trim(),

        phone:
          formData.phone.trim() || null,

        contactName:
          formData.contactName.trim() || null,

        position:
          formData.position.trim() || null,

        address:
          formData.address.trim() || null,
      };

      // =================================================
      // DEBUG
      // =================================================

      console.log("=================================");
      console.log("SUBMITTING PARTNER FORM");
      console.log("SLUG:", slug);
      console.log("PARTNER ID:", partner?.id);
      console.log("DATA SENT TO BACKEND:", data);
      console.log("=================================");

      // =================================================
      // SUBMIT
      // =================================================

      const response = await API.post(
        `/partners/${slug}/submit`,
        data
      );

      console.log(
        "PARTNER FORM RESPONSE:",
        response.data
      );

      // =================================================
      // CHECK SUCCESS
      // =================================================

      if (!response.data?.success) {
        toast.error(
          response.data?.message ||
            "Partner registration failed."
        );

        return;
      }

      // =================================================
      // GET SUBMISSION
      // =================================================

      const submission =
        response.data?.data || {};

      console.log(
        "SUBMISSION DATA:",
        submission
      );

      // =================================================
      // GET PDF URL
      // =================================================

      const generatedPdfUrl =
        submission?.pdfUrl ||
        response.data?.pdfUrl ||
        submission?.pdf?.url ||
        "";

      console.log(
        "GENERATED PDF URL:",
        generatedPdfUrl
      );

      // =================================================
      // SAVE PDF URL
      // =================================================

      setPdfUrl(generatedPdfUrl);

      // =================================================
      // SET SUCCESS
      // =================================================

      setSubmitted(true);

      // =================================================
      // NOTIFY ADMIN
      // =================================================

      notifyAdminDashboard({
        ...submission,
        pdfUrl: generatedPdfUrl,
      });

      // =================================================
      // SUCCESS MESSAGE
      // =================================================

      toast.success(
        response.data?.message ||
          "Partner registration submitted successfully."
      );

      // =================================================
      // CLEAR FORM
      // =================================================

      setFormData({
        companyName: "",
        registrationNumber: "",
        email: "",
        phone: "",
        contactName: "",
        position: "",
        address: "",
      });
    } catch (error) {
      console.error("=================================");
      console.error("PARTNER FORM SUBMIT ERROR");
      console.error("STATUS:", error.response?.status);
      console.error(
        "RESPONSE:",
        error.response?.data
      );
      console.error("ERROR:", error);
      console.error("=================================");

      toast.error(
        error.response?.data?.message ||
          "Failed to submit partner registration."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loadingPartner) {
    return (
      <div className="min-h-screen bg-[#F6F7FB] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-zinc-200 px-8 py-6 text-center">
          <div className="w-8 h-8 border-4 border-zinc-200 border-t-[#102B55] rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-zinc-600 font-medium">
            Loading partner information...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // PARTNER NOT FOUND
  // =====================================================

  if (!partner) {
    return (
      <div className="min-h-screen bg-[#F6F7FB] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-zinc-200 px-8 py-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-[#0F172A]">
            Partner Not Found
          </h2>

          <p className="mt-3 text-zinc-500">
            This partner registration link is
            invalid or the partner is no longer
            active.
          </p>

          <p className="mt-4 text-xs text-zinc-400 break-all">
            Slug: {slug || "Missing"}
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[#F6F7FB] py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* =================================================
            FORM CARD
        ================================================= */}

        <div className="bg-white rounded-3xl shadow-lg border border-zinc-200 overflow-hidden">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="px-6 md:px-10 py-8 border-b border-zinc-200">

            {/* LOGOS */}

            <div className="flex items-center justify-between gap-6">

              {/* GLOZON LOGO */}

              <div className="w-32 h-20 flex items-center">
                <img
                  src="/Logo.png"
                  alt="Glozon FinTax"
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* COMPANY LOGO */}

              <div className="w-32 h-20 flex items-center justify-center">

                {partner.logoUrl ? (
                  <img
                    src={partner.logoUrl}
                    alt={
                      partner.name ||
                      "Company Logo"
                    }
                    className="w-32 h-20 object-contain"
                  />
                ) : (
                  <div className="w-32 h-20 border-2 border-dashed border-zinc-300 rounded-xl flex items-center justify-center">
                    <span className="text-xs text-zinc-400 text-center">
                      No Company Logo
                    </span>
                  </div>
                )}

              </div>
            </div>

            {/* TITLE */}

            <div className="text-center mt-8">

              <h1 className="text-3xl md:text-4xl font-bold text-[#0F172A]">
                Partner Registration
              </h1>

              <p className="mt-3 text-zinc-500">
                Please complete the form below
                to register as a partner.
              </p>

            </div>
          </div>

          {/* =================================================
              SUCCESS PDF SECTION
          ================================================= */}

          {submitted && (
            <div className="mx-6 md:mx-10 mt-8 bg-green-50 border border-green-200 rounded-2xl p-5">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>
                  <h3 className="font-bold text-green-800 text-lg">
                    Registration Submitted Successfully
                  </h3>

                  <p className="text-sm text-green-700 mt-1">
                    Your partner registration has
                    been successfully submitted.
                  </p>
                </div>

                {pdfUrl && (
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-xl bg-[#102B55] text-white px-5 py-3 font-semibold hover:bg-[#0b2142] transition"
                  >
                    View Registration PDF
                  </a>
                )}

              </div>

              {!pdfUrl && (
                <p className="text-sm text-orange-600 mt-3">
                  Registration was submitted, but
                  the PDF URL was not returned by
                  the server.
                </p>
              )}

            </div>
          )}

          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={handleSubmit}
            className="p-6 md:p-10 space-y-8"
          >

            {/* =================================================
                COMPANY INFORMATION
            ================================================= */}

            <section>

              <h2 className="text-xl font-bold text-[#0F172A] mb-5">
                Company Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* COMPANY NAME */}

                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-2">
                    Company Name
                  </label>

                  <input
                    type="text"
                    name="companyName"
                    value={
                      formData.companyName
                    }
                    onChange={handleChange}
                    placeholder="Enter company name"
                    required
                    disabled={submitting}
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:border-[#102B55] focus:ring-2 focus:ring-[#102B55]/10 disabled:bg-zinc-100"
                  />
                </div>

                {/* REGISTRATION NUMBER */}

                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-2">
                    Registration Number
                  </label>

                  <input
                    type="text"
                    name="registrationNumber"
                    value={
                      formData.registrationNumber
                    }
                    onChange={handleChange}
                    placeholder="Enter registration number"
                    disabled={submitting}
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:border-[#102B55] focus:ring-2 focus:ring-[#102B55]/10 disabled:bg-zinc-100"
                  />
                </div>

                {/* EMAIL */}

                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-2">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="company@example.com"
                    required
                    disabled={submitting}
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:border-[#102B55] focus:ring-2 focus:ring-[#102B55]/10 disabled:bg-zinc-100"
                  />
                </div>

                {/* PHONE */}

                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-2">
                    Phone
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    disabled={submitting}
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:border-[#102B55] focus:ring-2 focus:ring-[#102B55]/10 disabled:bg-zinc-100"
                  />
                </div>

              </div>
            </section>

            {/* =================================================
                CONTACT PERSON
            ================================================= */}

            <section>

              <h2 className="text-xl font-bold text-[#0F172A] mb-5">
                Contact Person
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* FULL NAME */}

                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-2">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="contactName"
                    value={
                      formData.contactName
                    }
                    onChange={handleChange}
                    placeholder="Contact person's name"
                    disabled={submitting}
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:border-[#102B55] focus:ring-2 focus:ring-[#102B55]/10 disabled:bg-zinc-100"
                  />
                </div>

                {/* POSITION */}

                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-2">
                    Position
                  </label>

                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="e.g. Director"
                    disabled={submitting}
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:border-[#102B55] focus:ring-2 focus:ring-[#102B55]/10 disabled:bg-zinc-100"
                  />
                </div>

              </div>
            </section>

            {/* =================================================
                COMPANY ADDRESS
            ================================================= */}

            <section>

              <h2 className="text-xl font-bold text-[#0F172A] mb-5">
                Company Address
              </h2>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={4}
                placeholder="Enter company address"
                disabled={submitting}
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:border-[#102B55] focus:ring-2 focus:ring-[#102B55]/10 disabled:bg-zinc-100"
              />

            </section>

            {/* =================================================
                SUBMIT
            ================================================= */}

            <div className="flex justify-end pt-4">

              <button
                type="submit"
                disabled={submitting}
                className="w-full md:w-auto rounded-xl bg-[#102B55] text-white px-8 py-3 font-semibold hover:bg-[#0b2142] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Partner Registration"}
              </button>

            </div>

          </form>
        </div>

        {/* =================================================
            PARTNER INFORMATION
        ================================================= */}

        <p className="text-center text-xs text-zinc-400 mt-4">
          Partner: {partner.name}
        </p>

      </div>
    </div>
  );
}