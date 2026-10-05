import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Trash2,
  Mail,
  Phone,
  Building2,
  User,
  MapPin,
  Briefcase,
  Hash,
  RefreshCw,
  FileText,
  ExternalLink,
} from "lucide-react";

import toast from "react-hot-toast";

import API from "../../API/Api";

export default function PartnerSubmissionsPage() {
  // =====================================================
  // GET PARTNER ID
  // =====================================================

  const { partnerId } = useParams();

  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [submissions, setSubmissions] = useState([]);

  const [partner, setPartner] = useState(null);

  const [loading, setLoading] = useState(true);

  const [deletingId, setDeletingId] = useState(null);

  // Confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [submissionToDelete, setSubmissionToDelete] = useState(null);

  // =====================================================
  // FETCH SUBMISSIONS
  // =====================================================

  const fetchSubmissions = async () => {
    if (!partnerId) {
      console.error("Partner ID is missing.");

      toast.error("Partner ID is missing.");

      return;
    }

    try {
      setLoading(true);

      console.log("=================================");
      console.log("FETCH PARTNER SUBMISSIONS");
      console.log("PARTNER ID:", partnerId);
      console.log("=================================");

      const response = await API.get(
        `/partners/${partnerId}/submissions`
      );

      console.log(
        "PARTNER SUBMISSIONS RESPONSE:",
        response.data
      );

      if (response.data?.success) {
        setPartner(response.data.partner || null);

        setSubmissions(
          Array.isArray(response.data.data)
            ? response.data.data
            : []
        );
      } else {
        setPartner(null);
        setSubmissions([]);

        toast.error(
          response.data?.message ||
            "Failed to load partner submissions."
        );
      }
    } catch (error) {
      console.error(
        "FETCH PARTNER SUBMISSIONS ERROR:",
        error.response?.data || error
      );

      setPartner(null);
      setSubmissions([]);

      toast.error(
        error.response?.data?.message ||
          "Failed to load partner submissions."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchSubmissions();
  }, [partnerId]);

  // =====================================================
  // DELETE CLICK
  // =====================================================

  const handleDelete = (submission) => {
    if (!submission?.id) {
      toast.error("Submission ID is missing.");
      return;
    }

    setSubmissionToDelete(submission);
    setIsDeleteModalOpen(true);
  };

  // =====================================================
  // CONFIRM DELETE
  // =====================================================

  const confirmDelete = async () => {
    if (!submissionToDelete?.id) {
      return;
    }

    const id = submissionToDelete.id;

    try {
      setDeletingId(id);

      console.log(
        "DELETE PARTNER SUBMISSION:",
        id
      );

      await API.delete(
        `/partner-submissions/${id}`
      );

      setSubmissions((prev) =>
        prev.filter(
          (submission) =>
            submission.id !== id
        )
      );

      toast.success(
        "Partner submission deleted successfully."
      );

      setIsDeleteModalOpen(false);
      setSubmissionToDelete(null);
    } catch (error) {
      console.error(
        "DELETE SUBMISSION ERROR:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to delete submission."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================================
  // CANCEL DELETE
  // =====================================================

  const cancelDelete = () => {
    if (deletingId) {
      return;
    }

    setIsDeleteModalOpen(false);
    setSubmissionToDelete(null);
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    try {
      return new Date(date).toLocaleString(
        "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    } catch {
      return date;
    }
  };

  // =====================================================
  // BACK
  // =====================================================

  const handleBack = () => {
    navigate("/admin/partners");
  };

  // =====================================================
  // VIEW PDF
  // =====================================================

  const handleViewPDF = (pdfUrl) => {
    if (!pdfUrl) {
      toast.error(
        "PDF is not available for this submission."
      );

      return;
    }

    window.open(
      pdfUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        className="space-y-6"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="
              h-10
              w-10
              rounded-xl
              border
              border-zinc-200
              bg-white
              flex
              items-center
              justify-center
              text-zinc-600
              hover:bg-zinc-50
              transition
            "
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <h2 className="text-3xl font-bold text-[#0F172A]">
              Partner Submissions
            </h2>

            <p className="text-zinc-500 mt-1">
              Loading submissions...
            </p>
          </div>
        </div>

        <div
          className="
            rounded-3xl
            border
            border-zinc-200
            bg-white
            shadow-sm
            h-64
            flex
            items-center
            justify-center
          "
        >
          <div className="text-center">
            <RefreshCw
              className="
                w-7
                h-7
                text-zinc-400
                animate-spin
                mx-auto
              "
            />

            <p className="mt-3 text-zinc-500">
              Loading partner submissions...
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // =====================================================
  // PARTNER NOT FOUND
  // =====================================================

  if (!partner) {
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
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="
              h-10
              w-10
              rounded-xl
              border
              border-zinc-200
              bg-white
              flex
              items-center
              justify-center
              text-zinc-600
              hover:bg-zinc-50
              transition
            "
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <h2 className="text-3xl font-bold text-[#0F172A]">
              Partner Submissions
            </h2>

            <p className="text-zinc-500 mt-1">
              Partner could not be found.
            </p>
          </div>
        </div>

        <div
          className="
            rounded-3xl
            border
            border-zinc-200
            bg-white
            shadow-sm
            p-10
            text-center
          "
        >
          <Building2
            className="
              w-12
              h-12
              text-zinc-300
              mx-auto
            "
          />

          <h3 className="mt-4 text-xl font-bold text-zinc-800">
            Partner Not Found
          </h3>

          <p className="mt-2 text-zinc-500">
            The partner associated with
            this page could not be found.
          </p>

          <button
            onClick={handleBack}
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-[#102B55]
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              hover:bg-[#0b2142]
              transition
            "
          >
            <ArrowLeft className="w-4 h-4" />

            Back to Partners
          </button>
        </div>
      </motion.div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <>
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
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <button
              onClick={handleBack}
              title="Back to Partners"
              className="
                h-11
                w-11
                rounded-xl
                border
                border-zinc-200
                bg-white
                flex
                items-center
                justify-center
                text-zinc-600
                hover:bg-zinc-50
                transition
                shadow-sm
              "
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-4xl font-bold text-[#0F172A]">
                Partner Submissions
              </h2>

              <p className="text-zinc-500 mt-2 text-lg">
                View people who submitted
                through this partner
                registration link.
              </p>
            </div>
          </div>

          <button
            onClick={fetchSubmissions}
            disabled={loading}
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-zinc-200
              bg-white
              px-4
              py-3
              text-sm
              font-semibold
              text-zinc-700
              hover:bg-zinc-50
              transition
              shadow-sm
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            <RefreshCw
              className={`w-4 h-4 ${
                loading
                  ? "animate-spin"
                  : ""
              }`}
            />

            Refresh
          </button>
        </div>

        {/* =================================================
            PARTNER INFO
        ================================================= */}

        <div
          className="
            rounded-3xl
            border
            border-zinc-200
            bg-white
            shadow-sm
            p-6
          "
        >
          <div className="flex flex-col md:flex-row md:items-center gap-5">
            {/* LOGO */}

            <div
              className="
                h-20
                w-20
                rounded-2xl
                border
                border-zinc-200
                bg-zinc-50
                flex
                items-center
                justify-center
                overflow-hidden
                shrink-0
              "
            >
              {partner.logoUrl ? (
                <img
                  src={partner.logoUrl}
                  alt={
                    partner.name ||
                    "Partner Logo"
                  }
                  className="
                    h-full
                    w-full
                    object-contain
                    p-2
                  "
                />
              ) : (
                <Building2
                  className="
                    w-8
                    h-8
                    text-zinc-300
                  "
                />
              )}
            </div>

            {/* INFO */}

            <div className="flex-1">
              <h3 className="text-2xl font-bold text-[#0F172A]">
                {partner.name || "-"}
              </h3>

              <p className="text-sm text-zinc-500 mt-1">
                Partner ID: {partner.id}
              </p>

              <p className="text-sm text-zinc-400 mt-1">
                Slug: {partner.slug || "-"}
              </p>
            </div>

            {/* COUNT */}

            <div
              className="
                rounded-2xl
                bg-indigo-50
                border
                border-indigo-100
                px-6
                py-4
                text-center
              "
            >
              <p className="text-3xl font-bold text-indigo-600">
                {submissions.length}
              </p>

              <p className="text-xs font-medium text-indigo-500 mt-1">
                Submissions
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            SUBMISSIONS
        ================================================= */}

        <div
          className="
            rounded-3xl
            border
            border-zinc-200
            bg-white
            shadow-sm
            overflow-hidden
          "
        >
          {/* TABLE HEADER */}

          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-zinc-100
              px-6
              py-5
            "
          >
            <div>
              <h3 className="text-xl font-bold text-[#0F172A]">
                Submitted Registrations
              </h3>

              <p className="text-sm text-zinc-500 mt-1">
                All submissions received
                from this partner.
              </p>
            </div>

            <span
              className="
                rounded-full
                bg-zinc-100
                px-4
                py-2
                text-sm
                font-semibold
                text-zinc-600
              "
            >
              {submissions.length} Total
            </span>
          </div>

          {/* TABLE */}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1450px]">
              <thead
                className="
                  bg-zinc-50
                  border-b
                  border-zinc-200
                "
              >
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                    SN
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Name
                    </div>
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </div>
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone
                    </div>
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      Registration No.
                    </div>
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Contact Person
                    </div>
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Position
                    </div>
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Address
                    </div>
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                    Submitted At
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      PDF
                    </div>
                  </th>

                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-700">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-100">
                {submissions.length > 0 ? (
                  submissions.map(
                    (submission, index) => (
                      <tr
                        key={submission.id}
                        className="
                          hover:bg-zinc-50
                          transition
                          align-top
                        "
                      >
                        {/* SN */}

                        <td className="px-6 py-5 text-sm font-medium text-zinc-500">
                          {index + 1}
                        </td>

                        {/* NAME */}

                        <td className="px-6 py-5">
                          <p className="text-sm font-semibold text-zinc-800">
                            {submission.name ||
                              "-"}
                          </p>
                        </td>

                        {/* EMAIL */}

                        <td className="px-6 py-5">
                          {submission.email ? (
                            <a
                              href={`mailto:${submission.email}`}
                              className="
                                text-sm
                                text-indigo-600
                                hover:underline
                              "
                            >
                              {
                                submission.email
                              }
                            </a>
                          ) : (
                            <span className="text-sm text-zinc-400">
                              -
                            </span>
                          )}
                        </td>

                        {/* PHONE */}

                        <td className="px-6 py-5">
                          {submission.phone ? (
                            <a
                              href={`tel:${submission.phone}`}
                              className="
                                text-sm
                                text-zinc-600
                                hover:text-indigo-600
                              "
                            >
                              {
                                submission.phone
                              }
                            </a>
                          ) : (
                            <span className="text-sm text-zinc-400">
                              -
                            </span>
                          )}
                        </td>

                        {/* REGISTRATION NUMBER */}

                        <td className="px-6 py-5">
                          <span className="text-sm text-zinc-600">
                            {submission.registrationNumber ||
                              "-"}
                          </span>
                        </td>

                        {/* CONTACT NAME */}

                        <td className="px-6 py-5">
                          <span className="text-sm font-medium text-zinc-800">
                            {submission.contactName ||
                              "-"}
                          </span>
                        </td>

                        {/* POSITION */}

                        <td className="px-6 py-5">
                          <span className="text-sm text-zinc-600">
                            {submission.position ||
                              "-"}
                          </span>
                        </td>

                        {/* ADDRESS */}

                        <td className="px-6 py-5 max-w-[250px]">
                          <p
                            className="
                              text-sm
                              text-zinc-600
                              whitespace-normal
                              break-words
                            "
                          >
                            {submission.address ||
                              "-"}
                          </p>
                        </td>

                        {/* DATE */}

                        <td className="px-6 py-5">
                          <span className="text-sm text-zinc-500 whitespace-nowrap">
                            {formatDate(
                              submission.createdAt
                            )}
                          </span>
                        </td>

                        {/* PDF */}

                        <td className="px-6 py-5">
                          {submission.pdfUrl ? (
                            <button
                              onClick={() =>
                                handleViewPDF(
                                  submission.pdfUrl
                                )
                              }
                              className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-xl
                                bg-red-50
                                border
                                border-red-100
                                px-3
                                py-2
                                text-sm
                                font-semibold
                                text-red-600
                                hover:bg-red-100
                                transition
                              "
                              title="View PDF"
                            >
                              <FileText className="w-4 h-4" />

                              View PDF

                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <span
                              className="
                                inline-flex
                                items-center
                                rounded-xl
                                bg-zinc-100
                                px-3
                                py-2
                                text-xs
                                font-medium
                                text-zinc-400
                              "
                            >
                              PDF Not Available
                            </span>
                          )}
                        </td>

                        {/* DELETE */}

                        <td className="px-6 py-5">
                          <div className="flex justify-end">
                            <button
                              onClick={() =>
                                handleDelete(
                                  submission
                                )
                              }
                              disabled={
                                deletingId ===
                                submission.id
                              }
                              title="Delete Submission"
                              className="
                                h-9
                                w-9
                                rounded-xl
                                border
                                border-zinc-200
                                flex
                                items-center
                                justify-center
                                text-rose-600
                                hover:bg-rose-50
                                transition
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                              "
                            >
                              <Trash2 className="w-4 h-4" />
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
                      className="
                        h-48
                        text-center
                        text-zinc-500
                      "
                    >
                      <div className="flex flex-col items-center justify-center">
                        <User
                          className="
                            w-10
                            h-10
                            text-zinc-300
                          "
                        />

                        <p className="mt-3 font-medium text-zinc-600">
                          No submissions found
                        </p>

                        <p className="text-sm text-zinc-400 mt-1">
                          No one has submitted
                          this partner
                          registration form yet.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div
            className="
              flex
              items-center
              justify-between
              border-t
              border-zinc-100
              px-6
              py-4
              bg-zinc-50/50
            "
          >
            <p className="text-sm text-zinc-500">
              Showing {submissions.length}{" "}
              {submissions.length === 1
                ? "submission"
                : "submissions"}
            </p>

            <button
              onClick={handleBack}
              className="
                inline-flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-indigo-600
                hover:text-indigo-800
                transition
              "
            >
              <ArrowLeft className="w-4 h-4" />

              Back to Partners
            </button>
          </div>
        </div>
      </motion.div>

      {/* =====================================================
          DELETE CONFIRMATION MODAL
      ===================================================== */}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* BACKDROP */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="
              absolute
              inset-0
              bg-black/50
              backdrop-blur-sm
            "
            onClick={cancelDelete}
          />

          {/* MODAL */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 10,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            className="
              relative
              w-full
              max-w-md
              rounded-2xl
              bg-white
              shadow-2xl
              overflow-hidden
            "
          >
            {/* HEADER */}

            <div className="bg-rose-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-white" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">
                    Delete Submission
                  </h3>

                  <p className="text-sm text-rose-100">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            {/* BODY */}

            <div className="p-6">
              <p className="text-zinc-600 text-sm leading-relaxed">
                Are you sure you want to delete this
                partner submission?
              </p>

              {submissionToDelete && (
                <div className="mt-4 rounded-xl bg-zinc-50 border border-zinc-200 p-4">
                  <p className="text-sm font-semibold text-zinc-800">
                    {submissionToDelete.name ||
                      "Unknown Person"}
                  </p>

                  {submissionToDelete.email && (
                    <p className="text-xs text-zinc-500 mt-1">
                      {
                        submissionToDelete.email
                      }
                    </p>
                  )}
                </div>
              )}

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  disabled={!!deletingId}
                  onClick={cancelDelete}
                  className="
                    px-5
                    h-10
                    rounded-xl
                    bg-zinc-100
                    text-zinc-700
                    text-sm
                    font-semibold
                    hover:bg-zinc-200
                    transition
                    disabled:opacity-50
                  "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={!!deletingId}
                  onClick={confirmDelete}
                  className="
                    px-5
                    h-10
                    rounded-xl
                    bg-rose-600
                    text-white
                    text-sm
                    font-semibold
                    hover:bg-rose-700
                    transition
                    inline-flex
                    items-center
                    gap-2
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >
                  {deletingId ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}