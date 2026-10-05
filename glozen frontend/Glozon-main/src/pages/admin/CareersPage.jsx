import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  Trash2,
  Search,
  Mail,
  Phone,
  Calendar,
  Globe,
  MessageSquare,
  FileText,
  Download,
  X,
  GraduationCap,
  Briefcase,
  CheckCircle,
  XCircle,
  ExternalLink,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

import API from "../../API/Api";
import { getAssetUrl } from "../../utils/assets";

export default function CareersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  // ==========================================
  // FETCH CAREER APPLICATIONS
  // ==========================================

  const fetchCareers = async () => {
    setIsLoading(true);

    try {
      const res = await API.get("/careers", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      setApplications(res.data || []);
    } catch (e) {
      console.error("Error fetching careers:", e);

      toast.error(
        e?.response?.data?.message ||
          "Failed to load career applications."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // INITIAL FETCH
  // ==========================================

  useEffect(() => {
    fetchCareers();
  }, []);

  // ==========================================
  // DELETE APPLICATION
  // ==========================================

  const handleDelete = async () => {
    if (!deletingId) return;

    setIsDeleting(true);

    try {
      await API.delete("/careers/" + deletingId, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      setApplications((prev) =>
        prev.filter((item) => item.id !== deletingId)
      );

      if (selectedApplication?.id === deletingId) {
        setSelectedApplication(null);
      }

      setDeletingId(null);

      toast.success("Career application deleted successfully.");
    } catch (e) {
      console.error("Error deleting application:", e);

      toast.error(
        e?.response?.data?.message ||
          "Failed to delete application."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // ==========================================
  // STATUS CHANGE
  // ==========================================

  const handleStatusChange = async (id, status) => {
    setUpdatingStatusId(id);

    try {
      await API.put(
        "/careers/" + id,
        { status },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      setApplications((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                approveStatus: status,
                status,
              }
            : item
        )
      );

      if (selectedApplication?.id === id) {
        setSelectedApplication((prev) => ({
          ...prev,
          approveStatus: status,
          status,
        }));
      }

      const statusMessages = {
        shortlisted: "Applicant shortlisted successfully.",
        approved: "Applicant approved successfully.",
        rejected: "Applicant rejected successfully.",
      };

      toast.success(
        statusMessages[status] ||
          "Application status updated successfully."
      );
    } catch (e) {
      console.error("Error updating status:", e);

      toast.error(
        e?.response?.data?.message ||
          "Failed to update application status."
      );
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // ==========================================
  // FILTER APPLICATIONS
  // ==========================================

  const filteredApplications = applications.filter((app) => {
    const search = searchTerm.toLowerCase();

    return (
      app.fullName?.toLowerCase().includes(search) ||
      app.email?.toLowerCase().includes(search) ||
      app.position?.toLowerCase().includes(search) ||
      app.country?.toLowerCase().includes(search)
    );
  });

  // ==========================================
  // STATUS BADGE
  // ==========================================

  const getStatusBadge = (status) => {
    const s = (status || "pending").toLowerCase();

    switch (s) {
      case "pending":
        return (
          <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200 uppercase">
            Pending
          </span>
        );

      case "approved":
        return (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200 uppercase">
            Approved
          </span>
        );

      case "shortlisted":
        return (
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200 uppercase">
            Shortlisted
          </span>
        );

      case "rejected":
        return (
          <span className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 border border-rose-200 uppercase">
            Rejected
          </span>
        );

      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-50 px-3 py-1 text-xs font-bold text-gray-700 border border-gray-200 uppercase">
            {s}
          </span>
        );
    }
  };

  // ==========================================
  // UI
  // ==========================================

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
      {/* ==========================================
          HEADER
      ========================================== */}

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">
          Career Applications
        </h1>

        <p className="text-zinc-500 mt-1">
          Review applicant details, view uploaded CVs, and manage
          recruitment statuses.
        </p>
      </div>

      {/* ==========================================
          TABLE CARD
      ========================================== */}

      <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        {/* SEARCH */}

        <div className="p-4 border-b border-zinc-100 flex items-center justify-between gap-4">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />

            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email or position..."
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 py-3 text-sm outline-none focus:ring-4 focus:ring-[#102B55]/10 focus:border-[#102B55]"
            />
          </div>

          <span className="text-sm text-zinc-500 font-medium">
            Total: {filteredApplications.length}
          </span>
        </div>

        {/* TABLE */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700 w-16">
                  SN
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                  Applicant
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                  Position
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                  Country
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                  CV / Resume
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                  Applied Date
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                  Status
                </th>

                <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-700 w-36">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-100">
              {/* LOADING */}

              {isLoading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="h-40 text-center text-zinc-500"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Loading applications...
                    </div>
                  </td>
                </tr>
              ) : filteredApplications.length > 0 ? (
                /* APPLICATIONS */

                filteredApplications.map((app, index) => (
                  <tr
                    key={app.id}
                    className="hover:bg-zinc-50 transition"
                  >
                    {/* SN */}

                    <td className="px-6 py-5 text-sm font-medium text-zinc-500">
                      {index + 1}
                    </td>

                    {/* APPLICANT */}

                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-semibold text-zinc-900">
                          {app.fullName}
                        </span>

                        <span className="text-sm text-zinc-500">
                          {app.email}
                        </span>
                      </div>
                    </td>

                    {/* POSITION */}

                    <td className="px-6 py-5">
                      <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-100">
                        {app.position}
                      </span>
                    </td>

                    {/* COUNTRY */}

                    <td className="px-6 py-5 text-zinc-600">
                      {app.country}
                    </td>

                    {/* CV */}

                    <td className="px-6 py-5">
                      {app.resumeUrl ? (
                        <a
                          href={getAssetUrl(app.resumeUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition border border-blue-200"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          View CV
                        </a>
                      ) : (
                        <span className="text-xs text-zinc-400 italic">
                          No CV
                        </span>
                      )}
                    </td>

                    {/* DATE */}

                    <td className="px-6 py-5 text-zinc-500 text-sm">
                      {new Date(
                        app.appliedDate || app.createdAt
                      ).toLocaleDateString()}
                    </td>

                    {/* STATUS */}

                    <td className="px-6 py-5">
                      {getStatusBadge(
                        app.status || app.approveStatus
                      )}
                    </td>

                    {/* ACTION */}

                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        {/* VIEW */}

                        <button
                          onClick={() =>
                            setSelectedApplication(app)
                          }
                          className="inline-flex items-center gap-2 rounded-xl bg-[#18D1B2] px-3 py-2 text-sm font-semibold text-[#082032] hover:brightness-95 transition"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>

                        {/* DELETE */}

                        <button
                          onClick={() =>
                            setDeletingId(app.id)
                          }
                          className="inline-flex items-center gap-2 rounded-xl bg-[#FF5B5B] px-3 py-2 text-sm font-semibold text-white hover:brightness-95 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                /* EMPTY */

                <tr>
                  <td
                    colSpan={8}
                    className="h-40 text-center text-zinc-500"
                  >
                    No applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==========================================
          VIEW APPLICANT PROFILE MODAL
      ========================================== */}

      <AnimatePresence>
        {selectedApplication && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => setSelectedApplication(null)}
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.96,
              }}
              className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* MODAL HEADER */}

              <div className="flex items-center justify-between bg-[#5B4BFF] px-6 py-4 text-white">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5" />

                  <h3 className="text-lg font-semibold">
                    Applicant Profile
                  </h3>
                </div>

                <button
                  onClick={() =>
                    setSelectedApplication(null)
                  }
                  className="rounded-lg p-2 hover:bg-white/10 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* MODAL CONTENT */}

              <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                {/* NAME + STATUS */}

                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h4 className="text-2xl font-bold text-zinc-900">
                      {selectedApplication.fullName}
                    </h4>

                    <p className="text-indigo-600 font-semibold mt-1">
                      {selectedApplication.position}
                    </p>
                  </div>

                  {getStatusBadge(
                    selectedApplication.status ||
                      selectedApplication.approveStatus
                  )}
                </div>

                {/* INFORMATION */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Info
                    label="Email"
                    value={selectedApplication.email}
                    icon={Mail}
                  />

                  <Info
                    label="Mobile"
                    value={
                      selectedApplication.mobile ||
                      selectedApplication.phoneNumber
                    }
                    icon={Phone}
                  />

                  <Info
                    label="Country"
                    value={selectedApplication.country}
                    icon={Globe}
                  />

                  <Info
                    label="Experience"
                    value={selectedApplication.experience}
                    icon={GraduationCap}
                  />

                  <Info
                    label="Applied Date"
                    value={new Date(
                      selectedApplication.appliedDate ||
                        selectedApplication.createdAt ||
                        selectedApplication.updatedAt
                    ).toLocaleDateString()}
                    icon={Calendar}
                  />

                  {/* LINKEDIN */}

                  {(selectedApplication.linkedInUrl ||
                    selectedApplication.linkdinUrl) && (
                    <div className="rounded-2xl border border-zinc-200 p-4 flex flex-col justify-between">
                      <div className="flex items-center gap-2 text-sm text-zinc-500 font-medium">
                        <Globe className="w-4 h-4" />

                        LinkedIn Profile
                      </div>

                      <a
                        href={
                          selectedApplication.linkedInUrl ||
                          selectedApplication.linkdinUrl
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 text-blue-600 font-semibold inline-flex items-center gap-1 hover:underline break-all text-sm"
                      >
                        View LinkedIn Profile

                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      </a>
                    </div>
                  )}
                </div>

                {/* ==========================================
                    CV / RESUME
                ========================================== */}

                <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                        <FileText className="w-5 h-5" />
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900">
                          Applicant CV / Resume
                        </h5>

                        <p className="text-xs text-zinc-500">
                          {selectedApplication.resumeUrl
                            ? "File attached and ready for review"
                            : "No resume uploaded"}
                        </p>
                      </div>
                    </div>

                    {selectedApplication.resumeUrl ? (
                      <a
                        href={getAssetUrl(
                          selectedApplication.resumeUrl
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition shadow-sm"
                      >
                        <Download className="w-4 h-4" />

                        Download / View CV
                      </a>
                    ) : (
                      <span className="text-sm text-zinc-400 italic">
                        Not available
                      </span>
                    )}
                  </div>
                </div>

                {/* ==========================================
                    COVER LETTER
                ========================================== */}

                <div className="rounded-2xl border border-zinc-200 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-5 h-5 text-indigo-600" />

                    <h5 className="font-semibold text-zinc-900">
                      Cover Letter
                    </h5>
                  </div>

                  <p className="text-zinc-700 leading-relaxed whitespace-pre-wrap">
                    {selectedApplication.coverLetter ||
                      "No cover letter provided."}
                  </p>
                </div>

                {/* ==========================================
                    STATUS BUTTONS
                ========================================== */}

                <div className="flex items-center justify-between flex-wrap gap-3 pt-4 border-t border-zinc-100">
                  <div className="flex flex-wrap gap-2">
                    {/* SHORTLIST */}

                    <button
                      disabled={updatingStatusId === selectedApplication.id}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                      onClick={() =>
                        handleStatusChange(
                          selectedApplication.id,
                          "shortlisted"
                        )
                      }
                    >
                      {updatingStatusId === selectedApplication.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}

                      Shortlist
                    </button>

                    {/* APPROVE */}

                    <button
                      disabled={updatingStatusId === selectedApplication.id}
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                      onClick={() =>
                        handleStatusChange(
                          selectedApplication.id,
                          "approved"
                        )
                      }
                    >
                      {updatingStatusId === selectedApplication.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}

                      Approve
                    </button>

                    {/* REJECT */}

                    <button
                      disabled={updatingStatusId === selectedApplication.id}
                      className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
                      onClick={() =>
                        handleStatusChange(
                          selectedApplication.id,
                          "rejected"
                        )
                      }
                    >
                      {updatingStatusId === selectedApplication.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}

                      Reject
                    </button>
                  </div>

                  {/* CLOSE */}

                  <button
                    onClick={() =>
                      setSelectedApplication(null)
                    }
                    className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================
          DELETE CONFIRMATION MODAL
      ========================================== */}

      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* BACKDROP */}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() =>
                !isDeleting && setDeletingId(null)
              }
            />

            {/* DELETE MODAL */}

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
              className="relative bg-white w-full max-w-[450px] rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* HEADER */}

              <div className="bg-rose-600 px-6 py-4 flex items-center justify-between">
                <h3 className="text-white text-lg font-semibold tracking-wide">
                  Confirm Deletion
                </h3>
              </div>

              {/* CONTENT */}

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-rose-600">
                  <Trash2 className="w-6 h-6 shrink-0" />

                  <h3 className="font-semibold text-lg">
                    Delete this career application?
                  </h3>
                </div>

                <p className="text-zinc-600 text-sm leading-relaxed">
                  This action cannot be undone. The application
                  and candidate record will be removed.
                </p>

                {/* BUTTONS */}

                <div className="flex items-center justify-end gap-3 pt-4">
                  {/* CANCEL */}

                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => setDeletingId(null)}
                    className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-5 py-2.5 font-medium rounded-xl transition disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  {/* DELETE */}

                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={handleDelete}
                    className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 font-semibold rounded-xl flex items-center gap-2 transition disabled:opacity-60"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}

                    {isDeleting
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ==========================================
// INFO COMPONENT
// ==========================================

function Info({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-zinc-200 p-4">
      <div className="flex items-center gap-2 text-sm text-zinc-500 font-medium">
        <Icon className="w-4 h-4" />

        {label}
      </div>

      <div className="mt-2 text-zinc-900 font-semibold break-words">
        {value || "N/A"}
      </div>
    </div>
  );
}