import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../API/Api";
import { buildGfaTaxAuthorityPdfBlob } from "../utils/gfaTaxAuthorityPdf.js";
import { toast } from "react-toastify";

// ==========================================
// STYLES
// ==========================================

const inputClass =
  "w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors bg-white text-gray-800";

const labelClass =
  "block text-sm font-semibold text-gray-800 mb-1.5";

const sectionTitle =
  "text-lg font-bold text-blue-800 border-b-2 border-blue-600 pb-2 mb-6";

const tableInputClass =
  "w-full px-3 py-2 border border-gray-300 rounded-sm bg-white text-gray-800 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors";

// ==========================================
// DEFAULT SETTINGS
// ==========================================

const DEFAULT_ONBOARDING_DESCRIPTION =
  "Complete the form below.";

const DEFAULT_DECLARATION = `I declare that the information provided above is true and correct to the best of my knowledge and belief.

I authorize Glozon FinTax & Advisory Pvt. Ltd. to act on my behalf in relation to my taxation and accounting affairs.`;

// ==========================================
// INITIAL FORM DATA
// ==========================================

const INITIAL_FORM_DATA = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  address: "",
  country: "",
  gender: "",
  maritalStatus: "",
  occupation: "",
  visaType: "",
  investmentTrading: "",
  hasAbn: "",
  businessType: "individual",
  panId: "",
  dob: "",
  corporateId: "",
  signatureName: "",
  signatureDate: "",
  signatureUrl: "",
  pdfUrl: "",
};

// ==========================================
// AUTHORITY TO ACT
// ==========================================

const AUTHORITY_STATEMENTS = [
  "Add my details to the Tax Agent Portal.",
  "Access, manage, and update my ATO records.",
  "Lodge my Income Tax Returns (current and prior years).",
  "Lodge any overdue obligations and correct historical errors.",
  "Receive ATO correspondence on my behalf.",
  "Communicate with the ATO as required in relation to my tax affairs.",
];

// ==========================================
// INFO ROW
// ==========================================

function InfoRow({
  label,
  required,
  striped,
  children,
}) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-[200px_1fr] ${
        striped ? "bg-gray-50" : "bg-white"
      } border-b border-gray-200 last:border-b-0`}
    >
      <div className="px-4 py-3 flex items-center text-sm font-semibold text-gray-800 sm:border-r border-gray-200">
        {label}
      </div>

      <div className="px-4 py-3 flex items-center gap-2">
        <div className="flex-1 min-w-0">
          {children}
        </div>

        {required && (
          <span className="text-red-500 font-bold shrink-0">
            *
          </span>
        )}
      </div>
    </div>
  );
}

// ==========================================
// SIGNATURE FIELD
// ==========================================

function SignatureField({ onSignatureChange }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const lastPoint = useRef(null);

  const resetCanvas = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    canvas.width = canvas.offsetWidth || 600;
    canvas.height = 160;

    const ctx = canvas.getContext("2d");

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#1e3a8a";
    ctx.lineWidth = 2;

    onSignatureChange({
      dataUrl: "",
      hasInk: false,
    });
  }, [onSignatureChange]);

  useEffect(() => {
    resetCanvas();
  }, [resetCanvas]);

  const getPoint = (e) => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return {
        x: 0,
        y: 0,
      };
    }

    const rect = canvas.getBoundingClientRect();

    const clientX =
      e.touches?.[0]?.clientX ?? e.clientX;

    const clientY =
      e.touches?.[0]?.clientY ?? e.clientY;

    return {
      x:
        ((clientX - rect.left) / rect.width) *
        canvas.width,

      y:
        ((clientY - rect.top) / rect.height) *
        canvas.height,
    };
  };

  const start = (e) => {
    e.preventDefault();

    drawing.current = true;
    lastPoint.current = getPoint(e);
  };

  const move = (e) => {
    e.preventDefault();

    if (
      !drawing.current ||
      !canvasRef.current ||
      !lastPoint.current
    ) {
      return;
    }

    const ctx =
      canvasRef.current.getContext("2d");

    const p = getPoint(e);

    ctx.beginPath();

    ctx.moveTo(
      lastPoint.current.x,
      lastPoint.current.y
    );

    ctx.lineTo(p.x, p.y);

    ctx.stroke();

    lastPoint.current = p;

    onSignatureChange({
      dataUrl:
        canvasRef.current.toDataURL("image/png"),
      hasInk: true,
    });
  };

  const end = () => {
    drawing.current = false;
    lastPoint.current = null;
  };

  return (
    <div>
      <p className={`${labelClass} mb-2`}>
        Signature box (mouse or touch)
      </p>

      <motion.div className="border-2 border-dashed border-gray-300 rounded-sm bg-gray-50 overflow-hidden">
        <canvas
          id="canvas"
          ref={canvasRef}
          className="w-full h-40 touch-none cursor-crosshair block"
          onMouseDown={start}
          onMouseMove={move}
          onMouseUp={end}
          onMouseLeave={end}
          onTouchStart={start}
          onTouchMove={move}
          onTouchEnd={end}
        />
      </motion.div>

      <button
        type="button"
        onClick={resetCanvas}
        className="mt-2 text-sm font-semibold text-blue-600 hover:text-blue-800 underline"
      >
        Clear signature
      </button>
    </div>
  );
}

// ==========================================
// CLIENT ONBOARDING FORM
// ==========================================

export default function ClientOnboardingForm() {
  const [signature, setSignature] = useState({
    dataUrl: "",
    hasInk: false,
  });

  const [signatureKey, setSignatureKey] =
    useState(0);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  // ==========================================
  // SETTINGS
  // ==========================================

  const [
    onboardingDescription,
    setOnboardingDescription,
  ] = useState(
    DEFAULT_ONBOARDING_DESCRIPTION
  );

  const [
    declaration,
    setDeclaration,
  ] = useState(DEFAULT_DECLARATION);

  const [
    loadingSettings,
    setLoadingSettings,
  ] = useState(true);

  // ==========================================
  // FORM DATA
  // ==========================================

  const [formData, setFormData] = useState(
    INITIAL_FORM_DATA
  );

  // ==========================================
  // AUTHORITY CONFIRMATION
  // ==========================================

  const [
    authorityConfirmed,
    setAuthorityConfirmed,
  ] = useState(false);

  // ==========================================
  // FETCH SETTINGS
  // ==========================================

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await API.get("/settings");

        console.log(
          "SETTINGS RESPONSE:",
          res.data
        );

        if (res.data) {
          setOnboardingDescription(
            res.data.onboardingDescription?.trim()
              ? res.data.onboardingDescription
              : DEFAULT_ONBOARDING_DESCRIPTION
          );

          setDeclaration(
            res.data.declaration?.trim()
              ? res.data.declaration
              : DEFAULT_DECLARATION
          );
        }
      } catch (error) {
        console.error(
          "Error fetching settings:",
          error
        );

        setOnboardingDescription(
          DEFAULT_ONBOARDING_DESCRIPTION
        );

        setDeclaration(
          DEFAULT_DECLARATION
        );
      } finally {
        setLoadingSettings(false);
      }
    };

    fetchSettings();
  }, []);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // HANDLE BUSINESS TYPE
  // ==========================================

  const handleBusinessTypeChange = (e) => {
    const { value } = e.target;

    setFormData((prev) => ({
      ...prev,

      businessType: value,

      // ------------------------------------------
      // IMPORTANT:
      // DO NOT SET OCCUPATION TO NULL
      // ------------------------------------------

      occupation:
        value === "company"
          ? prev.occupation || "Business Owner"
          : prev.occupation,

      // ------------------------------------------
      // ENTITY:
      // Clear individual-only fields
      // ------------------------------------------

      gender:
        value === "company"
          ? ""
          : prev.gender,

      maritalStatus:
        value === "company"
          ? ""
          : prev.maritalStatus,

      dob:
        value === "company"
          ? ""
          : prev.dob,

      // ------------------------------------------
      // INDIVIDUAL:
      // Clear entity-only field
      // ------------------------------------------

      corporateId:
        value === "individual"
          ? ""
          : prev.corporateId,
    }));
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(
      "================================="
    );

    console.log(
      "ONBOARDING FORM SUBMIT"
    );

    console.log(
      "FORM DATA:",
      formData
    );

    console.log(
      "================================="
    );

    const form = e.currentTarget;

    const canvas =
      document.getElementById("canvas");

    // ==========================================
    // CHECK FORM VALIDITY
    // ==========================================

    if (!form.checkValidity()) {
      form.reportValidity();

      toast.error(
        "Please complete all required fields."
      );

      return;
    }

    // ==========================================
    // CHECK OCCUPATION
    // ==========================================

    const finalOccupation =
      formData.occupation?.trim() ||
      "Business Owner";

    if (!finalOccupation) {
      toast.error(
        "Occupation is required."
      );

      return;
    }

    // ==========================================
    // CHECK AUTHORITY
    // ==========================================

    if (!authorityConfirmed) {
      toast.error(
        "Please confirm the authority to act statements before submitting."
      );

      return;
    }

    // ==========================================
    // CHECK SIGNATURE
    // ==========================================

    if (!signature.hasInk) {
      toast.error(
        "Please sign in the signature box before submitting."
      );

      return;
    }

    if (!canvas) {
      toast.error(
        "Signature canvas not found."
      );

      return;
    }

    setIsSubmitting(true);

    // ==========================================
    // CONVERT CANVAS TO BLOB
    // ==========================================

    canvas.toBlob(async (blob) => {
      try {
        if (!blob) {
          throw new Error(
            "Could not create signature image."
          );
        }

        // ==========================================
        // SIGNATURE FORM DATA
        // ==========================================

        const signatureForm =
          new FormData();

        signatureForm.append(
          "signatureImg",
          blob,
          "signature.png"
        );

        // ==========================================
        // SIGNATURE DATA URL
        // ==========================================

        const signatureDataUrl =
          canvas.toDataURL(
            "image/png",
            0.7
          );

        // ==========================================
        // CREATE PDF
        // ==========================================

        const pdfBlob =
          await buildGfaTaxAuthorityPdfBlob(
            {
              ...formData,

              // IMPORTANT:
              // PDF also gets occupation
              occupation: finalOccupation,
            },
            signatureDataUrl,
            declaration
          );

        if (!pdfBlob) {
          throw new Error(
            "Could not generate PDF."
          );
        }

        // ==========================================
        // PDF FORM DATA
        // ==========================================

        const pdfForm =
          new FormData();

        const pdfFileName =
          parseInt(
            Math.random() * 10000000
          ).toString() +
          Date.now().toString() +
          ".pdf";

        pdfForm.append(
          "pdf",
          pdfBlob,
          pdfFileName
        );

        // ==========================================
        // UPLOAD SIGNATURE
        // ==========================================

        console.log(
          "Uploading signature..."
        );

        const signatureResponse =
          await API.post(
            "/onboarding/upload",
            signatureForm
          );

        console.log(
          "SIGNATURE UPLOAD RESPONSE:",
          signatureResponse.data
        );

        // ==========================================
        // UPLOAD PDF
        // ==========================================

        console.log(
          "Uploading PDF..."
        );

        const pdfResponse =
          await API.post(
            "/onboarding/pdfUpload",
            pdfForm
          );

        console.log(
          "PDF UPLOAD RESPONSE:",
          pdfResponse.data
        );

        // ==========================================
        // GET URLS
        // ==========================================

        const signatureUrl =
          signatureResponse?.data?.url ||
          "";

        const pdfUrl =
          pdfResponse?.data?.url ||
          "";

        // ==========================================
        // FINAL ONBOARDING DATA
        // ==========================================

        const onboardingData = {
          // ------------------------------------------
          // ALL FORM DATA
          // ------------------------------------------

          ...formData,

          // ------------------------------------------
          // OCCUPATION MUST NEVER BE NULL
          // ------------------------------------------

          occupation:
            finalOccupation,

          // ------------------------------------------
          // INDIVIDUAL-ONLY FIELDS
          // ------------------------------------------

          gender:
            formData.businessType === "company"
              ? null
              : formData.gender || null,

          maritalStatus:
            formData.businessType === "company"
              ? null
              : formData.maritalStatus || null,

          dob:
            formData.businessType === "company"
              ? null
              : formData.dob || null,

          // ------------------------------------------
          // COMMON FIELDS
          // (visaType is now OPTIONAL)
          // ------------------------------------------

          visaType:
            formData.visaType?.trim() || null,

          investmentTrading:
            formData.investmentTrading?.trim() ||
            null,

          hasAbn:
            formData.hasAbn?.trim() || null,

          // ------------------------------------------
          // BUSINESS TYPE
          // ------------------------------------------

          businessType:
            formData.businessType === "company"
              ? "company"
              : "individual",

          // ------------------------------------------
          // TAX ID
          // ------------------------------------------

          panId:
            formData.panId?.trim() || null,

          // ------------------------------------------
          // CORPORATE ID
          // ------------------------------------------

          corporateId:
            formData.businessType === "company"
              ? formData.corporateId?.trim() ||
                null
              : null,

          // ------------------------------------------
          // SIGNATURE
          // ------------------------------------------

          signatureName:
            formData.signatureName?.trim() ||
            null,

          signatureDate:
            formData.signatureDate || null,

          // ------------------------------------------
          // UPLOADED FILE URLS
          // ------------------------------------------

          signatureUrl,

          pdfUrl,
        };

        // ==========================================
        // DEBUG DATA
        // ==========================================

        console.log(
          "================================="
        );

        console.log(
          "DATA BEING SENT TO BACKEND:"
        );

        console.log(
          JSON.stringify(
            onboardingData,
            null,
            2
          )
        );

        console.log(
          "OCCUPATION:",
          onboardingData.occupation
        );

        console.log(
          "VISA TYPE:",
          onboardingData.visaType
        );

        console.log(
          "INVESTMENT TRADING:",
          onboardingData.investmentTrading
        );

        console.log(
          "HAS ABN:",
          onboardingData.hasAbn
        );

        console.log(
          "================================="
        );

        // ==========================================
        // SAVE ONBOARDING
        // ==========================================

        const onboardingResponse =
          await API.post(
            "/onboarding",
            onboardingData
          );

        console.log(
          "ONBOARDING RESPONSE:",
          onboardingResponse.data
        );

        // ==========================================
        // RESET FORM
        // ==========================================

        setFormData({
          ...INITIAL_FORM_DATA,
        });

        form.reset();

        setSignature({
          dataUrl: "",
          hasInk: false,
        });

        setSignatureKey(
          (key) => key + 1
        );

        setAuthorityConfirmed(false);

        // ==========================================
        // SUCCESS
        // ==========================================

        toast.success(
          "Application submitted successfully"
        );

      } catch (error) {
        console.error(
          "================================="
        );

        console.error(
          "ONBOARDING SUBMIT ERROR:",
          error
        );

        console.error(
          "ERROR RESPONSE:",
          error?.response?.data
        );

        console.error(
          "================================="
        );

        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Error occurred while submitting the application."
        );

      } finally {
        setIsSubmitting(false);
      }
    });
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-50 pb-20">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="bg-gradient-to-b from-blue-900 to-blue-800 py-12 text-white md:py-16">

        <div className="container mx-auto max-w-4xl px-4 text-center">

          <motion.p
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-2 text-sm uppercase tracking-widest text-blue-200"
          >
            Glozon FinTax & Advisory
          </motion.p>

          <motion.h1
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-3 text-3xl font-bold md:text-4xl"
          >
            Tax Authority Form
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            className="mx-auto max-w-2xl text-lg text-blue-100 whitespace-pre-line"
          >
            {loadingSettings
              ? "Loading..."
              : onboardingDescription}
          </motion.p>

        </div>
      </div>

      {/* ==========================================
          FORM CONTAINER
      ========================================== */}

      <div className="container relative z-10 mx-auto -mt-8 max-w-3xl px-4">

        {/* ==========================================
            BREADCRUMB
        ========================================== */}

        <nav className="mb-4 inline-block rounded-sm bg-white/90 px-3 py-2 text-sm text-gray-600 shadow-sm backdrop-blur">

          <Link
            to="/"
            className="hover:text-blue-600"
          >
            Home
          </Link>

          <span className="mx-2 text-gray-400">
            ›
          </span>

          <span className="font-medium text-gray-800">
            Client onboarding
          </span>

        </nav>

        {/* ==========================================
            FORM CARD
        ========================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="overflow-hidden rounded-sm border border-gray-100 bg-white shadow-xl"
        >

          <form
            onSubmit={handleSubmit}
            className="space-y-10 px-6 py-8 md:px-10 md:py-10"
          >

            {/* ==========================================
                YOUR INFORMATION
            ========================================== */}

            <fieldset disabled={isSubmitting}>

              <h3 className={sectionTitle}>
                Your information
              </h3>

              <div className="overflow-hidden rounded-sm border border-gray-300 shadow-sm">

                {/* FIRST NAME */}

                <InfoRow
                  label="First name"
                  required
                >
                  <input
                    name="firstName"
                    value={
                      formData.firstName
                    }
                    onChange={
                      handleChange
                    }
                    required
                    className={
                      tableInputClass
                    }
                  />
                </InfoRow>

                {/* LAST NAME */}

                <InfoRow
                  label="Last name"
                  required
                  striped
                >
                  <input
                    name="lastName"
                    value={
                      formData.lastName
                    }
                    onChange={
                      handleChange
                    }
                    required
                    className={
                      tableInputClass
                    }
                  />
                </InfoRow>

                {/* GENDER (right after last name) */}

                {formData.businessType ===
                  "individual" && (
                  <InfoRow
                    label="Gender"
                    required
                  >
                    <select
                      name="gender"
                      value={
                        formData.gender
                      }
                      onChange={
                        handleChange
                      }
                      required
                      className={
                        tableInputClass
                      }
                    >
                      <option value="">
                        Select Gender
                      </option>

                      <option value="Male">
                        Male
                      </option>

                      <option value="Female">
                        Female
                      </option>

                      <option value="Other">
                        Other
                      </option>
                    </select>
                  </InfoRow>
                )}

                {/* MARITAL STATUS (right after gender) */}

                {formData.businessType ===
                  "individual" && (
                  <InfoRow
                    label="Marital status"
                    required
                    striped
                  >
                    <select
                      name="maritalStatus"
                      value={
                        formData.maritalStatus
                      }
                      onChange={
                        handleChange
                      }
                      required
                      className={
                        tableInputClass
                      }
                    >
                      <option value="">
                        Select
                      </option>

                      <option value="Single">
                        Single
                      </option>

                      <option value="Married">
                        Married
                      </option>

                      <option value="Divorced">
                        Divorced
                      </option>
                    </select>
                  </InfoRow>
                )}

                {/* EMAIL */}

                <InfoRow
                  label="Email"
                  required
                >
                  <input
                    type="email"
                    name="email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    required
                    className={
                      tableInputClass
                    }
                  />
                </InfoRow>

                {/* PHONE */}

                <InfoRow
                  label="Contact no."
                  required
                  striped
                >
                  <input
                    name="phoneNumber"
                    value={
                      formData.phoneNumber
                    }
                    onChange={
                      handleChange
                    }
                    required
                    className={
                      tableInputClass
                    }
                  />
                </InfoRow>

                {/* ADDRESS */}

                <InfoRow
                  label="Residential address"
                  required
                >
                  <input
                    name="address"
                    value={
                      formData.address
                    }
                    onChange={
                      handleChange
                    }
                    required
                    className={
                      tableInputClass
                    }
                  />
                </InfoRow>

                {/* COUNTRY */}

                <InfoRow
                  label="Country"
                  required
                  striped
                >
                  <input
                    name="country"
                    value={
                      formData.country
                    }
                    onChange={
                      handleChange
                    }
                    required
                    className={
                      tableInputClass
                    }
                  />
                </InfoRow>

                {/* OCCUPATION */}

                <InfoRow
                  label="Occupation"
                  required
                >
                  <input
                    type="text"
                    name="occupation"
                    value={
                      formData.occupation
                    }
                    onChange={
                      handleChange
                    }
                    required
                    placeholder={
                      formData.businessType ===
                      "company"
                        ? "Business Owner"
                        : "Chef, Registered Nurse, Dentist, etc."
                    }
                    className={
                      tableInputClass
                    }
                  />
                </InfoRow>

                {/* VISA TYPE / STATUS (OPTIONAL) */}

                <InfoRow
                  label="Visa Type / Status"
                  striped
                >
                  <select
                    name="visaType"
                    value={
                      formData.visaType
                    }
                    onChange={
                      handleChange
                    }
                    className={
                      tableInputClass
                    }
                  >
                    <option value="">
                      Select Visa Type / Status (optional)
                    </option>

                    <option value="Student Visa">
                      Student Visa
                    </option>

                    <option value="Bridging Visa">
                      Bridging Visa
                    </option>

                    <option value="TR-Temporary VISA">
                      TR-Temporary VISA
                    </option>

                    <option value="Australia Citizenship">
                      Australia Citizenship
                    </option>

                    <option value="PR-Permanent VISA">
                      PR-Permanent VISA
                    </option>

                    <option value="Other Type">
                      Other Type
                    </option>
                  </select>
                </InfoRow>

                {/* INVESTMENT TRADING */}

                <InfoRow
                  label="Did you trade in shares, crypto, or other investments?"
                  required
                >
                  <select
                    name="investmentTrading"
                    value={
                      formData.investmentTrading
                    }
                    onChange={
                      handleChange
                    }
                    required
                    className={
                      tableInputClass
                    }
                  >
                    <option value="">
                      Select
                    </option>

                    <option value="Yes">
                      Yes
                    </option>

                    <option value="No">
                      No
                    </option>
                  </select>
                </InfoRow>

                {/* ABN */}

                <InfoRow
                  label="Do you have ABN?"
                  required
                  striped
                >
                  <select
                    name="hasAbn"
                    value={
                      formData.hasAbn
                    }
                    onChange={
                      handleChange
                    }
                    required
                    className={
                      tableInputClass
                    }
                  >
                    <option value="">
                      Select
                    </option>

                    <option value="Yes">
                      Yes
                    </option>

                    <option value="No">
                      No
                    </option>
                  </select>
                </InfoRow>

              </div>

            </fieldset>

            {/* ==========================================
                BUSINESS TYPE
            ========================================== */}

            <fieldset disabled={isSubmitting}>

              <section>

                <h3 className={sectionTitle}>
                  Type of business
                </h3>

                <div className="space-y-3 text-gray-800">

                  {/* INDIVIDUAL */}

                  <label className="flex items-center gap-3 cursor-pointer">

                    <input
                      type="radio"
                      name="businessType"
                      value="individual"
                      checked={
                        formData.businessType ===
                        "individual"
                      }
                      onChange={
                        handleBusinessTypeChange
                      }
                    />

                    Individual

                  </label>

                  {/* ENTITY (formerly "Company") */}

                  <label className="flex items-center gap-3 cursor-pointer">

                    <input
                      type="radio"
                      name="businessType"
                      value="company"
                      checked={
                        formData.businessType ===
                        "company"
                      }
                      onChange={
                        handleBusinessTypeChange
                      }
                    />

                    Entity

                  </label>

                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2">

                  {/* INDIVIDUAL */}

                  {formData.businessType ===
                  "individual" ? (
                    <>

                      {/* TFN / PAN */}

                      <div>

                        <label
                          className={
                            labelClass
                          }
                        >
                          TFN / PAN / Tax ID *
                        </label>

                        <input
                          required
                          className={
                            inputClass
                          }
                          name="panId"
                          value={
                            formData.panId
                          }
                          onChange={
                            handleChange
                          }
                        />

                      </div>

                      {/* DOB */}

                      <div>

                        <label
                          className={
                            labelClass
                          }
                        >
                          Date of birth *
                        </label>

                        <input
                          type="date"
                          required
                          className={
                            inputClass
                          }
                          name="dob"
                          value={
                            formData.dob
                          }
                          onChange={
                            handleChange
                          }
                        />

                      </div>

                    </>
                  ) : (

                    /* ENTITY */

                    <>

                      {/* CORPORATE ID */}

                      <div>

                        <label
                          className={
                            labelClass
                          }
                        >
                          ABN / Corporate ID *
                        </label>

                        <input
                          required
                          name="corporateId"
                          value={
                            formData.corporateId
                          }
                          onChange={
                            handleChange
                          }
                          className={
                            inputClass
                          }
                        />

                      </div>

                      {/* ENTITY TAX ID */}

                      <div>

                        <label
                          className={
                            labelClass
                          }
                        >
                          TFN / PAN / Tax ID *
                        </label>

                        <input
                          required
                          name="panId"
                          value={
                            formData.panId
                          }
                          onChange={
                            handleChange
                          }
                          className={
                            inputClass
                          }
                        />

                      </div>

                    </>
                  )}

                </div>

              </section>

            </fieldset>

            {/* ==========================================
                AUTHORITY TO ACT
            ========================================== */}

            <fieldset disabled={isSubmitting}>

              <section>

                <h3 className={sectionTitle}>
                  Authority to act
                </h3>

                <div className="space-y-3 text-sm text-gray-700">

                  {AUTHORITY_STATEMENTS.map(
                    (statement, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2"
                      >

                        <span className="text-gray-800 font-medium shrink-0">
                          ✓
                        </span>

                        <span>
                          {statement}
                        </span>

                      </div>
                    )
                  )}

                </div>

                <label className="mt-6 flex items-start gap-3 cursor-pointer text-sm text-gray-800">

                  <input
                    type="checkbox"
                    checked={
                      authorityConfirmed
                    }
                    onChange={(e) =>
                      setAuthorityConfirmed(
                        e.target.checked
                      )
                    }
                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-blue-700"
                  />

                  <span>
                    I confirm the authority to act
                    statements above.
                  </span>

                </label>

              </section>

            </fieldset>

            {/* ==========================================
                DECLARATION
            ========================================== */}

            <fieldset disabled={isSubmitting}>

              <section>

                <h3 className={sectionTitle}>
                  Declaration
                </h3>

                <div className="space-y-4 rounded-sm border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-gray-700 whitespace-pre-line">

                  {loadingSettings
                    ? "Loading declaration..."
                    : declaration}

                </div>

              </section>

            </fieldset>

            {/* ==========================================
                SIGNATURE
            ========================================== */}

            <fieldset disabled={isSubmitting}>

              <section>

                <h3 className={sectionTitle}>
                  Sign
                </h3>

                <SignatureField
                  key={signatureKey}
                  onSignatureChange={
                    setSignature
                  }
                />

                <div className="mt-6 grid gap-5 md:grid-cols-2">

                  {/* SIGNATURE NAME */}

                  <div>

                    <label
                      className={
                        labelClass
                      }
                    >
                      Name *
                    </label>

                    <input
                      required
                      className={
                        inputClass
                      }
                      onChange={
                        handleChange
                      }
                      name="signatureName"
                      value={
                        formData.signatureName
                      }
                    />

                  </div>

                  {/* SIGNATURE DATE */}

                  <div>

                    <label
                      className={
                        labelClass
                      }
                    >
                      Date *
                    </label>

                    <input
                      type="date"
                      onChange={
                        handleChange
                      }
                      name="signatureDate"
                      value={
                        formData.signatureDate
                      }
                      required
                      className={
                        inputClass
                      }
                    />

                  </div>

                </div>

              </section>

            </fieldset>

            {/* ==========================================
                SUBMIT
            ========================================== */}

            <div className="pt-2">

              <button
                type="submit"
                disabled={
                  isSubmitting
                }
                className="w-full rounded-sm bg-orange-500 px-10 py-4 font-bold uppercase tracking-wide text-white shadow-lg transition-colors hover:bg-orange-600 disabled:pointer-events-none disabled:opacity-60 md:w-auto"
              >

                {isSubmitting
                  ? "Submitting…"
                  : "Submit form"}

              </button>

            </div>

          </form>

        </motion.div>

      </div>

    </div>
  );
}