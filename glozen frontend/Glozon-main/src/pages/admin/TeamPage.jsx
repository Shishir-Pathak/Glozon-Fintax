import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Pencil, Trash2, X } from "lucide-react";
import API from "../../API/Api";

export default function TeamPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [team, setTeam] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    name: "",
    position: "",
    bio: "",
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get("/team", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        setTeam(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetch();
  }, []);

  const handleChange = (e) => {
    setModalData({ ...modalData, [e.target.name]: e.target.value });
  };
  let filtered = team;
  try {
    filtered = team?.filter(
      (m) =>
        m?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m?.position?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  } catch (e) {
    console.error(e);
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold text-[#0F172A]">Team Members</h2>
          <p className="text-zinc-500 mt-2 text-lg">
            Manage your team members and their roles.
          </p>
        </div>

        <button
          onClick={() => {
            setSelected(null);

            setModalData({ name: "", position: "", bio: "" });
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-[#18D1B2] px-4 py-3 text-sm font-semibold text-[#082032] hover:brightness-95 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Team Member
        </button>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />

            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or position..."
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 py-3 text-sm outline-none focus:ring-4 focus:ring-[#102B55]/10 focus:border-[#102B55]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700 w-20">
                  SN
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                  Position
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                  Image
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700 min-w-[240px]">
                  Bio
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-700 w-32">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-100">
              {filtered.length > 0 ? (
                filtered.map((member, index) => (
                  <tr key={member.id} className="hover:bg-zinc-50 transition">
                    <td className="px-6 py-5 text-sm font-medium text-zinc-500">
                      {index + 1}
                    </td>

                    <td className="px-6 py-5 font-semibold text-zinc-900 whitespace-nowrap">
                      {member.name}
                    </td>

                    <td className="px-6 py-5">
                      <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-100 whitespace-nowrap">
                        {member.position}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <img
                        src={member?.imageUrl || member?.image}
                        alt={member.name}
                        className="h-10 w-10 rounded-full object-cover border border-zinc-200"
                      />
                    </td>

                    <td className="px-6 py-5 text-zinc-600 text-sm max-w-[240px]">
                      <p className="truncate">{member.bio}</p>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelected(member);
                            setModalData({ ...member });
                            setIsModalOpen(true);
                          }}
                          className="h-9 w-9 rounded-xl border border-zinc-200 flex items-center justify-center text-indigo-600 hover:bg-indigo-50 transition"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          className="h-9 w-9 rounded-xl border border-zinc-200 flex items-center justify-center text-rose-600 hover:bg-rose-50 transition"
                          onClick={async () => {
                            try {
                              await API.delete("/team/" + member.id, {
                                headers: {
                                  Authorization:
                                    "Bearer " + localStorage.getItem("token"),
                                },
                              });
                              setTeam(team.filter((x) => x.id !== member.id));
                            } catch (e) {
                              console.error(e);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="h-40 text-center text-zinc-500 align-middle"
                  >
                    No team members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-100 px-6 py-4 bg-zinc-50/50">
          <p className="text-sm text-zinc-500">
            Showing {filtered.length} team members
          </p>

          <div className="flex gap-2">
            <button className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-500">
              Previous
            </button>
            <button className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-500">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between bg-[#5B4BFF] px-6 py-4 text-white">
              <h3 className="text-lg font-semibold">
                {selected ? "Edit Team Member" : "Add Team Member"}
              </h3>

              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelected(null);
                }}
                className="rounded-lg p-2 hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                try {
                  if (selected) {
                    await API.put(`/team/${selected.id}`, modalData, {
                      headers: {
                        Authorization:
                          "Bearer " + localStorage.getItem("token"),
                      },
                    });
                    setTeam(
                      team.map((item) =>
                        item.id === selected.id
                          ? { ...item, ...modalData }
                          : item,
                      ),
                    );
                  } else {
                    const res = await API.post("/team", modalData, {
                      headers: {
                        Authorization:
                          "Bearer " + localStorage.getItem("token"),
                      },
                    });
                    setTeam([...team, res.data || { ...modalData }]);
                  }
                  setModalData({});
                  setIsModalOpen(false);
                  setSelected(null);
                } catch (e) {
                  console.error(e);
                }
              }}
            >
              <div className="p-6 space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-600">
                    Name
                  </label>
                  <input
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:ring-4 focus:ring-[#102B55]/10 focus:border-[#102B55]"
                    name="name"
                    value={modalData.name || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-600">
                    Position
                  </label>
                  <input
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:ring-4 focus:ring-[#102B55]/10 focus:border-[#102B55]"
                    name="position"
                    value={modalData.position || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-600">
                    Image URL / File
                  </label>
                  <input
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:ring-4 focus:ring-[#102B55]/10 focus:border-[#102B55]"
                    name="imageUrl"
                    placeholder="Enter image URL"
                    value={modalData.imageUrl || modalData.image || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-600">
                    Bio
                  </label>
                  <textarea
                    rows={5}
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:ring-4 focus:ring-[#102B55]/10 focus:border-[#102B55]"
                    name="bio"
                    value={modalData.bio || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelected(null);
                    }}
                    className="rounded-xl bg-zinc-100 px-5 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-200 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="rounded-xl bg-[#18D1B2] px-5 py-3 text-sm font-semibold text-[#082032] hover:brightness-95 transition"
                  >
                    {selected ? "Update Team Member" : "Save Team Member"}
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
