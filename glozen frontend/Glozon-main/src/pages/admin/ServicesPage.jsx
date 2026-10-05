import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Layers3,
  Pencil,
  Trash2,
  X,
  Upload,
  Image,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";

import API from "../../API/Api";
import { useContent } from "../../context/ContentContext";
import {
  uploadAssetFile,
  getAssetUrl,
} from "../../utils/assets";

export default function ServicesPage() {
  const {
    services: contextServices,
    refreshContent,
  } = useContent();

  // ==========================================
  // STATE
  // ==========================================

  const [search, setSearch] = useState("");
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "Accounting",
    description: "",
    image: "",
    path: "",
  });

  // ==========================================
  // AUTH CONFIG
  // ==========================================

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // ==========================================
  // FETCH SERVICES
  // ==========================================

  const fetchServices = async () => {
    setIsLoading(true);

    try {
      const res = await API.get(
        "/services",
        getAuthConfig()
      );

      setServices(res.data || []);
    } catch (error) {
      console.error(
        "Error fetching services:",
        error
      );

      console.error(
        "Status:",
        error?.response?.status
      );

      console.error(
        "Response:",
        error?.response?.data
      );

      /*
       * If API fails, use services from
       * ContentContext as fallback.
       */
      setServices(contextServices || []);

      toast.error(
        error?.response?.data?.message ||
          "Failed to load services."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // INITIAL FETCH
  // ==========================================

  useEffect(() => {
    fetchServices();
  }, []);

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setFormData({
      title: "",
      category: "Accounting",
      description: "",
      image: "",
      path: "",
    });

    setEditingService(null);
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

  const openEditModal = (service) => {
    setEditingService(service.id);

    setFormData({
      title: service.title || "",
      category:
        service.category || "Accounting",
      description:
        service.description || "",
      image:
        service.image ||
        service.imageUrl ||
        "",
      path: service.path || "",
    });

    setIsModalOpen(true);
  };

  // ==========================================
  // CLOSE SERVICE MODAL
  // ==========================================

  const closeModal = () => {
    if (saving || uploading) return;

    setIsModalOpen(false);
    resetForm();
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

        toast.success(
          "Service image uploaded successfully!"
        );
      } else {
        toast.error(
          "Image upload failed."
        );
      }
    } catch (error) {
      console.error(
        "Failed to upload service image:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to upload image."
      );
    } finally {
      setUploading(false);
    }
  };

  // ==========================================
  // SAVE SERVICE
  // ==========================================

  const handleSave = async (e) => {
    e.preventDefault();

    // ========================================
    // TITLE VALIDATION
    // ========================================

    if (!formData.title.trim()) {
      toast.error(
        "Please enter service title."
      );
      return;
    }

    // ========================================
    // CATEGORY VALIDATION
    // ========================================

    if (!formData.category.trim()) {
      toast.error(
        "Please enter service category."
      );
      return;
    }

    // ========================================
    // DESCRIPTION VALIDATION
    // ========================================

    if (!formData.description.trim()) {
      toast.error(
        "Please enter service description."
      );
      return;
    }

    setSaving(true);

    try {
      // ======================================
      // UPDATE SERVICE
      // ======================================

      if (editingService) {
        await API.put(
          `/services/${editingService}`,
          formData,
          getAuthConfig()
        );

        toast.success(
          "Service updated successfully!"
        );
      }

      // ======================================
      // CREATE SERVICE
      // ======================================

      else {
        await API.post(
          "/services",
          formData,
          getAuthConfig()
        );

        toast.success(
          "Service created successfully!"
        );
      }

      // ======================================
      // REFRESH SERVICES
      // ======================================

      await fetchServices();

      // ======================================
      // REFRESH GLOBAL CONTENT
      // ======================================

      await refreshContent();

      // ======================================
      // CLOSE MODAL
      // ======================================

      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error(
        "Error saving service:",
        error
      );

      console.error(
        "Status:",
        error?.response?.status
      );

      console.error(
        "Response:",
        error?.response?.data
      );

      const message =
        error?.response?.data?.message ||
        "Failed to save service.";

      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE SERVICE
  // ==========================================

  const handleDelete = async () => {
    if (!deletingId) return;

    setIsDeleting(true);

    try {
      await API.delete(
        `/services/${deletingId}`,
        getAuthConfig()
      );

      toast.success(
        "Service deleted successfully!"
      );

      // ======================================
      // REFRESH SERVICES
      // ======================================

      await fetchServices();

      // ======================================
      // REFRESH GLOBAL CONTENT
      // ======================================

      await refreshContent();

      // ======================================
      // CLOSE DELETE MODAL
      // ======================================

      setDeletingId(null);
    } catch (error) {
      console.error(
        "Error deleting service:",
        error
      );

      console.error(
        "Status:",
        error?.response?.status
      );

      console.error(
        "Response:",
        error?.response?.data
      );

      const message =
        error?.response?.data?.message ||
        "Failed to delete service.";

      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  // ==========================================
  // FILTER SERVICES
  // ==========================================

  const filteredServices =
    services.filter((item) => {
      const searchText =
        search.toLowerCase();

      return (
        item.title
          ?.toLowerCase()
          .includes(searchText) ||
        item.category
          ?.toLowerCase()
          .includes(searchText) ||
        item.description
          ?.toLowerCase()
          .includes(searchText)
      );
    });

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
      {/* ========================================
          HEADER
      ======================================== */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#0F172A]">
            Services Management
          </h2>

          <p className="text-zinc-500 mt-1">
            Manage service categories, service
            cards, descriptions, and illustration
            assets.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-xl bg-[#18D1B2] px-5 py-3 text-sm font-semibold text-[#082032] hover:brightness-95 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />

          Add New Service
        </button>
      </div>

      {/* ========================================
          TABLE CARD
      ======================================== */}

      <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        {/* SEARCH */}

        <div className="p-4 border-b border-zinc-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by title or category..."
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 py-3 text-sm outline-none focus:ring-4 focus:ring-[#102B55]/10 focus:border-[#102B55]"
            />
          </div>

          <span className="text-sm font-medium text-zinc-500">
            Total Services:{" "}
            {filteredServices.length}
          </span>
        </div>

        {/* ========================================
            TABLE
        ======================================== */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700 w-16">
                  SN
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                  Image
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                  Service Title
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                  Category
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700 min-w-[280px]">
                  Description
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

                      Loading services...
                    </div>
                  </td>
                </tr>
              ) : filteredServices.length >
                0 ? (
                /* SERVICES */

                filteredServices.map(
                  (service, index) => (
                    <tr
                      key={
                        service.id || index
                      }
                      className="hover:bg-zinc-50 transition"
                    >
                      {/* SN */}

                      <td className="px-6 py-5 text-sm font-medium text-zinc-500">
                        {index + 1}
                      </td>

                      {/* IMAGE */}

                      <td className="px-6 py-5">
                        <img
                          src={getAssetUrl(
                            service.image ||
                              service.imageUrl ||
                              "/Logo.png"
                          )}
                          alt={
                            service.title ||
                            "Service"
                          }
                          className="h-12 w-12 rounded-xl object-cover border border-zinc-200 bg-white"
                        />
                      </td>

                      {/* TITLE */}

                      <td className="px-6 py-5">
                        <div className="font-semibold text-zinc-900">
                          {service.title}
                        </div>

                        {service.path && (
                          <span className="text-xs text-zinc-400">
                            {service.path}
                          </span>
                        )}
                      </td>

                      {/* CATEGORY */}

                      <td className="px-6 py-5">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100">
                          {service.category ||
                            "General"}
                        </span>
                      </td>

                      {/* DESCRIPTION */}

                      <td className="px-6 py-5 text-zinc-600 text-sm max-w-[320px]">
                        <p className="line-clamp-2">
                          {service.description}
                        </p>
                      </td>

                      {/* ACTIONS */}

                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          {/* EDIT */}

                          <button
                            onClick={() =>
                              openEditModal(
                                service
                              )
                            }
                            className="h-9 w-9 rounded-xl border border-zinc-200 flex items-center justify-center text-indigo-600 hover:bg-indigo-50 transition"
                            title="Edit Service"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          {/* DELETE */}

                          <button
                            onClick={() =>
                              setDeletingId(
                                service.id
                              )
                            }
                            className="h-9 w-9 rounded-xl border border-zinc-200 flex items-center justify-center text-rose-600 hover:bg-rose-50 transition"
                            title="Delete Service"
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
                    No services found. Click{" "}
                    <span className="font-semibold">
                      "Add New Service"
                    </span>{" "}
                    to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================
          ADD / EDIT SERVICE MODAL
      ======================================== */}

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
              className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* MODAL HEADER */}

              <div className="flex items-center justify-between bg-[#5B4BFF] px-6 py-4 text-white">
                <div className="flex items-center gap-2">
                  <Layers3 className="w-5 h-5" />

                  <h3 className="text-lg font-semibold">
                    {editingService
                      ? "Edit Service"
                      : "Add New Service"}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={
                    saving || uploading
                  }
                  className="rounded-lg p-2 hover:bg-white/10 transition disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* FORM */}

              <form
                onSubmit={handleSave}
                className="p-6 space-y-5 overflow-y-auto"
              >
                {/* TITLE + CATEGORY */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* TITLE */}

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-700">
                      Service Title *
                    </label>

                    <input
                      required
                      value={
                        formData.title
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          title:
                            e.target.value,
                        })
                      }
                      placeholder="e.g. Taxation & Regulatory Advisory"
                      className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:ring-4 focus:ring-[#102B55]/10 focus:border-[#102B55] text-sm"
                    />
                  </div>

                  {/* CATEGORY */}

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-700">
                      Category *
                    </label>

                    <input
                      required
                      value={
                        formData.category
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category:
                            e.target.value,
                        })
                      }
                      placeholder="e.g. Accounting, Taxation, Advisory"
                      className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:ring-4 focus:ring-[#102B55]/10 focus:border-[#102B55] text-sm"
                    />
                  </div>
                </div>

                {/* PATH */}

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-700">
                    Service Route / Path
                  </label>

                  <input
                    value={formData.path}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        path: e.target.value,
                      })
                    }
                    placeholder="/services/accounting-financial-reporting"
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:ring-4 focus:ring-[#102B55]/10 focus:border-[#102B55] text-sm"
                  />
                </div>

                {/* IMAGE */}

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-700">
                    Service Image Asset
                  </label>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 flex items-center gap-3 rounded-xl border border-zinc-200 px-4 py-3">
                      <Image className="w-4 h-4 text-zinc-500 shrink-0" />

                      <input
                        value={
                          formData.image
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            image:
                              e.target.value,
                          })
                        }
                        placeholder="Image URL or upload a file"
                        className="flex-1 outline-none text-sm min-w-0"
                      />
                    </div>

                    <label className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-700 cursor-pointer transition">
                      <Upload className="w-4 h-4 text-indigo-600" />

                      {uploading
                        ? "Uploading..."
                        : "Upload"}

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={
                          uploading
                        }
                        onChange={(e) => {
                          handleFileUpload(
                            e.target
                              .files?.[0]
                          );

                          e.target.value =
                            "";
                        }}
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
                        alt="Service Preview"
                        className="h-20 w-20 rounded-xl object-cover border border-zinc-200"
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* DESCRIPTION */}

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-700">
                    Description *
                  </label>

                  <textarea
                    required
                    rows={5}
                    value={
                      formData.description
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description:
                          e.target.value,
                      })
                    }
                    placeholder="Brief description of the service and value proposition..."
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:ring-4 focus:ring-[#102B55]/10 focus:border-[#102B55] text-sm resize-none"
                  />
                </div>

                {/* BUTTONS */}

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={
                      saving ||
                      uploading
                    }
                    className="rounded-xl bg-zinc-100 px-5 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-200 transition disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      saving ||
                      uploading
                    }
                    className="rounded-xl bg-[#18D1B2] px-6 py-3 text-sm font-semibold text-[#082032] hover:brightness-95 transition disabled:opacity-60 flex items-center gap-2"
                  >
                    {saving && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}

                    {saving
                      ? "Saving..."
                      : editingService
                      ? "Update Service"
                      : "Create Service"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================
          DELETE CONFIRMATION MODAL
      ======================================== */}

      <AnimatePresence>
        {deletingId && (
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
                !isDeleting &&
                setDeletingId(null)
              }
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
                  Delete Service?
                </h3>
              </div>

              <p className="text-zinc-600 text-sm leading-relaxed">
                Are you sure you want to
                remove this service? It will
                no longer appear on the
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
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}

                  {isDeleting
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}