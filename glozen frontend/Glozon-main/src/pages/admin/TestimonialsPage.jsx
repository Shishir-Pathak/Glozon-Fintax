import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  Image,
  Loader2,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import API from "../../API/Api";
import { useContent } from "../../context/ContentContext";
import { uploadAssetFile, getAssetUrl } from "../../utils/assets";

export default function TestimonialsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    testimonials: contextTestimonials,
    refreshContent,
  } = useContent();

  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    position: "",
    text: "",
    image: "",
  });

  // ==========================================
  // FETCH TESTIMONIALS
  // ==========================================

  const fetchTestimonials = async () => {
    setIsLoading(true);

    try {
      const res = await API.get("/testimonials");

      setTestimonials(res.data || []);
    } catch (e) {
      console.error("Error fetching testimonials:", e);

      setTestimonials(contextTestimonials || []);

      toast.error("Failed to load testimonials");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setFormData({
      name: "",
      position: "",
      text: "",
      image: "",
    });

    setEditingId(null);
  };

  // ==========================================
  // OPEN ADD MODAL
  // ==========================================

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const openEditModal = (testimonial) => {
    setEditingId(testimonial.id);

    setFormData({
      name: testimonial.name || "",
      position: testimonial.position || testimonial.role || "",
      text: testimonial.text || testimonial.review || "",
      image: testimonial.image || "",
    });

    setIsModalOpen(true);
  };

  // ==========================================
  // FILE UPLOAD
  // ==========================================

  const handleFileUpload = async (file) => {
    if (!file) return;

    setUploading(true);

    try {
      const url = await uploadAssetFile(file);

      if (url) {
        setFormData((prev) => ({
          ...prev,
          image: url,
        }));

        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Image upload failed");
      }
    } catch (e) {
      console.error("Upload error:", e);

      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  // ==========================================
  // SAVE / UPDATE TESTIMONIAL
  // ==========================================

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Client name is required");
      return;
    }

    if (!formData.position.trim()) {
      toast.error("Position / Company is required");
      return;
    }

    if (!formData.text.trim()) {
      toast.error("Testimonial / Review is required");
      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        // UPDATE
        await API.put(`/testimonials/${editingId}`, formData, {
          headers: {
            Authorization:
              "Bearer " + localStorage.getItem("token"),
          },
        });

        toast.success("Testimonial updated successfully!");
      } else {
        // CREATE
        await API.post("/testimonials", formData, {
          headers: {
            Authorization:
              "Bearer " + localStorage.getItem("token"),
          },
        });

        toast.success("Testimonial added successfully!");
      }

      await fetchTestimonials();
      await refreshContent();

      setIsModalOpen(false);
      resetForm();
    } catch (e) {
      console.error("Error saving testimonial:", e);

      toast.error(
        e?.response?.data?.message ||
          "Failed to save testimonial"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE TESTIMONIAL
  // ==========================================

  const handleDelete = async () => {
    if (!deletingId) return;

    setIsDeleting(true);

    try {
      await API.delete(`/testimonials/${deletingId}`, {
        headers: {
          Authorization:
            "Bearer " + localStorage.getItem("token"),
        },
      });

      await fetchTestimonials();
      await refreshContent();

      setDeletingId(null);

      toast.success("Testimonial deleted successfully!");
    } catch (e) {
      console.error("Error deleting testimonial:", e);

      toast.error(
        e?.response?.data?.message ||
          "Failed to delete testimonial"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // ==========================================
  // FILTER TESTIMONIALS
  // ==========================================

  const filteredTestimonials = testimonials.filter(
    (testimonial) =>
      testimonial.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (testimonial.position || testimonial.role)
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (testimonial.text || testimonial.review)
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // ==========================================
  // UI
  // ==========================================

  return (
    <>
      {/* ==========================================
          TOAST CONTAINER
      ========================================== */}

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            padding: "14px 18px",
            fontSize: "14px",
            fontWeight: "600",
          },
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              Client Testimonials
            </h1>

            <p className="text-zinc-500 mt-1">
              Manage reviews, client credentials, and client
              avatars displayed on the landing page.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-xl bg-[#18D1B2] px-5 py-3 text-sm font-semibold text-[#082032] hover:brightness-95 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Testimonial
          </button>
        </div>

        {/* ==========================================
            TABLE CARD
        ========================================== */}

        <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
          {/* SEARCH */}

          <div className="p-4 border-b border-zinc-100 flex items-center justify-between gap-4">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />

              <input
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                placeholder="Search by name, role or review content..."
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 py-3 text-sm outline-none focus:ring-4 focus:ring-[#102B55]/10 focus:border-[#102B55]"
              />
            </div>

            <span className="text-sm font-medium text-zinc-500">
              Total: {filteredTestimonials.length}
            </span>
          </div>

          {/* TABLE */}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-50 border-b border-zinc-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700 w-16">
                    SN
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                    Client
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                    Position / Role
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                    Avatar
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700 min-w-[280px]">
                    Review
                  </th>

                  <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-700 w-32">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-100">
                {/* LOADING */}

                {isLoading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="h-40 text-center text-zinc-500"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Loading testimonials...
                      </div>
                    </td>
                  </tr>
                ) : filteredTestimonials.length > 0 ? (
                  /* DATA */

                  filteredTestimonials.map(
                    (testimonial, index) => (
                      <tr
                        key={
                          testimonial.id || index
                        }
                        className="hover:bg-zinc-50 transition"
                      >
                        {/* SN */}

                        <td className="px-6 py-5 text-sm font-medium text-zinc-500">
                          {index + 1}
                        </td>

                        {/* CLIENT */}

                        <td className="px-6 py-5 font-semibold text-zinc-900 whitespace-nowrap">
                          {testimonial.name}
                        </td>

                        {/* POSITION */}

                        <td className="px-6 py-5">
                          <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-100 whitespace-nowrap">
                            {testimonial.position ||
                              testimonial.role}
                          </span>
                        </td>

                        {/* IMAGE */}

                        <td className="px-6 py-5">
                          {testimonial.image ? (
                            <img
                              src={getAssetUrl(
                                testimonial.image
                              )}
                              alt={testimonial.name}
                              className="h-11 w-11 rounded-full object-cover border border-zinc-200"
                            />
                          ) : (
                            <div className="h-11 w-11 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                              {(
                                testimonial.name ||
                                "U"
                              )[0]}
                            </div>
                          )}
                        </td>

                        {/* REVIEW */}

                        <td className="px-6 py-5 text-zinc-600 text-sm max-w-[320px]">
                          <p className="line-clamp-2 italic">
                            "
                            {testimonial.text ||
                              testimonial.review}
                            "
                          </p>
                        </td>

                        {/* ACTIONS */}

                        <td className="px-6 py-5">
                          <div className="flex items-center justify-end gap-2">
                            {/* EDIT */}

                            <button
                              onClick={() =>
                                openEditModal(testimonial)
                              }
                              className="h-9 w-9 rounded-xl border border-zinc-200 flex items-center justify-center text-indigo-600 hover:bg-indigo-50 transition"
                              title="Edit Testimonial"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>

                            {/* DELETE */}

                            <button
                              onClick={() =>
                                setDeletingId(
                                  testimonial.id
                                )
                              }
                              className="h-9 w-9 rounded-xl border border-zinc-200 flex items-center justify-center text-rose-600 hover:bg-rose-50 transition"
                              title="Delete Testimonial"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  /* EMPTY */

                  <tr>
                    <td
                      colSpan={6}
                      className="h-40 text-center text-zinc-500"
                    >
                      No testimonials found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ==========================================
            ADD / EDIT MODAL
        ========================================== */}

        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
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
                className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden"
              >
                {/* MODAL HEADER */}

                <div className="flex items-center justify-between bg-[#5B4BFF] px-6 py-4 text-white">
                  <h3 className="text-lg font-semibold">
                    {editingId
                      ? "Edit Testimonial"
                      : "Add Testimonial"}
                  </h3>

                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    className="rounded-lg p-2 hover:bg-white/10 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* FORM */}

                <form
                  onSubmit={handleSave}
                  className="p-6 space-y-5"
                >
                  {/* NAME + POSITION */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* NAME */}

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-zinc-700">
                        Client Name *
                      </label>

                      <input
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="e.g. Sarah Johnson"
                        className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:ring-4 focus:ring-[#102B55]/10 focus:border-[#102B55] text-sm"
                      />
                    </div>

                    {/* POSITION */}

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-zinc-700">
                        Position / Company *
                      </label>

                      <input
                        required
                        value={formData.position}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            position: e.target.value,
                          }))
                        }
                        placeholder="e.g. Director, Sydney Accounting Group"
                        className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:ring-4 focus:ring-[#102B55]/10 focus:border-[#102B55] text-sm"
                      />
                    </div>
                  </div>

                  {/* IMAGE */}

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-700">
                      Avatar Image Asset
                    </label>

                    <div className="flex gap-3">
                      <div className="flex-1 flex items-center gap-3 rounded-xl border border-zinc-200 px-4 py-3">
                        <Image className="w-4 h-4 text-zinc-500" />

                        <input
                          value={formData.image}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              image: e.target.value,
                            }))
                          }
                          placeholder="Image URL or upload photo"
                          className="flex-1 outline-none text-sm"
                        />
                      </div>

                      <label className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-700 cursor-pointer transition">
                        <Upload className="w-4 h-4 text-indigo-600" />

                        {uploading
                          ? "Uploading..."
                          : "Upload"}

                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploading}
                          onChange={(e) =>
                            handleFileUpload(
                              e.target.files[0]
                            )
                          }
                        />
                      </label>
                    </div>

                    {/* IMAGE PREVIEW */}

                    {formData.image && (
                      <div className="pt-2">
                        <p className="text-xs text-zinc-500 mb-2">
                          Image Preview
                        </p>

                        <img
                          src={getAssetUrl(
                            formData.image
                          )}
                          alt="Preview"
                          className="h-16 w-16 rounded-full object-cover border border-zinc-200"
                        />
                      </div>
                    )}
                  </div>

                  {/* REVIEW */}

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-700">
                      Testimonial / Review *
                    </label>

                    <textarea
                      required
                      rows={4}
                      value={formData.text}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          text: e.target.value,
                        }))
                      }
                      placeholder="Describe their experience and recommendation..."
                      className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:ring-4 focus:ring-[#102B55]/10 focus:border-[#102B55] text-sm resize-none"
                    />
                  </div>

                  {/* BUTTONS */}

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        resetForm();
                      }}
                      className="rounded-xl bg-zinc-100 px-5 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-200 transition"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={saving || uploading}
                      className="rounded-xl bg-[#18D1B2] px-6 py-3 text-sm font-semibold text-[#082032] hover:brightness-95 transition disabled:opacity-60"
                    >
                      {saving ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </span>
                      ) : editingId ? (
                        "Update Testimonial"
                      ) : (
                        "Save Testimonial"
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
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
                onClick={() => {
                  if (!isDeleting) {
                    setDeletingId(null);
                  }
                }}
              />

              {/* MODAL */}

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
                className="relative bg-white w-full max-w-[450px] rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4"
              >
                <div className="flex items-center gap-3 text-rose-600">
                  <Trash2 className="w-6 h-6 shrink-0" />

                  <h3 className="font-semibold text-lg">
                    Delete Testimonial?
                  </h3>
                </div>

                <p className="text-zinc-600 text-sm leading-relaxed">
                  Are you sure you want to remove this client
                  review? It will no longer appear on the
                  website.
                </p>

                <div className="flex items-center justify-end gap-3 pt-4">
                  {/* CANCEL */}

                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() =>
                      setDeletingId(null)
                    }
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
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
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
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}