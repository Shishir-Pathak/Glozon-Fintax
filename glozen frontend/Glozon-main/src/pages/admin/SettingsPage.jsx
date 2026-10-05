import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Clock3,
  Edit3,
  MapPin,
  Phone,
  Globe,
  Loader2,
  X,
  Upload,
  Save,
  CheckCircle,
} from "lucide-react";

import { toast } from "react-toastify";
import API from "../../API/Api";
import { useContent } from "../../context/ContentContext";
import {
  uploadAssetFile,
  getAssetUrl,
} from "../../utils/assets";

const DEFAULT_DECLARATION =
  "I declare that the information provided above is true and correct to the best of my knowledge and belief.\n\nI authorize Glozon FinTax & Advisory Pvt. Ltd. to act on my behalf in relation to my taxation and accounting affairs.";

export default function SettingsPage() {
  const {
    settings: contextSettings,
    refreshContent,
  } = useContent();

  const [settings, setSettings] =
    useState(contextSettings);

  const [isEditModalOpen, setIsEditModalOpen] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [formData, setFormData] = useState({
    ...contextSettings,
    declaration:
      contextSettings?.declaration ||
      DEFAULT_DECLARATION,
  });

  // ==========================================
  // FETCH SETTINGS
  // ==========================================

  const fetchSettings = async () => {
    try {
      const res = await API.get("/settings");

      if (res.data) {
        const data = {
          ...res.data,
          declaration:
            res.data.declaration ||
            DEFAULT_DECLARATION,
        };

        setSettings(data);
        setFormData(data);
      }
    } catch (error) {
      console.error(
        "Error fetching settings:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load settings."
      );
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchSettings();
  }, []);

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const openEditModal = () => {
    setFormData({
      ...settings,
      declaration:
        settings?.declaration ||
        DEFAULT_DECLARATION,
    });

    setIsEditModalOpen(true);
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
          logo: url,
        }));

        toast.success(
          "Logo uploaded successfully!"
        );
      } else {
        toast.error(
          "Logo upload failed."
        );
      }
    } catch (error) {
      console.error(
        "Failed to upload logo:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to upload logo image."
      );
    } finally {
      setUploading(false);
    }
  };

  // ==========================================
  // SAVE SETTINGS
  // ==========================================

  const handleSaveSettings = async (e) => {
    e.preventDefault();

    if (saving) return;

    setSaving(true);

    try {
      const payload = {
        ...formData,

        declaration:
          formData.declaration?.trim() ||
          DEFAULT_DECLARATION,
      };

      console.log(
        "SETTINGS BEING SAVED:",
        payload
      );

      const res = await API.put(
        "/settings",
        payload,
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

      const updatedSettings = {
        ...res.data,

        declaration:
          res.data.declaration ||
          payload.declaration ||
          DEFAULT_DECLARATION,
      };

      console.log(
        "UPDATED SETTINGS:",
        updatedSettings
      );

      setSettings(updatedSettings);

      await refreshContent();

      setIsEditModalOpen(false);

      toast.success(
        "Settings updated successfully!"
      );
    } catch (error) {
      console.error(
        "Error updating settings:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to save settings."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (!settings) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600 w-8 h-8" />
      </div>
    );
  }

  // ==========================================
  // CONTACT ITEMS
  // ==========================================

  const contactItems = [
    {
      label: "Primary Email",
      value: settings.primaryEmail,
    },
    {
      label: "Secondary Email",
      value:
        settings.secondaryEmail ||
        "N/A",
    },
    {
      label: "Primary Phone",
      value: settings.primaryPhone,
    },
    {
      label: "Secondary Phone",
      value:
        settings.secondaryPhone ||
        "N/A",
    },
    {
      label: "WhatsApp",
      value:
        settings.whatsapp || "N/A",
    },
  ];

  const openDays = (
    settings.businessHours || []
  ).filter((item) => item.isOpen);

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="space-y-6">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

        <div>
          <p className="text-indigo-600 text-sm font-semibold uppercase tracking-wider">
            Admin Settings
          </p>

          <h1 className="text-3xl font-bold text-slate-900 mt-1">
            Company & Site Information
          </h1>

          <p className="text-slate-500 mt-1">
            Manage company brand assets, contact
            channels, onboarding declaration, and
            office hours.
          </p>
        </div>

        <button
          onClick={openEditModal}
          className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-2xl flex items-center gap-2 font-semibold text-sm transition shadow-sm"
        >
          <Edit3 size={18} />
          Edit Information
        </button>
      </div>

      {/* ==========================================
          MAIN CONTENT
      ========================================== */}

      <div className="grid lg:grid-cols-[360px_1fr] gap-6">

        {/* ========================================
            LEFT
        ======================================== */}

        <div className="space-y-6">

          {/* BRAND */}

          <div className="bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden">

            <div className="h-28 bg-gradient-to-r from-[#102B55] to-indigo-600" />

            <div className="p-6 text-center">

              <img
                src={getAssetUrl(
                  settings.logo ||
                    "/Logo.png"
                )}
                alt="logo"
                className="w-28 h-28 rounded-2xl mx-auto object-contain -mt-14 border-4 border-white bg-white shadow-md p-2"
              />

              <h2 className="text-2xl font-bold mt-4 text-zinc-900">
                {settings.companyName}
              </h2>

              <p className="text-slate-500 text-sm mt-1">
                {settings.tagline}
              </p>

            </div>
          </div>

          {/* CONTACT */}

          <div className="bg-white rounded-3xl shadow-sm border border-zinc-200 p-6">

            <div className="flex items-center gap-3 mb-5">

              <Phone className="text-indigo-600 w-5 h-5" />

              <h2 className="font-bold text-lg text-zinc-900">
                Contact Information
              </h2>

            </div>

            <div className="divide-y divide-zinc-100">

              {contactItems.map(
                (item) => (
                  <div
                    key={item.label}
                    className="py-3"
                  >
                    <p className="text-xs uppercase text-slate-400 font-semibold">
                      {item.label}
                    </p>

                    <p className="font-medium text-sm text-zinc-800 mt-0.5">
                      {item.value}
                    </p>
                  </div>
                )
              )}

            </div>
          </div>

        </div>

        {/* ========================================
            RIGHT
        ======================================== */}

        <div className="space-y-6">

          <div className="grid md:grid-cols-2 gap-6">

            {/* ADDRESS */}

            <div className="bg-white rounded-3xl shadow-sm border border-zinc-200 p-6 flex flex-col justify-between">

              <div>

                <div className="flex gap-3 mb-4 items-center">

                  <MapPin className="text-rose-500 w-5 h-5" />

                  <h2 className="font-bold text-lg text-zinc-900">
                    Registered Office
                  </h2>

                </div>

                <p className="text-zinc-700 text-sm leading-relaxed">
                  {settings.address}
                </p>

              </div>

              <div className="pt-4 border-t border-zinc-100 mt-4 flex items-center justify-between">

                <a
                  href={
                    settings.website ||
                    "#"
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1.5 text-sm"
                >
                  <Globe className="w-4 h-4" />

                  Visit Website

                  <ArrowUpRight size={14} />
                </a>

                {settings.googleMapUrl && (
                  <span className="text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
                    Map Connected
                  </span>
                )}

              </div>
            </div>

            {/* BUSINESS HOURS */}

            <div className="bg-white rounded-3xl shadow-sm border border-zinc-200 p-6">

              <div className="flex gap-3 mb-4 items-center">

                <Clock3 className="text-amber-500 w-5 h-5" />

                <h2 className="font-bold text-lg text-zinc-900">
                  Business Hours
                </h2>

              </div>

              <div className="divide-y divide-zinc-100 text-sm">

                {(settings.businessHours ||
                  []
                ).map((item) => (

                  <div
                    key={item.day}
                    className="flex justify-between py-2.5 text-zinc-700"
                  >

                    <span className="font-medium">
                      {item.day}
                    </span>

                    <span
                      className={
                        item.isOpen
                          ? "text-zinc-900"
                          : "text-zinc-400 italic"
                      }
                    >
                      {item.isOpen
                        ? `${item.openTime} - ${item.closeTime}`
                        : "Closed"}
                    </span>

                  </div>

                ))}

              </div>
            </div>

          </div>

          {/* DECLARATION PREVIEW */}

          <div className="bg-white rounded-3xl shadow-sm border border-zinc-200 p-6">

            <div className="flex items-center gap-3 mb-4">

              <CheckCircle className="text-indigo-600 w-5 h-5" />

              <h2 className="font-bold text-lg text-zinc-900">
                Client Onboarding Declaration
              </h2>

            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">

              {(
                settings.declaration ||
                DEFAULT_DECLARATION
              )
                .split("\n")
                .map(
                  (text, index) => (
                    <p
                      key={index}
                      className="text-sm text-slate-700 leading-relaxed mb-3 last:mb-0"
                    >
                      {text}
                    </p>
                  )
                )}

            </div>
          </div>

          {/* SYSTEM SUMMARY */}

          <div className="grid md:grid-cols-3 gap-5">

            <div className="bg-white rounded-3xl shadow-sm border border-zinc-200 p-5">

              <p className="text-xs text-zinc-400 font-semibold uppercase">
                Platform Status
              </p>

              <h2 className="text-xl font-bold text-emerald-600 mt-1">
                Active & Live
              </h2>

            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-zinc-200 p-5">

              <p className="text-xs text-zinc-400 font-semibold uppercase">
                Operating Days
              </p>

              <h2 className="text-xl font-bold text-zinc-900 mt-1">
                {openDays.length
                  ? `${openDays[0].day} - ${
                      openDays[
                        openDays.length -
                          1
                      ].day
                    }`
                  : "Not configured"}
              </h2>

            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-zinc-200 p-5">

              <p className="text-xs text-zinc-400 font-semibold uppercase">
                Offshore Support
              </p>

              <h2 className="text-xl font-bold text-indigo-600 mt-1">
                24/5 GMT +5:45
              </h2>

            </div>

          </div>

        </div>
      </div>

      {/* ==========================================
          EDIT MODAL
      ========================================== */}

      <AnimatePresence>

        {isEditModalOpen && (

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
              className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >

              {/* MODAL HEADER */}

              <div className="flex items-center justify-between bg-[#102B55] px-6 py-4 text-white">

                <h3 className="text-lg font-semibold">
                  Edit Company & Site Settings
                </h3>

                <button
                  type="button"
                  onClick={() =>
                    !saving &&
                    setIsEditModalOpen(
                      false
                    )
                  }
                  className="rounded-lg p-2 hover:bg-white/10 transition disabled:opacity-50"
                  disabled={saving}
                >
                  <X className="w-5 h-5" />
                </button>

              </div>

              {/* FORM */}

              <form
                onSubmit={
                  handleSaveSettings
                }
                className="p-6 overflow-y-auto space-y-6 flex-1"
              >

                {/* BRAND */}

                <div className="space-y-4">

                  <h4 className="font-bold text-zinc-900 border-b pb-2">
                    Brand & Logo
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* COMPANY NAME */}

                    <div>

                      <label className="text-xs font-semibold text-zinc-600 block mb-1">
                        Company Name
                      </label>

                      <input
                        type="text"
                        value={
                          formData.companyName ||
                          ""
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            companyName:
                              e.target
                                .value,
                          })
                        }
                        className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm"
                      />

                    </div>

                    {/* TAGLINE */}

                    <div>

                      <label className="text-xs font-semibold text-zinc-600 block mb-1">
                        Tagline / Slogan
                      </label>

                      <input
                        type="text"
                        value={
                          formData.tagline ||
                          ""
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tagline:
                              e.target
                                .value,
                          })
                        }
                        className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm"
                      />

                    </div>

                  </div>

                  {/* LOGO */}

                  <div>

                    <label className="text-xs font-semibold text-zinc-600 block mb-1">
                      Logo Asset URL / Upload
                    </label>

                    <div className="flex gap-2 items-center">

                      <input
                        type="text"
                        value={
                          formData.logo ||
                          ""
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            logo: e.target
                              .value,
                          })
                        }
                        className="flex-1 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm"
                        placeholder="/Logo.png"
                      />

                      <label className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 cursor-pointer transition">

                        <Upload className="w-4 h-4 text-indigo-600" />

                        {uploading
                          ? "Uploading..."
                          : "Upload Logo"}

                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={
                            uploading
                          }
                          onChange={(e) =>
                            handleFileUpload(
                              e.target
                                .files?.[0]
                            )
                          }
                        />

                      </label>

                    </div>
                  </div>

                </div>

                {/* CLIENT ONBOARDING DECLARATION */}

                <div className="space-y-4">

                  <h4 className="font-bold text-zinc-900 border-b pb-2">
                    Client Onboarding Declaration
                  </h4>

                  <div>

                    <label className="text-xs font-semibold text-zinc-600 block mb-1">
                      Declaration
                    </label>

                    <textarea
                      rows={7}
                      value={
                        formData.declaration ||
                        ""
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          declaration:
                            e.target
                              .value,
                        })
                      }
                      className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                      placeholder="Enter the declaration shown on the Client Onboarding form..."
                    />

                    <p className="text-xs text-slate-400 mt-1">
                      This text will appear
                      inside the Declaration
                      section of the Client
                      Onboarding form.
                    </p>

                  </div>

                </div>

                {/* CONTACT */}

                <div className="space-y-4">

                  <h4 className="font-bold text-zinc-900 border-b pb-2">
                    Contact Channels
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* PRIMARY EMAIL */}

                    <div>

                      <label className="text-xs font-semibold text-zinc-600 block mb-1">
                        Primary Email
                      </label>

                      <input
                        type="email"
                        value={
                          formData.primaryEmail ||
                          ""
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            primaryEmail:
                              e.target
                                .value,
                          })
                        }
                        className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm"
                      />

                    </div>

                    {/* PRIMARY PHONE */}

                    <div>

                      <label className="text-xs font-semibold text-zinc-600 block mb-1">
                        Primary Phone
                      </label>

                      <input
                        type="text"
                        value={
                          formData.primaryPhone ||
                          ""
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            primaryPhone:
                              e.target
                                .value,
                          })
                        }
                        className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm"
                      />

                    </div>

                    {/* ADDRESS */}

                    <div>

                      <label className="text-xs font-semibold text-zinc-600 block mb-1">
                        Office Address
                      </label>

                      <input
                        type="text"
                        value={
                          formData.address ||
                          ""
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address:
                              e.target
                                .value,
                          })
                        }
                        className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm"
                      />

                    </div>

                    {/* GOOGLE MAP */}

                    <div>

                      <label className="text-xs font-semibold text-zinc-600 block mb-1">
                        Google Maps Embed URL
                      </label>

                      <input
                        type="text"
                        value={
                          formData.googleMapUrl ||
                          ""
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            googleMapUrl:
                              e.target
                                .value,
                          })
                        }
                        className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm"
                        placeholder="https://www.google.com/maps?q=...&output=embed"
                      />

                    </div>

                  </div>

                </div>

                {/* SOCIAL */}

                <div className="space-y-4">

                  <h4 className="font-bold text-zinc-900 border-b pb-2">
                    Social Channels & Footer
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* LINKEDIN */}

                    <div>

                      <label className="text-xs font-semibold text-zinc-600 block mb-1">
                        LinkedIn URL
                      </label>

                      <input
                        type="url"
                        value={
                          formData.linkedin ||
                          ""
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            linkedin:
                              e.target
                                .value,
                          })
                        }
                        className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm"
                      />

                    </div>

                    {/* FACEBOOK */}

                    <div>

                      <label className="text-xs font-semibold text-zinc-600 block mb-1">
                        Facebook URL
                      </label>

                      <input
                        type="url"
                        value={
                          formData.facebook ||
                          ""
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            facebook:
                              e.target
                                .value,
                          })
                        }
                        className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm"
                      />

                    </div>

                  </div>

                  {/* FOOTER DESCRIPTION */}

                  <div>

                    <label className="text-xs font-semibold text-zinc-600 block mb-1">
                      Footer Short Description
                    </label>

                    <textarea
                      rows={2}
                      value={
                        formData.footerDescription ||
                        ""
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          footerDescription:
                            e.target
                              .value,
                        })
                      }
                      className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm"
                    />

                  </div>

                </div>

                {/* BUTTONS */}

                <div className="flex items-center justify-end gap-3 pt-4 border-t">

                  <button
                    type="button"
                    disabled={saving}
                    onClick={() =>
                      setIsEditModalOpen(
                        false
                      )
                    }
                    className="rounded-xl bg-zinc-100 px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-200 transition disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      saving ||
                      uploading
                    }
                    className="rounded-xl bg-[#18D1B2] px-6 py-2.5 text-sm font-semibold text-[#082032] hover:brightness-95 transition disabled:opacity-60 flex items-center gap-2"
                  >

                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}

                    {saving
                      ? "Saving..."
                      : "Save Settings"}

                  </button>

                </div>

              </form>
            </motion.div>

          </div>

        )}

      </AnimatePresence>

    </div>
  );
}