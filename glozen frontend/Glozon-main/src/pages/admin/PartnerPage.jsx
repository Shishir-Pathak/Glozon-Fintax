import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Image,
  Upload,
  Link as LinkIcon,
} from "lucide-react";

import { toast } from "react-toastify";

import API from "../../API/Api";

export default function PartnerPage() {
  // =====================================================
  // STATE
  // =====================================================

  const [partners, setPartners] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedPartner, setSelectedPartner] = useState(null);

  const [name, setName] = useState("");

  const [logo, setLogo] = useState(null);

  const [preview, setPreview] = useState("");

  const [saving, setSaving] = useState(false);

  // =====================================================
  // FETCH PARTNERS
  // =====================================================

  const fetchPartners = async () => {
    try {
      setLoading(true);

      const response = await API.get("/partners");

      console.log("=================================");
      console.log("FETCH PARTNERS");
      console.log("PARTNERS RESPONSE:", response.data);
      console.log("=================================");

      const data = response.data?.data;

      if (Array.isArray(data)) {
        setPartners(data);
      } else {
        setPartners([]);
      }
    } catch (error) {
      console.error(
        "FETCH PARTNERS ERROR:",
        error.response?.data || error
      );

      setPartners([]);

      toast.error(
        error.response?.data?.message ||
          "Failed to load partners."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchPartners();
  }, []);

  // =====================================================
  // AUTO REFRESH WHEN ADMIN PAGE BECOMES VISIBLE
  // =====================================================

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log(
          "ADMIN PAGE VISIBLE → REFRESHING PARTNERS"
        );

        fetchPartners();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  // =====================================================
  // ALSO REFRESH WHEN WINDOW GETS FOCUS
  // =====================================================

  useEffect(() => {
    const handleWindowFocus = () => {
      console.log(
        "ADMIN WINDOW FOCUSED → REFRESHING PARTNERS"
      );

      fetchPartners();
    };

    window.addEventListener(
      "focus",
      handleWindowFocus
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleWindowFocus
      );
    };
  }, []);

  // =====================================================
  // OPEN ADD MODAL
  // =====================================================

  const openAddModal = () => {
    setSelectedPartner(null);

    setName("");

    setLogo(null);

    setPreview("");

    setIsModalOpen(true);
  };

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const openEditModal = (partner) => {
    setSelectedPartner(partner);

    setName(partner.name || "");

    setLogo(null);

    setPreview(partner.logoUrl || "");

    setIsModalOpen(true);
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeModal = () => {
    setIsModalOpen(false);

    setSelectedPartner(null);

    setName("");

    setLogo(null);

    setPreview("");
  };

  // =====================================================
  // HANDLE LOGO SELECT
  // =====================================================

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setLogo(file);

    const imageUrl = URL.createObjectURL(file);

    setPreview(imageUrl);
  };

  // =====================================================
  // OPEN PARTNER FORM
  // =====================================================

  const handleOpenPartnerForm = (partner) => {
    if (!partner?.slug) {
      toast.error(
        "Partner form link is not available."
      );

      return;
    }

    const formUrl = `/partner/${partner.slug}`;

    window.open(
      formUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // =====================================================
  // OPEN PARTNER SUBMISSIONS
  // =====================================================

  const handleViewSubmissions = (partner) => {
    if (!partner?.id) {
      return;
    }

    window.location.href =
      `/admin/partners/${partner.id}/submissions`;
  };

  // =====================================================
  // CREATE / UPDATE PARTNER
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // =================================================
    // VALIDATE NAME
    // =================================================

    if (!name.trim()) {
      toast.error(
        "Partner name is required."
      );

      return;
    }

    // =================================================
    // VALIDATE LOGO
    // =================================================

    if (!selectedPartner && !logo) {
      toast.error(
        "Partner logo is required."
      );

      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append(
        "name",
        name.trim()
      );

      if (logo) {
        formData.append(
          "logo",
          logo
        );
      }

      // =================================================
      // UPDATE PARTNER
      // =================================================

      if (selectedPartner) {
        const response = await API.put(
          `/partners/${selectedPartner.id}`,
          formData
        );

        console.log(
          "UPDATE PARTNER:",
          response.data
        );

        toast.success(
          response.data?.message ||
            "Partner updated successfully."
        );
      }

      // =================================================
      // CREATE PARTNER
      // =================================================

      else {
        const response = await API.post(
          "/partners",
          formData
        );

        console.log(
          "CREATE PARTNER:",
          response.data
        );

        toast.success(
          response.data?.message ||
            "Partner created successfully."
        );
      }

      // =================================================
      // GET LATEST DATA
      // =================================================

      await fetchPartners();

      // =================================================
      // CLOSE MODAL
      // =================================================

      closeModal();

    } catch (error) {
      console.error(
        "SAVE PARTNER ERROR:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to save partner."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE PARTNER
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this partner?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await API.delete(
        `/partners/${id}`
      );

      // Immediately remove from UI
      setPartners((prev) =>
        prev.filter(
          (partner) => partner.id !== id
        )
      );

      toast.success(
        response.data?.message ||
          "Partner deleted successfully."
      );

    } catch (error) {
      console.error(
        "DELETE PARTNER ERROR:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to delete partner."
      );
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredPartners = partners.filter(
    (partner) => {
      const search =
        searchTerm.toLowerCase();

      return (
        partner?.name
          ?.toLowerCase()
          .includes(search) ||

        partner?.slug
          ?.toLowerCase()
          .includes(search)
      );
    }
  );

  // =====================================================
  // UI
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

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex items-start justify-between gap-4">

        <div>

          <h2 className="text-4xl font-bold text-[#0F172A]">
            Partners
          </h2>

          <p className="text-zinc-500 mt-2 text-lg">
            Manage partners and view their registration
            information.
          </p>

        </div>

        <button
          onClick={openAddModal}
          className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            bg-[#18D1B2]
            px-4
            py-3
            text-sm
            font-semibold
            text-[#082032]
            hover:brightness-95
            transition
            shadow-sm
          "
        >

          <Plus className="w-4 h-4" />

          Add Partner

        </button>

      </div>

      {/* =================================================
          TABLE CARD
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

        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="p-4 border-b border-zinc-100">

          <div className="relative max-w-md">

            <Search
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                w-4
                h-4
                text-zinc-400
              "
            />

            <input
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
              placeholder="Search partners..."
              className="
                w-full
                rounded-xl
                border
                border-zinc-200
                bg-zinc-50
                pl-10
                pr-4
                py-3
                text-sm
                outline-none
                focus:ring-4
                focus:ring-[#102B55]/10
                focus:border-[#102B55]
              "
            />

          </div>

        </div>

        {/* =================================================
            TABLE
        ================================================= */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px]">

            <thead className="bg-white border-b border-zinc-200">

              <tr>

                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                  SN
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                  Logo
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                  Company Name
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                  Slug
                </th>

                <th className="px-6 py-4 text-center text-sm font-semibold text-zinc-700">
                  Status
                </th>

                <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-700">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-zinc-100">

              {/* =================================================
                  LOADING
              ================================================= */}

              {loading ? (

                <tr>

                  <td
                    colSpan={6}
                    className="h-40 text-center text-zinc-500"
                  >
                    Loading partners...
                  </td>

                </tr>

              ) : filteredPartners.length > 0 ? (

                filteredPartners.map(
                  (partner, index) => (

                    <tr
                      key={partner.id}
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

                      {/* LOGO */}

                      <td className="px-6 py-5">

                        <div
                          className="
                            h-14
                            w-14
                            rounded-xl
                            border
                            border-zinc-200
                            bg-white
                            flex
                            items-center
                            justify-center
                            overflow-hidden
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

                            <Image
                              className="
                                h-6
                                w-6
                                text-zinc-300
                              "
                            />

                          )}

                        </div>

                      </td>

                      {/* COMPANY NAME */}

                      <td className="px-6 py-5">

                        <button
                          type="button"
                          onClick={() =>
                            handleViewSubmissions(
                              partner
                            )
                          }
                          className="
                            font-semibold
                            text-indigo-600
                            hover:text-indigo-800
                            hover:underline
                            text-left
                            transition
                          "
                        >
                          {partner.name || "-"}
                        </button>

                        <p className="text-xs text-zinc-400 mt-1">
                          View submissions
                        </p>

                      </td>

                      {/* SLUG */}

                      <td className="px-6 py-5">

                        <span
                          className="
                            inline-block
                            rounded-lg
                            bg-zinc-100
                            px-3
                            py-1
                            text-xs
                            text-zinc-600
                          "
                        >
                          {partner.slug || "-"}
                        </span>

                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-5 text-center">

                        <span
                          className={`
                            inline-flex
                            items-center
                            rounded-full
                            px-3
                            py-1
                            text-xs
                            font-semibold
                            border

                            ${
                              partner.isActive
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                : "bg-red-50 text-red-700 border-red-100"
                            }
                          `}
                        >

                          {partner.isActive
                            ? "Active"
                            : "Inactive"}

                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td className="px-6 py-5">

                        <div
                          className="
                            flex
                            items-center
                            justify-end
                            gap-2
                          "
                        >

                          {/* =================================================
                              PARTNER FORM LINK
                          ================================================= */}

                          <button
                            onClick={() =>
                              handleOpenPartnerForm(
                                partner
                              )
                            }
                            title="Open Partner Form"
                            className="
                              h-9
                              w-9
                              rounded-xl
                              border
                              border-zinc-200
                              flex
                              items-center
                              justify-center
                              text-emerald-600
                              hover:bg-emerald-50
                              transition
                            "
                          >

                            <LinkIcon className="w-4 h-4" />

                          </button>

                          {/* =================================================
                              EDIT
                          ================================================= */}

                          <button
                            onClick={() =>
                              openEditModal(
                                partner
                              )
                            }
                            title="Edit Partner"
                            className="
                              h-9
                              w-9
                              rounded-xl
                              border
                              border-zinc-200
                              flex
                              items-center
                              justify-center
                              text-indigo-600
                              hover:bg-indigo-50
                              transition
                            "
                          >

                            <Pencil className="w-4 h-4" />

                          </button>

                          {/* =================================================
                              DELETE
                          ================================================= */}

                          <button
                            onClick={() =>
                              handleDelete(
                                partner.id
                              )
                            }
                            title="Delete Partner"
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
                    colSpan={6}
                    className="
                      h-40
                      text-center
                      text-zinc-500
                      align-middle
                    "
                  >
                    No partners found.
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

            Showing {filteredPartners.length}{" "}

            {filteredPartners.length === 1
              ? "partner"
              : "partners"}

          </p>

        </div>

      </div>

      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {isModalOpen && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
            p-4
          "
        >

          <div
            className="
              w-full
              max-w-lg
              rounded-3xl
              bg-white
              shadow-2xl
              overflow-hidden
            "
          >

            {/* =================================================
                MODAL HEADER
            ================================================= */}

            <div
              className="
                flex
                items-center
                justify-between
                bg-[#5B4BFF]
                px-6
                py-4
                text-white
              "
            >

              <h3 className="text-lg font-semibold">

                {selectedPartner
                  ? "Edit Partner"
                  : "Add Partner"}

              </h3>

              <button
                type="button"
                onClick={closeModal}
                className="
                  rounded-lg
                  p-2
                  hover:bg-white/10
                  transition
                "
              >

                <X className="w-5 h-5" />

              </button>

            </div>

            {/* =================================================
                FORM
            ================================================= */}

            <form onSubmit={handleSubmit}>

              <div className="p-6 space-y-5">

                {/* NAME */}

                <div className="space-y-2">

                  <label className="text-sm font-medium text-zinc-600">
                    Partner Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(
                        e.target.value
                      )
                    }
                    placeholder="Enter partner name"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-zinc-200
                      px-4
                      py-3
                      outline-none
                      focus:ring-4
                      focus:ring-[#102B55]/10
                      focus:border-[#102B55]
                    "
                  />

                </div>

                {/* LOGO */}

                <div className="space-y-2">

                  <label className="text-sm font-medium text-zinc-600">
                    Partner Logo
                  </label>

                  <label
                    className="
                      flex
                      cursor-pointer
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border-2
                      border-dashed
                      border-zinc-300
                      bg-zinc-50
                      px-4
                      py-6
                      hover:bg-zinc-100
                      transition
                    "
                  >

                    <Upload className="w-5 h-5 text-zinc-500" />

                    <span className="text-sm text-zinc-600">

                      {logo
                        ? logo.name
                        : "Choose partner logo"}

                    </span>

                    <input
                      type="file"
                      accept="
                        image/png,
                        image/jpeg,
                        image/jpg,
                        image/webp
                      "
                      onChange={
                        handleLogoChange
                      }
                      className="hidden"
                    />

                  </label>

                  <p className="text-xs text-zinc-400">
                    PNG, JPG, JPEG or WEBP.
                    Maximum 20MB.
                  </p>

                </div>

                {/* PREVIEW */}

                {preview && (

                  <div className="space-y-2">

                    <p className="text-sm font-medium text-zinc-600">
                      Logo Preview
                    </p>

                    <div
                      className="
                        h-32
                        rounded-xl
                        border
                        border-zinc-200
                        bg-zinc-50
                        flex
                        items-center
                        justify-center
                        overflow-hidden
                      "
                    >

                      <img
                        src={preview}
                        alt="Logo preview"
                        className="
                          max-h-full
                          max-w-full
                          object-contain
                          p-4
                        "
                      />

                    </div>

                  </div>

                )}

                {/* BUTTONS */}

                <div
                  className="
                    flex
                    items-center
                    justify-end
                    gap-3
                    pt-2
                  "
                >

                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={saving}
                    className="
                      rounded-xl
                      bg-zinc-100
                      px-5
                      py-3
                      text-sm
                      font-semibold
                      text-zinc-700
                      hover:bg-zinc-200
                      transition
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="
                      rounded-xl
                      bg-[#18D1B2]
                      px-5
                      py-3
                      text-sm
                      font-semibold
                      text-[#082032]
                      hover:brightness-95
                      transition
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                    "
                  >

                    {saving
                      ? "Saving..."
                      : selectedPartner
                        ? "Update Partner"
                        : "Save Partner"}

                  </button>

                </div>

              </div>

            </form>

          </div>

        </div>

      )}

    </motion.div>
  );
}