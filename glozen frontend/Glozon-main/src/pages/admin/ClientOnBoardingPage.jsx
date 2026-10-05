import React, { useState, useEffect } from "react";
import {
  Eye,
  Trash2,
  Search,
  FileText,
  Download,
  ShieldCheck,
  XCircle,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import * as XLSX from "xlsx";
import toast from "react-hot-toast";

import API from "../../API/Api";

const ClientOnboardingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [businessFilter, setBusinessFilter] = useState("All");

  const [selectedForm, setSelectedForm] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [forms, setForms] = useState([]);

  const [selectedIds, setSelectedIds] = useState([]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // =====================================================
  // FETCH ONBOARDING FORMS
  // =====================================================

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    setIsLoading(true);

    try {
      const res = await API.get("/onboarding", {
        headers: {
          Authorization:
            "Bearer " + localStorage.getItem("token"),
        },
      });

      console.log("ONBOARDING RESPONSE:", res.data);

      setForms(
        Array.isArray(res.data.data)
          ? res.data.data
          : []
      );
    } catch (error) {
      console.error(
        "Failed to fetch forms:",
        error
      );

      setForms([]);

      toast.error(
        error?.response?.data?.message ||
          "Failed to load onboarding submissions."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =====================================================
  // BUSINESS TYPE HELPERS
  // =====================================================

  const getBusinessType = (form) => {
    return String(form?.businessType || "")
      .trim()
      .toLowerCase();
  };

  const isIndividual = (form) => {
    const type = getBusinessType(form);

    return type === "individual";
  };

  const isEntity = (form) => {
    const type = getBusinessType(form);

    return (
      type === "entity" ||
      type === "company" ||
      type === "corporate" ||
      type === "partnership" ||
      type === "trust"
    );
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDeleteClick = (formId) => {
    setDeletingId(formId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;

    setIsDeleting(true);

    try {
      await API.delete(
        "/onboarding/" + deletingId,
        {
          headers: {
            Authorization:
              "Bearer " +
              localStorage.getItem("token"),
          },
        }
      );

      setForms((prev) =>
        prev.filter(
          (form) => form.id !== deletingId
        )
      );

      setSelectedIds((prev) =>
        prev.filter(
          (id) => id !== deletingId
        )
      );

      toast.success(
        "Client submission deleted successfully."
      );
    } catch (error) {
      console.error(
        "Failed to delete form:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to delete client submission."
      );
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setDeletingId(null);
    }
  };

  // =====================================================
  // SELECT ONE
  // =====================================================

  const handleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter(
            (selectedId) =>
              selectedId !== id
          )
        : [...prev, id]
    );
  };

  // =====================================================
  // SELECT ALL
  // =====================================================

  const handleSelectAll = () => {
    if (
      selectedIds.length ===
        filteredForms.length &&
      filteredForms.length > 0
    ) {
      setSelectedIds([]);
    } else {
      setSelectedIds(
        filteredForms.map(
          (form) => form.id
        )
      );
    }
  };

  // =====================================================
  // VIEW DETAILS
  // =====================================================

  const handleViewDetails = (form) => {
    console.log(
      "SELECTED FORM:",
      form
    );

    setSelectedForm(form);
    setIsViewModalOpen(true);
  };

  // =====================================================
  // VIEW PDF
  // =====================================================

  const handleViewPDF = (e, form) => {
    e.stopPropagation();

    const pdfUrl =
      form.oneDriveUrl ||
      form.pdfUrl ||
      form.pdf ||
      form.documentUrl;

    if (!pdfUrl || pdfUrl === "#") {
      toast.error(
        "PDF file not available."
      );
      return;
    }

    window.open(
      pdfUrl,
      "_blank"
    );
  };

  // =====================================================
  // FILTER
  // =====================================================

  const filteredForms = forms
    .filter((form) => {
      if (businessFilter === "All") {
        return true;
      }

      const type =
        getBusinessType(form);

      if (
        businessFilter ===
        "Individual"
      ) {
        return (
          type === "individual"
        );
      }

      if (
        businessFilter === "Entity"
      ) {
        return (
          type === "entity" ||
          type === "company" ||
          type === "corporate" ||
          type === "partnership" ||
          type === "trust"
        );
      }

      return true;
    })
    .filter((form) => {
      const search =
        searchTerm.toLowerCase();

      return (
        (form.firstName || "")
          .toLowerCase()
          .includes(search) ||
        (form.lastName || "")
          .toLowerCase()
          .includes(search) ||
        (form.email || "")
          .toLowerCase()
          .includes(search) ||
        (form.taxId || "")
          .toLowerCase()
          .includes(search) ||
        (form.panId || "")
          .toLowerCase()
          .includes(search) ||
        (form.signerName || "")
          .toLowerCase()
          .includes(search) ||
        (form.signatureName || "")
          .toLowerCase()
          .includes(search) ||
        (form.companyName || "")
          .toLowerCase()
          .includes(search) ||
        (form.entityName || "")
          .toLowerCase()
          .includes(search) ||
        (form.legalName || "")
          .toLowerCase()
          .includes(search)
      );
    });

  // =====================================================
  // EXPORT EXCEL
  // =====================================================

  const exportToExcel = () => {
    if (selectedIds.length === 0) {
      toast.warning(
        "Please select at least one client to export."
      );
      return;
    }

    const selectedForms =
      filteredForms.filter((form) =>
        selectedIds.includes(
          form.id
        )
      );

    const excelData =
      selectedForms.map(
        (form, index) => ({
          SN: index + 1,

          "Business Type":
            isIndividual(form)
              ? "Individual"
              : "Entity",

          "First Name":
            form.firstName || "",

          "Last Name":
            form.lastName || "",

          "Company / Entity Name":
            form.companyName ||
            form.entityName ||
            form.legalName ||
            "",

          Email:
            form.email || "",

          Phone:
            form.phoneNumber ||
            form.phone ||
            "",

          Country:
            form.country || "",

          "Tax ID":
            form.taxId ||
            form.panId ||
            "",

          "Corporate ID":
            form.corporateId ||
            form.companyId ||
            "",

          "Authority Accepted":
            form.checked ||
            form.authorityAccepted
              ? "Yes"
              : "No",

          "Signer Name":
            form.signerName ||
            form.signatureName ||
            "",

          "Sign Date":
            form.signDate ||
            form.signatureDate ||
            "",

          "Created At":
            form.createdAt
              ? new Date(
                  form.createdAt
                ).toLocaleString()
              : "",
        })
      );

    const worksheet =
      XLSX.utils.json_to_sheet(
        excelData
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Client Submissions"
    );

    XLSX.writeFile(
      workbook,
      "Selected_Client_Submissions.xlsx"
    );

    toast.success(
      "Excel file exported successfully."
    );
  };

  // =====================================================
  // GET DISPLAY NAME
  // =====================================================

  const getDisplayName = (form) => {
    if (isEntity(form)) {
      return (
        form.companyName ||
        form.entityName ||
        form.legalName ||
        `${form.firstName || ""} ${
          form.lastName || ""
        }`.trim() ||
        "N/A"
      );
    }

    return (
      `${form.firstName || ""} ${
        form.lastName || ""
      }`.trim() || "N/A"
    );
  };

  // =====================================================
  // GET TAX ID
  // =====================================================

  const getTaxId = (form) => {
    return (
      form.taxId ||
      form.panId ||
      form.tfn ||
      form.taxIdentificationNumber ||
      "N/A"
    );
  };

  // =====================================================
  // GET SIGNATURE
  // =====================================================

  const getSignature = (form) => {
    return (
      form.signature ||
      form.signatureUrl ||
      form.signatureImg ||
      ""
    );
  };

  // =====================================================
  // GET SIGNER
  // =====================================================

  const getSignerName = (form) => {
    return (
      form.signerName ||
      form.signatureName ||
      "N/A"
    );
  };

  // =====================================================
  // GET SIGN DATE
  // =====================================================

  const getSignDate = (form) => {
    return (
      form.signDate ||
      form.signatureDate ||
      (form.createdAt
        ? new Date(
            form.createdAt
          ).toLocaleDateString()
        : "N/A")
    );
  };

  // =====================================================
  // MARK AS CHECKED
  // =====================================================

  const handleMarkAsChecked =
    async () => {
      if (!selectedForm?.id) {
        toast.error(
          "Client submission not found."
        );
        return;
      }

      try {
        await API.put(
          "/onboarding/" +
            selectedForm.id,
          {},
          {
            headers: {
              Authorization:
                "Bearer " +
                localStorage.getItem(
                  "token"
                ),
            },
          }
        );

        setForms((prev) =>
          prev.map((item) =>
            item.id ===
            selectedForm.id
              ? {
                  ...item,
                  checked: true,
                  authorityAccepted:
                    true,
                }
              : item
          )
        );

        setSelectedForm((prev) => ({
          ...prev,
          checked: true,
          authorityAccepted: true,
        }));

        toast.success(
          "Client submission marked as checked successfully."
        );
      } catch (error) {
        console.error(
          "Failed to mark submission as checked:",
          error
        );

        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to mark submission as checked."
        );
      }
    };

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="space-y-6"
    >
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">
            Client Declaration Forms
          </h1>

          <p className="text-zinc-500 mt-1">
            Detailed management of
            onboarding submissions
            and digital signatures.
          </p>
        </div>

        <button
          onClick={exportToExcel}
          className="inline-flex items-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 text-white px-4 py-3 text-sm font-semibold transition shadow-sm"
        >
          <Download className="w-4 h-4" />

          Export{" "}
          {selectedIds.length > 0
            ? `${selectedIds.length} Selected`
            : "Excel"}
        </button>
      </div>

      {/* ================================================= */}
      {/* TABLE CARD */}
      {/* ================================================= */}

      <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm overflow-hidden">

        {/* SEARCH + FILTER */}

        <div className="p-4 border-b border-zinc-100 flex flex-col md:flex-row items-stretch md:items-center gap-4">

          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />

            <input
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
              placeholder="Search by name, email, TFN or signer..."
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-4 py-3 text-sm outline-none focus:ring-4 focus:ring-[#102B55]/10 focus:border-[#102B55] transition"
            />
          </div>

          <select
            value={businessFilter}
            onChange={(e) =>
              setBusinessFilter(
                e.target.value
              )
            }
            className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:ring-4 focus:ring-[#102B55]/10 focus:border-[#102B55] transition"
          >
            <option value="All">
              All Submissions
            </option>

            <option value="Individual">
              Individual
            </option>

            <option value="Entity">
              Entity
            </option>
          </select>
        </div>

        {/* ================================================= */}
        {/* TABLE */}
        {/* ================================================= */}

        <div className="overflow-x-auto">
          <table className="w-full">

            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>

                <th className="px-6 py-4 text-center w-12">
                  <input
                    type="checkbox"
                    checked={
                      filteredForms.length >
                        0 &&
                      selectedIds.length ===
                        filteredForms.length
                    }
                    onChange={
                      handleSelectAll
                    }
                    className="w-4 h-4 cursor-pointer accent-green-600"
                  />
                </th>

                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500 w-16">
                  SN
                </th>

                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Business Type
                </th>

                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Name
                </th>

                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Tax ID/TFN
                </th>

                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Signature
                </th>

                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Confirmed
                </th>

                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Signer Name
                </th>

                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Sign Date
                </th>

                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  PDF
                </th>

                <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Action
                </th>

              </tr>
            </thead>

            <tbody>

              <AnimatePresence>

                {isLoading ? (

                  <tr>
                    <td
                      colSpan={11}
                      className="h-40 text-center"
                    >
                      <div className="flex items-center justify-center gap-2 text-zinc-500">

                        <Loader2 className="w-5 h-5 animate-spin" />

                        Loading submissions...

                      </div>
                    </td>
                  </tr>

                ) : filteredForms.length > 0 ? (

                  filteredForms.map(
                    (form, index) => (

                      <tr
                        key={
                          form.id ||
                          index
                        }
                        className={`group border-b border-zinc-100 hover:bg-zinc-50/70 transition-colors ${
                          selectedIds.includes(
                            form.id
                          )
                            ? "bg-green-50/50"
                            : ""
                        }`}
                      >

                        {/* CHECKBOX */}

                        <td className="px-6 py-4 text-center">

                          <input
                            type="checkbox"
                            checked={selectedIds.includes(
                              form.id
                            )}
                            onChange={() =>
                              handleSelectOne(
                                form.id
                              )
                            }
                            className="w-4 h-4 cursor-pointer accent-green-600"
                          />

                        </td>

                        {/* SN */}

                        <td className="px-6 py-4 font-medium text-zinc-500">
                          {index + 1}
                        </td>

                        {/* BUSINESS TYPE */}

                        <td className="px-6 py-4">

                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              isIndividual(
                                form
                              )
                                ? "bg-sky-100 text-sky-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {isIndividual(
                              form
                            )
                              ? "Individual"
                              : "Entity"}
                          </span>

                        </td>

                        {/* NAME */}

                        <td className="px-6 py-4 whitespace-nowrap">

                          <div className="flex flex-col">

                            <span className="font-bold text-zinc-900">
                              {getDisplayName(
                                form
                              )}
                            </span>

                            <span className="text-[11px] text-zinc-500">
                              {form.email ||
                                "N/A"}
                            </span>

                          </div>

                        </td>

                        {/* TAX ID */}

                        <td className="px-6 py-4 font-mono text-[11px] font-bold text-zinc-600">
                          {getTaxId(form)}
                        </td>

                        {/* SIGNATURE */}

                        <td className="px-6 py-4">

                          <div className="w-12 h-6 bg-zinc-50 border border-zinc-200 rounded p-0.5 overflow-hidden flex items-center justify-center">

                            {getSignature(
                              form
                            ) ? (

                              <img
                                src={getSignature(
                                  form
                                )}
                                alt="Sign"
                                className="max-w-full max-h-full object-contain grayscale"
                              />

                            ) : (

                              <span className="text-[8px] text-zinc-400">
                                N/A
                              </span>

                            )}

                          </div>

                        </td>

                        {/* CONFIRMED */}

                        <td className="px-6 py-4">

                          {form.authorityAccepted ||
                          form.checked ? (

                            <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px] uppercase">

                              <ShieldCheck className="w-3.5 h-3.5" />

                              Yes

                            </div>

                          ) : (

                            <div className="flex items-center gap-1.5 text-rose-600 font-bold text-[10px] uppercase">

                              <XCircle className="w-3.5 h-3.5" />

                              No

                            </div>

                          )}

                        </td>

                        {/* SIGNER */}

                        <td className="px-6 py-4 font-bold text-zinc-700 text-[11px]">
                          {getSignerName(
                            form
                          )}
                        </td>

                        {/* DATE */}

                        <td className="px-6 py-4 text-zinc-500 text-[11px] font-bold">
                          {getSignDate(
                            form
                          )}
                        </td>

                        {/* PDF */}

                        <td className="px-6 py-4">

                          <button
                            onClick={(e) =>
                              handleViewPDF(
                                e,
                                form
                              )
                            }
                            className="h-8 w-8 flex items-center justify-center text-[#00c69d] hover:text-[#00b08c] hover:bg-[#00c69d]/10 rounded-full transition"
                          >
                            <FileText className="w-4 h-4" />
                          </button>

                        </td>

                        {/* ACTION */}

                        <td className="px-6 py-4 text-right">

                          <div className="flex items-center justify-end gap-2">

                            <button
                              onClick={() =>
                                handleViewDetails(
                                  form
                                )
                              }
                              className="bg-[#00c69d] hover:bg-[#00b08c] text-white h-8 px-3 text-[10px] font-black rounded-md shadow-sm transition-all uppercase tracking-wider inline-flex items-center"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() =>
                                handleDeleteClick(
                                  form.id
                                )
                              }
                              className="bg-[#ff5b5b] hover:bg-[#ee4a4a] cursor-pointer text-white h-8 px-3 text-[10px] font-black rounded-md shadow-sm transition-all uppercase tracking-wider inline-flex items-center"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  )

                ) : (

                  <tr>
                    <td
                      colSpan={11}
                      className="h-40 text-center text-zinc-500 font-medium"
                    >
                      No matching records found.
                    </td>
                  </tr>

                )}

              </AnimatePresence>

            </tbody>

          </table>
        </div>
      </div>

      {/* ================================================= */}
      {/* VIEW MODAL */}
      {/* ================================================= */}

      <AnimatePresence>

        {isViewModalOpen &&
          selectedForm && (

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

              {/* BACKDROP */}

              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                className="absolute inset-0 bg-black/50"
                onClick={() =>
                  setIsViewModalOpen(
                    false
                  )
                }
              />

              {/* MODAL */}

              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.96,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.96,
                  y: 10,
                }}
                className="relative bg-white w-full max-w-[750px] max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
              >

                <div className="overflow-y-auto">

                  <div className="p-8 bg-white space-y-10">

                    {/* ================================================= */}
                    {/* BASIC INFORMATION */}
                    {/* ================================================= */}

                    <section className="space-y-6">

                      <h3 className="font-bold text-blue-500 text-lg border-b border-zinc-100 pb-2">
                        OnBoarding Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                        {isIndividual(
                          selectedForm
                        ) ? (

                          <>
                            <InfoField
                              label="First name *"
                              value={
                                selectedForm.firstName
                              }
                            />

                            <InfoField
                              label="Last name *"
                              value={
                                selectedForm.lastName
                              }
                            />
                          </>

                        ) : (

                          <div className="md:col-span-2">

                            <InfoField
                              label="Company / Entity Name *"
                              value={
                                selectedForm.companyName ||
                                selectedForm.entityName ||
                                selectedForm.legalName
                              }
                            />

                          </div>

                        )}

                        <InfoField
                          label="Email *"
                          value={
                            selectedForm.email
                          }
                        />

                        <InfoField
                          label="Contact no. *"
                          value={
                            selectedForm.phoneNumber ||
                            selectedForm.phone
                          }
                        />

                        <div className="md:col-span-2">

                          <InfoField
                            label="Country *"
                            value={
                              selectedForm.country
                            }
                          />

                        </div>

                      </div>
                    </section>

                    {/* ================================================= */}
                    {/* BUSINESS TYPE */}
                    {/* ================================================= */}

                    <section className="space-y-6">

                      <h3 className="font-bold text-blue-500 text-lg border-b border-zinc-100 pb-2">
                        Type of business
                      </h3>

                      <div className="space-y-4">

                        {/* INDIVIDUAL */}

                        <div className="flex items-center gap-2">

                          <div
                            className={`w-4 h-4 rounded-full border-2 ${
                              isIndividual(
                                selectedForm
                              )
                                ? "border-blue-500 bg-blue-500 ring-4 ring-blue-50 p-0.5"
                                : "border-zinc-300"
                            }`}
                          >
                            {isIndividual(
                              selectedForm
                            ) && (
                              <div className="w-full h-full bg-white rounded-full" />
                            )}
                          </div>

                          <span className="text-sm font-bold text-zinc-700">
                            Option 1:
                            Individual
                          </span>

                        </div>

                        {/* ENTITY */}

                        <div className="flex items-center gap-2">

                          <div
                            className={`w-4 h-4 rounded-full border-2 ${
                              isEntity(
                                selectedForm
                              )
                                ? "border-blue-500 bg-blue-500 ring-4 ring-blue-50 p-0.5"
                                : "border-zinc-300"
                            }`}
                          >
                            {isEntity(
                              selectedForm
                            ) && (
                              <div className="w-full h-full bg-white rounded-full" />
                            )}
                          </div>

                          <span className="text-sm font-bold text-zinc-700">
                            Option 2:
                            Entity
                            (Company,
                            Trust,
                            Partnership
                            etc.)
                          </span>

                        </div>

                        {/* TAX / ID INFORMATION */}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-4">

                          <InfoField
                            label="TFN/PAN/Tax ID Number *"
                            value={getTaxId(
                              selectedForm
                            )}
                          />

                          {isIndividual(
                            selectedForm
                          ) ? (

                            <InfoField
                              label="Date of birth *"
                              value={
                                selectedForm.dob
                              }
                            />

                          ) : (

                            <InfoField
                              label="Corporate ID *"
                              value={
                                selectedForm.corporateId ||
                                selectedForm.companyId ||
                                selectedForm.corporateID
                              }
                            />

                          )}

                        </div>

                      </div>
                    </section>

                    {/* ================================================= */}
                    {/* ENTITY INFORMATION */}
                    {/* ================================================= */}

                    {isEntity(
                      selectedForm
                    ) && (

                      <section className="space-y-6">

                        <h3 className="font-bold text-blue-500 text-lg border-b border-zinc-100 pb-2">
                          Company / Entity Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                          <InfoField
                            label="Company / Entity Name"
                            value={
                              selectedForm.companyName ||
                              selectedForm.entityName ||
                              selectedForm.legalName
                            }
                          />

                          <InfoField
                            label="Corporate ID"
                            value={
                              selectedForm.corporateId ||
                              selectedForm.companyId ||
                              selectedForm.corporateID
                            }
                          />

                          <InfoField
                            label="Entity Type"
                            value={
                              selectedForm.entityType ||
                              selectedForm.companyType ||
                              selectedForm.businessType
                            }
                          />

                          <InfoField
                            label="Registered Address"
                            value={
                              selectedForm.registeredAddress ||
                              selectedForm.companyAddress ||
                              selectedForm.address
                            }
                          />

                        </div>

                      </section>

                    )}

                    {/* ================================================= */}
                    {/* SIGNATURE */}
                    {/* ================================================= */}

                    <section className="space-y-6">

                      <h3 className="font-bold text-blue-500 text-lg border-b border-zinc-100 pb-2">
                        Sign
                      </h3>

                      <div className="space-y-6">

                        <div className="space-y-2">

                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-1">
                            Signature box
                          </p>

                          <div className="h-40 bg-zinc-100/30 border-2 border-dashed border-zinc-200 rounded-xl flex items-center justify-center p-8">

                            {getSignature(
                              selectedForm
                            ) ? (

                              <img
                                src={getSignature(
                                  selectedForm
                                )}
                                alt="Client Signature"
                                className="max-h-full max-w-full object-contain grayscale brightness-90 px-4"
                              />

                            ) : (

                              <span className="text-zinc-400">
                                No signature
                                available
                              </span>

                            )}

                          </div>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-2">

                          <InfoField
                            label="Name *"
                            value={
                              selectedForm.signerName ||
                              selectedForm.signatureName
                            }
                          />

                          <InfoField
                            label="Date *"
                            value={
                              selectedForm.signDate ||
                              selectedForm.signatureDate
                            }
                          />

                        </div>

                      </div>

                    </section>

                    {/* ================================================= */}
                    {/* BUTTONS */}
                    {/* ================================================= */}

                    <div className="flex items-center justify-end pt-10 border-t border-zinc-100 gap-4">

                      {!selectedForm.checked && (

                        <button
                          onClick={
                            handleMarkAsChecked
                          }
                          className="border border-green-200 text-green-500 hover:bg-green-50 font-bold rounded-xl h-12 px-8 text-xs uppercase tracking-widest transition"
                        >
                          Checked
                        </button>

                      )}

                      <button
                        onClick={() =>
                          setIsViewModalOpen(
                            false
                          )
                        }
                        className="bg-zinc-900 hover:bg-black text-white px-12 h-12 font-black rounded-xl shadow-xl transition-all uppercase tracking-widest text-xs"
                      >
                        Close Record
                      </button>

                    </div>

                  </div>

                </div>

              </motion.div>

            </div>

          )}

      </AnimatePresence>

      {/* ================================================= */}
      {/* DELETE MODAL */}
      {/* ================================================= */}

      <AnimatePresence>

        {isDeleteModalOpen && (

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              className="absolute inset-0 bg-black/50"
              onClick={() =>
                !isDeleting &&
                setIsDeleteModalOpen(
                  false
                )
              }
            />

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.96,
                y: 10,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.96,
                y: 10,
              }}
              className="relative bg-white w-full max-w-[450px] rounded-xl shadow-2xl overflow-hidden"
            >

              <div className="bg-rose-600 px-6 py-4">

                <h3 className="text-white text-lg font-semibold tracking-wide">
                  Confirm Deletion
                </h3>

              </div>

              <div className="p-6 bg-white border-[10px] border-rose-50/50 space-y-4">

                <div className="flex items-center gap-3 text-rose-600">

                  <Trash2 className="w-6 h-6 shrink-0" />

                  <h3 className="font-semibold text-lg">
                    Are you sure want
                    to delete?
                  </h3>

                </div>

                <p className="text-zinc-600 text-sm leading-relaxed">
                  This action is
                  permanent and
                  cannot be undone.
                  This submission
                  will be permanently
                  deleted from the
                  database.
                </p>

                <div className="flex items-center justify-end gap-3 pt-4">

                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() =>
                      setIsDeleteModalOpen(
                        false
                      )
                    }
                    className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-6 h-10 font-medium rounded-md shadow-sm transition disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={
                      confirmDelete
                    }
                    className="bg-rose-600 hover:bg-rose-700 text-white px-6 h-10 font-medium rounded-md shadow-sm flex items-center gap-2 transition disabled:opacity-60"
                  >

                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}

                    Delete

                  </button>

                </div>

              </div>

            </motion.div>

          </div>

        )}

      </AnimatePresence>

    </motion.div>
  );
};

// =====================================================
// INFO FIELD
// =====================================================

const InfoField = ({
  label,
  value,
}) => (
  <div className="space-y-2 group">

    <label className="text-[10px] font-black text-zinc-400 group-hover:text-blue-400 transition-colors uppercase tracking-widest pl-1">
      {label}
    </label>

    <div className="w-full px-4 py-3.5 bg-zinc-50/80 border border-zinc-200 rounded-xl font-bold text-zinc-900 text-sm shadow-sm group-hover:border-blue-200 transition-all">
      {value || "N/A"}
    </div>

  </div>
);

export default ClientOnboardingPage;