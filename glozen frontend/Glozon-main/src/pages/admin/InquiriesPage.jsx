import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Eye, Trash2, Calendar, Mail, X } from "lucide-react";
import API from "../../API/Api";

export default function InquiriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [demoInquiries, setInquries] = useState([
    {
      id: 1,
      fullName: "John Smith",
      email: "john@example.com",
      mobile: "+61 412 345 678",
      country: "Australia",
      subject: "Tax Consultation",
      message:
        "I would like to discuss my business tax obligations for this financial year.",
      date: "2026-08-03",
    },
    {
      id: 2,
      fullName: "Sarah Johnson",
      email: "sarah@example.com",
      mobile: "+977 9812345678",
      country: "Nepal",
      subject: "Bookkeeping Services",
      message:
        "Can you provide bookkeeping services for a small retail business?",
      date: "2026-08-02",
    },
  ]);

  useEffect(() => {
    const getContacts = async () => {
      try {
        const res = await API.get("/contact", {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        });
        console.log(res.data);
        setInquries([...res.data]);
        console.log(demoInquiries);
      } catch (e) {
        console.error(e);
      }
    };

    getContacts();
  }, []);

  const filtered = demoInquiries.filter(
    (i) =>
      i?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i?.subject?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-4xl font-bold text-[#0F172A]">Contact Messages</h2>
        <p className="text-zinc-500 mt-2 text-lg">
          Review and manage inquiries sent through the contact form.
        </p>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />

            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email or subject..."
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 py-3 text-sm outline-none focus:ring-4 focus:ring-[#102B55]/10 focus:border-[#102B55]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-white border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700 w-16">
                  SN
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                  Mobile
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                  Country
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                  Subject
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700 min-w-[220px]">
                  Message
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700">
                  Date
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-700 w-36">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-100">
              {filtered.map((inquiry, index) => (
                <tr key={inquiry.id} className="hover:bg-zinc-50 transition">
                  <td className="px-6 py-5 text-sm font-medium text-zinc-500">
                    {index + 1}
                  </td>

                  <td className="px-6 py-5 font-semibold text-zinc-900 whitespace-nowrap">
                    {inquiry.fullName || inquiry.name}
                  </td>

                  <td className="px-6 py-5 text-zinc-600 whitespace-nowrap">
                    {inquiry.mobile || inquiry.phoneNumber}
                  </td>

                  <td className="px-6 py-5 text-zinc-600 whitespace-nowrap">
                    {inquiry.email}
                  </td>

                  <td className="px-6 py-5">
                    <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 whitespace-nowrap">
                      {inquiry.country}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-zinc-700 font-medium whitespace-nowrap">
                    {inquiry.subject || inquiry.subjects}
                  </td>

                  <td className="px-6 py-5 text-zinc-600 text-sm max-w-[220px]">
                    <p className="truncate">{inquiry.message}</p>
                  </td>

                  <td className="px-6 py-5 text-zinc-500 text-sm whitespace-nowrap">
                    {new Date(
                      inquiry.date || inquiry.updatedAt,
                    ).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedInquiry(inquiry)}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#18D1B2] px-3 py-2 text-sm font-semibold text-[#082032] hover:brightness-95 transition whitespace-nowrap"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>

                      <button
                        className="inline-flex items-center gap-2 rounded-xl bg-[#FF5B5B] px-3 py-2 text-sm font-semibold cursor-pointer text-white hover:brightness-95 transition whitespace-nowrap"
                        onClick={async () => {
                          await API.delete("/contact/" + inquiry.id, {
                            headers: {
                              Authorization:
                                "Bearer " + localStorage.getItem("token"),
                            },
                          });
                          setTimeout(
                            () =>
                              setInquries(
                                demoInquiries.filter((x) => x.id != inquiry.id),
                              ),
                            100,
                          );
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedInquiry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedInquiry(null)}
        >
          <div
            className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between bg-[#5B4BFF] px-6 py-4 text-white">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Inquiry Details</h3>
              </div>

              <button
                onClick={() => setSelectedInquiry(null)}
                className="rounded-lg p-2 hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <Info label="Full Name" value={selectedInquiry.fullName} />
              <Info label="Email" value={selectedInquiry.email} />
              <Info label="Mobile" value={selectedInquiry.mobile} />
              <Info label="Country" value={selectedInquiry.country} />

              <div className="rounded-2xl border border-zinc-200 p-5">
                <h4 className="font-semibold mb-2">Subject</h4>
                <p className="text-zinc-700">{selectedInquiry.subject}</p>
              </div>

              <div className="rounded-2xl border border-zinc-200 p-5">
                <h4 className="font-semibold mb-2">Message</h4>
                <p className="text-zinc-700 leading-relaxed whitespace-pre-wrap">
                  {selectedInquiry.message}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-zinc-100 pt-5">
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <Calendar className="w-4 h-4" />
                  Received on {new Date(selectedInquiry.date).toLocaleString()}
                </div>

                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border border-zinc-200 p-4">
      <div className="text-sm text-zinc-500 font-medium">{label}</div>
      <div className="mt-2 text-zinc-900 font-semibold break-words">
        {value}
      </div>
    </div>
  );
}
