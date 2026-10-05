import React, { useState, useEffect } from "react";
import {
  Plus,
  ClipboardList,
  BarChart3,
  ShieldCheck,
  Users,
  FileText,
  Clock3,
  AlertTriangle,
  Image,
  Save,
  Upload,
  Sparkles,
  CheckCircle,
  Loader2,
  Trash2,
} from "lucide-react";

import toast from "react-hot-toast";

import API from "../../API/Api";
import { useContent } from "../../context/ContentContext";
import { uploadAssetFile, getAssetUrl } from "../../utils/assets";
import PartnerPage from "./PartnerPage";

const activities = [
  {
    time: "09:42",
    client: "R. Whitfield",
    action: "Declaration signed",
    status: "Complete",
    color: "bg-green-100 text-green-700",
  },
  {
    time: "09:15",
    client: "Solent Trading Pty Ltd",
    action: "Onboarding submitted",
    status: "Pending",
    color: "bg-amber-100 text-amber-700",
  },
  {
    time: "08:57",
    client: "M. Okafor",
    action: "Tax ID verified",
    status: "Complete",
    color: "bg-green-100 text-green-700",
  },
  {
    time: "08:30",
    client: "Harrow & Vale Partners",
    action: "ATO correspondence received",
    status: "Action needed",
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    time: "Yesterday",
    client: "J. Delacroix",
    action: "Lodgment overdue",
    status: "Overdue",
    color: "bg-red-100 text-red-700",
  },
];

export default function Dashboard() {
  const { content, refreshContent } = useContent();

  const [activeTab, setActiveTab] = useState("hero");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState("");

  // ==========================================
  // LOCAL CONTENT STATE
  // ==========================================

  const [heroForm, setHeroForm] = useState(content?.hero || {});
  const [aboutForm, setAboutForm] = useState(content?.about || {});
  const [whyForm, setWhyForm] = useState(content?.whyChooseUs || {});
  const [missionForm, setMissionForm] = useState(content?.mission || {});

  // ==========================================
  // UPDATE LOCAL STATE WHEN CONTENT CHANGES
  // ==========================================

  useEffect(() => {
    if (content?.hero) {
      setHeroForm(content.hero);
    }

    if (content?.about) {
      setAboutForm(content.about);
    }

    if (content?.whyChooseUs) {
      setWhyForm(content.whyChooseUs);
    }

    if (content?.mission) {
      setMissionForm(content.mission);
    }
  }, [content]);

  // ==========================================
  // SAVE CONTENT SECTION
  // ==========================================

  const handleSaveSection = async (sectionKey, data) => {
    setSaving(true);
    setSaveSuccess("");

    try {
      await API.put(
        `/content/${sectionKey}`,
        { data },
        {
          headers: {
            Authorization:
              "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      await refreshContent();

      const successMessage = `${sectionKey.toUpperCase()} section updated successfully!`;

      setSaveSuccess(successMessage);

      // SUCCESS TOAST
      toast.success(successMessage);

      setTimeout(() => {
        setSaveSuccess("");
      }, 4000);
    } catch (err) {
      console.error(`Error saving ${sectionKey}:`, err);

      // ERROR TOAST
      toast.error(`Failed to save ${sectionKey} section`);
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // FILE UPLOAD
  // ==========================================

  const handleFileUpload = async (file, onUploaded) => {
    if (!file) return;

    setUploading(true);

    try {
      const url = await uploadAssetFile(file);

      if (url) {
        onUploaded(url);

        // SUCCESS TOAST
        toast.success("Asset uploaded successfully!");
      } else {
        // ERROR TOAST
        toast.error("Failed to upload asset file.");
      }
    } catch (err) {
      console.error("Asset upload failed:", err);

      // ERROR TOAST
      toast.error("Failed to upload asset file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">

      {/* ==========================================
          HERO BANNER
      ========================================== */}

      <section className="relative overflow-hidden rounded-3xl bg-[#102B55] text-white p-8 md:p-10">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_35%)]" />

        <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-8">

          <div className="max-w-2xl">

            <p className="text-xs tracking-[0.28em] uppercase text-white/60 font-semibold">
              Glozon Fintax & Advisory — Internal Portal
            </p>

            <h2 className="mt-4 text-4xl md:text-5xl font-semibold">
              Good morning, Admin.
            </h2>

            <p className="mt-4 text-white/70">
              Manage website content, assets, client applications,
              and services.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">

              <ActionButton
                icon={Plus}
                label="New Client"
                primary
              />

              <ActionButton
                icon={ClipboardList}
                label="View Declarations"
              />

              <ActionButton
                icon={BarChart3}
                label="Generate Report"
              />

            </div>
          </div>

          <div className="flex justify-center md:justify-end">

            <div className="w-28 h-28 rounded-full border border-dashed border-[#D4A74A] flex items-center justify-center">

              <div className="text-center text-[#D4A74A]">

                <ShieldCheck className="w-6 h-6 mx-auto mb-2" />

                <p className="text-[10px] font-semibold tracking-[0.22em] uppercase">
                  Verified
                  <br />
                  System
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ==========================================
          STATS CARDS
      ========================================== */}

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        <StatCard
          icon={Users}
          value="248"
          label="Active Clients"
          change="+12"
          iconBg="bg-emerald-100 text-emerald-600"
        />

        <StatCard
          icon={FileText}
          value="31"
          label="Declarations Signed"
          change="+6"
          iconBg="bg-indigo-100 text-indigo-600"
        />

        <StatCard
          icon={Clock3}
          value="9"
          label="Pending Review"
          change="-2"
          iconBg="bg-amber-100 text-amber-600"
        />

        <StatCard
          icon={AlertTriangle}
          value="4"
          label="Overdue Lodgments"
          change="+1"
          iconBg="bg-rose-100 text-rose-600"
        />

      </section>

      {/* ==========================================
          CONTENT & ASSET MANAGER
      ========================================== */}

      <section className="rounded-3xl border border-zinc-200 bg-white shadow-sm overflow-hidden">

        {/* HEADER */}

        <div className="p-6 border-b border-zinc-200 bg-zinc-50 flex flex-col md:flex-row md:items-center justify-between gap-4">

          <div>

            <div className="flex items-center gap-2">

              <Sparkles className="w-5 h-5 text-indigo-600" />

              <h3 className="text-2xl font-bold text-[#0F172A]">
                Site Content & Asset Editor
              </h3>

            </div>

            <p className="text-zinc-500 text-sm mt-1">
              Edit the text copy, slogans, banners, and image
              assets visible across the public website.
            </p>

          </div>

          {saveSuccess && (
            <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 border border-emerald-200 animate-pulse">

              <CheckCircle className="w-4 h-4" />

              {saveSuccess}

            </div>
          )}

        </div>

        {/* ==========================================
            TABS
        ========================================== */}

        <div className="flex border-b border-zinc-200 px-6 gap-2 bg-white overflow-x-auto">

          {[
            {
              id: "hero",
              label: "Hero Section",
            },
            {
              id: "about",
              label: "About Section",
            },
            {
              id: "whyChooseUs",
              label: "Why Choose Us",
            },
            {
              id: "mission",
              label: "Mission Statement",
            },
            {
              id: "partners",
              label: "Partners",
            },
          ].map((tab) => (

            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-4 font-semibold text-sm border-b-2 transition whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-[#5B4BFF] text-[#5B4BFF]"
                  : "border-transparent text-zinc-500 hover:text-zinc-800"
              }`}
            >
              {tab.label}
            </button>

          ))}

        </div>

        <div className="p-6 md:p-8">

          {/* ==========================================
              1. HERO SECTION
          ========================================== */}

          {activeTab === "hero" && (

            <form
              onSubmit={(e) => {
                e.preventDefault();

                handleSaveSection(
                  "hero",
                  heroForm
                );
              }}
              className="space-y-6"
            >

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div>

                  <label className="block text-sm font-semibold text-zinc-700 mb-2">
                    Heading Prefix
                  </label>

                  <input
                    type="text"
                    value={heroForm.headingPrefix || ""}
                    onChange={(e) =>
                      setHeroForm({
                        ...heroForm,
                        headingPrefix:
                          e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-[#102B55]/10 focus:border-[#102B55]"
                    placeholder="Glozon"
                  />

                </div>

                <div>

                  <label className="block text-sm font-semibold text-zinc-700 mb-2">
                    Heading Highlight
                  </label>

                  <input
                    type="text"
                    value={
                      heroForm.headingHighlight || ""
                    }
                    onChange={(e) =>
                      setHeroForm({
                        ...heroForm,
                        headingHighlight:
                          e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-[#102B55]/10 focus:border-[#102B55]"
                    placeholder="FinTax"
                  />

                </div>

                <div>

                  <label className="block text-sm font-semibold text-zinc-700 mb-2">
                    Heading Suffix
                  </label>

                  <input
                    type="text"
                    value={
                      heroForm.headingSuffix || ""
                    }
                    onChange={(e) =>
                      setHeroForm({
                        ...heroForm,
                        headingSuffix:
                          e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-[#102B55]/10 focus:border-[#102B55]"
                    placeholder="Advisory"
                  />

                </div>

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="block text-sm font-semibold text-zinc-700 mb-2">
                  Hero Description / Slogan
                </label>

                <textarea
                  rows={4}
                  value={
                    heroForm.description || ""
                  }
                  onChange={(e) =>
                    setHeroForm({
                      ...heroForm,
                      description:
                        e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-[#102B55]/10 focus:border-[#102B55]"
                  placeholder="Firm introduction and offshore advisory details..."
                />

              </div>

              {/* BUTTONS */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>

                  <label className="block text-sm font-semibold text-zinc-700 mb-2">
                    Primary Button Text & Link
                  </label>

                  <div className="flex gap-2">

                    <input
                      type="text"
                      value={
                        heroForm.primaryBtnText || ""
                      }
                      onChange={(e) =>
                        setHeroForm({
                          ...heroForm,
                          primaryBtnText:
                            e.target.value,
                        })
                      }
                      className="w-1/2 rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-[#102B55]"
                      placeholder="Button Text"
                    />

                    <input
                      type="text"
                      value={
                        heroForm.primaryBtnLink || ""
                      }
                      onChange={(e) =>
                        setHeroForm({
                          ...heroForm,
                          primaryBtnLink:
                            e.target.value,
                        })
                      }
                      className="w-1/2 rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-[#102B55]"
                      placeholder="/client-onboarding"
                    />

                  </div>

                </div>

                <div>

                  <label className="block text-sm font-semibold text-zinc-700 mb-2">
                    Secondary Button Text & Link
                  </label>

                  <div className="flex gap-2">

                    <input
                      type="text"
                      value={
                        heroForm.secondaryBtnText ||
                        ""
                      }
                      onChange={(e) =>
                        setHeroForm({
                          ...heroForm,
                          secondaryBtnText:
                            e.target.value,
                        })
                      }
                      className="w-1/2 rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-[#102B55]"
                      placeholder="Button Text"
                    />

                    <input
                      type="text"
                      value={
                        heroForm.secondaryBtnLink ||
                        ""
                      }
                      onChange={(e) =>
                        setHeroForm({
                          ...heroForm,
                          secondaryBtnLink:
                            e.target.value,
                        })
                      }
                      className="w-1/2 rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-[#102B55]"
                      placeholder="/contact-us"
                    />

                  </div>

                </div>

              </div>

              {/* HERO IMAGE */}

              <div className="rounded-2xl border border-zinc-200 p-5 bg-zinc-50 space-y-4">

                <h4 className="font-bold text-zinc-900 flex items-center gap-2">

                  <Image className="w-4 h-4 text-indigo-600" />

                  Hero Background Image / Slide

                </h4>

                <div className="flex flex-col md:flex-row gap-4 items-start">

                  <div className="flex-1 w-full space-y-3">

                    <input
                      type="text"
                      value={
                        heroForm.slides?.[0]?.src ||
                        ""
                      }
                      onChange={(e) => {

                        const newSlides = [
                          ...(heroForm.slides || [
                            { src: "" },
                          ]),
                        ];

                        newSlides[0] = {
                          ...newSlides[0],
                          src: e.target.value,
                        };

                        setHeroForm({
                          ...heroForm,
                          slides: newSlides,
                        });

                      }}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#102B55]"
                      placeholder="Image URL (e.g., /tax2.jpg or uploaded URL)"
                    />

                    <div className="flex items-center gap-3">

                      <label className="inline-flex items-center gap-2 rounded-xl bg-white border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 cursor-pointer transition shadow-sm">

                        <Upload className="w-4 h-4 text-indigo-600" />

                        {uploading
                          ? "Uploading..."
                          : "Upload New Image"}

                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(
                              e.target.files[0],
                              (url) => {

                                const newSlides = [
                                  ...(heroForm.slides || [
                                    { src: "" },
                                  ]),
                                ];

                                newSlides[0] = {
                                  ...newSlides[0],
                                  src: url,
                                  alt: "Glozon FinTax Banner",
                                };

                                setHeroForm({
                                  ...heroForm,
                                  slides: newSlides,
                                });

                              }
                            )
                          }
                        />

                      </label>

                      <span className="text-xs text-zinc-500">
                        Supports PNG, JPG, WEBP, SVG
                      </span>

                    </div>

                  </div>

                  {heroForm.slides?.[0]?.src && (

                    <div className="w-36 h-24 rounded-xl border border-zinc-200 overflow-hidden bg-black shrink-0">

                      <img
                        src={getAssetUrl(
                          heroForm.slides[0].src
                        )}
                        alt="Hero preview"
                        className="w-full h-full object-cover"
                      />

                    </div>

                  )}

                </div>

              </div>

              <div className="flex justify-end pt-4">

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#18D1B2] px-6 py-3 text-sm font-semibold text-[#082032] hover:brightness-95 transition shadow-sm disabled:opacity-60"
                >

                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}

                  Save Hero Section

                </button>

              </div>

            </form>
          )}

          {/* ==========================================
              2. ABOUT SECTION
          ========================================== */}

          {activeTab === "about" && (

            <form
              onSubmit={(e) => {
                e.preventDefault();

                handleSaveSection(
                  "about",
                  aboutForm
                );
              }}
              className="space-y-6"
            >

              <div>

                <label className="block text-sm font-semibold text-zinc-700 mb-2">
                  About Section Title
                </label>

                <input
                  type="text"
                  value={aboutForm.heading || ""}
                  onChange={(e) =>
                    setAboutForm({
                      ...aboutForm,
                      heading: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-[#102B55]"
                  placeholder="Discover Glozon FinTax & Advisory"
                />

              </div>

              <div>

                <label className="block text-sm font-semibold text-zinc-700 mb-2">
                  First Paragraph
                </label>

                <textarea
                  rows={4}
                  value={
                    aboutForm.paragraph1 || ""
                  }
                  onChange={(e) =>
                    setAboutForm({
                      ...aboutForm,
                      paragraph1:
                        e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-[#102B55]"
                />

              </div>

              <div>

                <label className="block text-sm font-semibold text-zinc-700 mb-2">
                  Second Paragraph
                </label>

                <textarea
                  rows={4}
                  value={
                    aboutForm.paragraph2 || ""
                  }
                  onChange={(e) =>
                    setAboutForm({
                      ...aboutForm,
                      paragraph2:
                        e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-[#102B55]"
                />

              </div>

              {/* LOGO */}

              <div className="rounded-2xl border border-zinc-200 p-5 bg-zinc-50 space-y-4">

                <h4 className="font-bold text-zinc-900 flex items-center gap-2">

                  <Image className="w-4 h-4 text-indigo-600" />

                  About Section Logo Asset

                </h4>

                <div className="flex flex-col md:flex-row gap-4 items-center">

                  <div className="flex-1 w-full space-y-3">

                    <input
                      type="text"
                      value={aboutForm.logo || ""}
                      onChange={(e) =>
                        setAboutForm({
                          ...aboutForm,
                          logo: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#102B55]"
                      placeholder="Logo URL (e.g. /assets/logo.png)"
                    />

                    <div className="flex items-center gap-3">

                      <label className="inline-flex items-center gap-2 rounded-xl bg-white border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 cursor-pointer transition shadow-sm">

                        <Upload className="w-4 h-4 text-indigo-600" />

                        Upload Logo Image

                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(
                              e.target.files[0],
                              (url) =>
                                setAboutForm({
                                  ...aboutForm,
                                  logo: url,
                                })
                            )
                          }
                        />

                      </label>

                    </div>

                  </div>

                  {aboutForm.logo && (

                    <div className="w-24 h-24 rounded-xl border border-zinc-200 p-2 bg-white flex items-center justify-center shrink-0">

                      <img
                        src={getAssetUrl(
                          aboutForm.logo
                        )}
                        alt="About logo preview"
                        className="max-h-full max-w-full object-contain"
                      />

                    </div>

                  )}

                </div>

              </div>

              <div className="flex justify-end pt-4">

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#18D1B2] px-6 py-3 text-sm font-semibold text-[#082032] hover:brightness-95 transition shadow-sm disabled:opacity-60"
                >

                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}

                  Save About Section

                </button>

              </div>

            </form>
          )}

          {/* ==========================================
              3. WHY CHOOSE US
          ========================================== */}

          {activeTab === "whyChooseUs" && (

            <form
              onSubmit={(e) => {
                e.preventDefault();

                handleSaveSection(
                  "whyChooseUs",
                  whyForm
                );
              }}
              className="space-y-6"
            >

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>

                  <label className="block text-sm font-semibold text-zinc-700 mb-2">
                    Section Title
                  </label>

                  <input
                    type="text"
                    value={whyForm.title || ""}
                    onChange={(e) =>
                      setWhyForm({
                        ...whyForm,
                        title: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-[#102B55]"
                    placeholder="Why Choose Us"
                  />

                </div>

                <div>

                  <label className="block text-sm font-semibold text-zinc-700 mb-2">
                    Header Icon / Image Asset
                  </label>

                  <div className="flex gap-2">

                    <input
                      type="text"
                      value={whyForm.image || ""}
                      onChange={(e) =>
                        setWhyForm({
                          ...whyForm,
                          image: e.target.value,
                        })
                      }
                      className="flex-1 rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-[#102B55]"
                      placeholder="/assets/Why-choose-us-150x150.png"
                    />

                    <label className="inline-flex items-center gap-2 rounded-xl bg-white border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 cursor-pointer transition shadow-sm">

                      <Upload className="w-4 h-4 text-indigo-600" />

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(
                            e.target.files[0],
                            (url) =>
                              setWhyForm({
                                ...whyForm,
                                image: url,
                              })
                          )
                        }
                      />

                    </label>

                  </div>

                </div>

              </div>

              {/* REASONS */}

              <div className="space-y-4">

                <div className="flex items-center justify-between">

                  <h4 className="font-bold text-zinc-900">
                    Why Choose Us Key Highlights (
                    {whyForm.reasons?.length || 0}
                    )
                  </h4>

                  <button
                    type="button"
                    onClick={() => {

                      const reasons = [
                        ...(whyForm.reasons || []),
                      ];

                      reasons.push({
                        title: "New Highlight",
                        description:
                          "Description of why clients choose us...",
                        color: "text-blue-500",
                        barColor: "bg-blue-500",
                        icon: "fi fi-rr-star",
                      });

                      setWhyForm({
                        ...whyForm,
                        reasons,
                      });

                      toast.success(
                        "New highlight reason added!"
                      );

                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 text-indigo-700 px-3 py-1.5 text-xs font-semibold hover:bg-indigo-100"
                  >

                    <Plus className="w-3.5 h-3.5" />

                    Add Highlight Reason

                  </button>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {whyForm.reasons?.map(
                    (reason, idx) => (

                      <div
                        key={idx}
                        className="rounded-2xl border border-zinc-200 p-4 bg-zinc-50 space-y-3 relative"
                      >

                        <button
                          type="button"
                          onClick={() => {

                            const reasons =
                              whyForm.reasons.filter(
                                (_, i) =>
                                  i !== idx
                              );

                            setWhyForm({
                              ...whyForm,
                              reasons,
                            });

                            toast.success(
                              "Highlight reason removed!"
                            );

                          }}
                          className="absolute top-3 right-3 text-zinc-400 hover:text-rose-600 p-1"
                        >

                          <Trash2 className="w-4 h-4" />

                        </button>

                        <input
                          type="text"
                          value={reason.title || ""}
                          onChange={(e) => {

                            const reasons = [
                              ...whyForm.reasons,
                            ];

                            reasons[idx] = {
                              ...reason,
                              title:
                                e.target.value,
                            };

                            setWhyForm({
                              ...whyForm,
                              reasons,
                            });

                          }}
                          className="w-full font-bold text-sm rounded-lg border border-zinc-200 bg-white px-3 py-2"
                          placeholder="Highlight Title"
                        />

                        <textarea
                          rows={3}
                          value={
                            reason.description || ""
                          }
                          onChange={(e) => {

                            const reasons = [
                              ...whyForm.reasons,
                            ];

                            reasons[idx] = {
                              ...reason,
                              description:
                                e.target.value,
                            };

                            setWhyForm({
                              ...whyForm,
                              reasons,
                            });

                          }}
                          className="w-full text-xs rounded-lg border border-zinc-200 bg-white px-3 py-2"
                          placeholder="Highlight details and explanation..."
                        />

                      </div>

                    )
                  )}

                </div>

              </div>

              <div className="flex justify-end pt-4">

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#18D1B2] px-6 py-3 text-sm font-semibold text-[#082032] hover:brightness-95 transition shadow-sm disabled:opacity-60"
                >

                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}

                  Save Why Choose Us Section

                </button>

              </div>

            </form>
          )}

          {/* ==========================================
              4. MISSION STATEMENT
          ========================================== */}

          {activeTab === "mission" && (

            <form
              onSubmit={(e) => {
                e.preventDefault();

                handleSaveSection(
                  "mission",
                  missionForm
                );
              }}
              className="space-y-6"
            >

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>

                  <label className="block text-sm font-semibold text-zinc-700 mb-2">
                    Mission Title
                  </label>

                  <input
                    type="text"
                    value={missionForm.title || ""}
                    onChange={(e) =>
                      setMissionForm({
                        ...missionForm,
                        title: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-[#102B55]"
                    placeholder="Our Mission Statement"
                  />

                </div>

                <div>

                  <label className="block text-sm font-semibold text-zinc-700 mb-2">
                    Background Image Asset
                  </label>

                  <div className="flex gap-2">

                    <input
                      type="text"
                      value={
                        missionForm.bgImage || ""
                      }
                      onChange={(e) =>
                        setMissionForm({
                          ...missionForm,
                          bgImage:
                            e.target.value,
                        })
                      }
                      className="flex-1 rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-[#102B55]"
                      placeholder="/mission.jpg"
                    />

                    <label className="inline-flex items-center gap-2 rounded-xl bg-white border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 cursor-pointer transition shadow-sm">

                      <Upload className="w-4 h-4 text-indigo-600" />

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(
                            e.target.files[0],
                            (url) =>
                              setMissionForm({
                                ...missionForm,
                                bgImage: url,
                              })
                          )
                        }
                      />

                    </label>

                  </div>

                </div>

              </div>

              {/* SUBTITLE */}

              <div>

                <label className="block text-sm font-semibold text-zinc-700 mb-2">
                  Subtitle
                </label>

                <textarea
                  rows={3}
                  value={
                    missionForm.subtitle || ""
                  }
                  onChange={(e) =>
                    setMissionForm({
                      ...missionForm,
                      subtitle:
                        e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-[#102B55]"
                />

              </div>

              {/* STATS */}

              <div className="space-y-4">

                <h4 className="font-bold text-zinc-900">
                  Mission Statistics & Counters
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {missionForm.stats?.map(
                    (stat, idx) => (

                      <div
                        key={idx}
                        className="rounded-2xl border border-zinc-200 p-4 bg-zinc-50 space-y-3"
                      >

                        <div className="flex items-center gap-3">

                          <span className="text-xs font-bold text-zinc-500 uppercase">
                            Target Count:
                          </span>

                          <input
                            type="number"
                            value={
                              stat.target || 0
                            }
                            onChange={(e) => {

                              const stats = [
                                ...missionForm.stats,
                              ];

                              stats[idx] = {
                                ...stat,
                                target:
                                  parseInt(
                                    e.target.value
                                  ) || 0,
                              };

                              setMissionForm({
                                ...missionForm,
                                stats,
                              });

                            }}
                            className="w-24 font-bold text-sm rounded-lg border border-zinc-200 bg-white px-3 py-1.5"
                          />

                        </div>

                        <textarea
                          rows={2}
                          value={stat.text || ""}
                          onChange={(e) => {

                            const stats = [
                              ...missionForm.stats,
                            ];

                            stats[idx] = {
                              ...stat,
                              text:
                                e.target.value,
                            };

                            setMissionForm({
                              ...missionForm,
                              stats,
                            });

                          }}
                          className="w-full text-xs rounded-lg border border-zinc-200 bg-white px-3 py-2"
                          placeholder="Stat description..."
                        />

                      </div>

                    )
                  )}

                </div>

              </div>

              <div className="flex justify-end pt-4">

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#18D1B2] px-6 py-3 text-sm font-semibold text-[#082032] hover:brightness-95 transition shadow-sm disabled:opacity-60"
                >

                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}

                  Save Mission Section

                </button>

              </div>

            </form>
          )}

          {/* ==========================================
              5. PARTNERS
          ========================================== */}

          {activeTab === "partners" && (
            <PartnerPage />
          )}

        </div>

      </section>

      {/* ==========================================
          RECENT ACTIVITY
      ========================================== */}

      <section className="rounded-3xl border border-zinc-200 bg-white shadow-sm overflow-hidden">

        <div className="flex items-center justify-between px-6 py-5 border-b">

          <h3 className="text-2xl font-semibold">
            Recent activity
          </h3>

          <span className="text-xs uppercase text-zinc-400">
            Live Ledger
          </span>

        </div>

        <div className="divide-y">

          {activities.map((item) => (

            <div
              key={item.time + item.client}
              className="grid grid-cols-[88px_1.3fr_1.5fr_auto] items-center gap-4 px-6 py-5 hover:bg-zinc-50 transition"
            >

              <div className="text-sm text-zinc-400">
                {item.time}
              </div>

              <div className="font-semibold">
                {item.client}
              </div>

              <div className="text-zinc-600">
                {item.action}
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${item.color}`}
              >
                {item.status}
              </span>

            </div>

          ))}

        </div>

      </section>

    </div>
  );
}

// ==========================================
// ACTION BUTTON
// ==========================================

function ActionButton({
  icon: Icon,
  label,
  primary,
}) {
  return (
    <button
      className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${
        primary
          ? "bg-[#18D1B2] text-[#082032] hover:brightness-95"
          : "border border-white/15 bg-white/5 text-white hover:bg-white/10"
      }`}
    >

      <Icon className="w-4 h-4" />

      {label}

    </button>
  );
}

// ==========================================
// STAT CARD
// ==========================================

function StatCard({
  icon: Icon,
  value,
  label,
  change,
  iconBg,
}) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">

      <div className="flex justify-between">

        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconBg}`}
        >
          <Icon className="w-6 h-6" />
        </div>

        <span className="text-sm text-zinc-400">
          {change}
        </span>

      </div>

      <div className="mt-6">

        <div className="text-4xl font-bold">
          {value}
        </div>

        <div className="mt-2 text-xs uppercase text-zinc-400">
          {label}
        </div>

      </div>

    </div>
  );
}