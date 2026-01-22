import { useState } from "react";
import { Users, CheckCircle, Layers } from "lucide-react";

export default function ApplicantsPage() {
  // Applicants data with rounds progress
  const [applicants, setApplicants] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      branch: "CSE",
      cgpa: 8.5,
      rounds: ["Cleared", "Cleared", "Rejected"],
      status: "Not Selected",
    },
    {
      id: 2,
      name: "Priya Patel",
      branch: "IT",
      cgpa: 8.9,
      rounds: ["Cleared", "Cleared", "Cleared"],
      status: "Selected",
    },
    {
      id: 3,
      name: "Amit Verma",
      branch: "CSE",
      cgpa: 8.2,
      rounds: ["Cleared", "Rejected"],
      status: "Not Selected",
    },
  ]);

  const [search, setSearch] = useState("");

  // Stats calculation
  const totalApplicants = applicants.length;
  const shortlisted = applicants.filter((a) =>
    a.rounds.includes("Cleared"),
  ).length;
  const selected = applicants.filter((a) => a.status === "Selected").length;

  // Filtered applicants based on search
  const filteredApplicants = applicants.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.branch.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6 w-full p-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-indigo-700">Applicants</h2>
        <p className="text-sm text-slate-500 mt-1">
          View the status and rounds progress of all applicants
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<Users />}
          label="Total Applicants"
          value={totalApplicants}
        />
        <StatCard
          icon={<Layers />}
          label="Shortlisted (Cleared at least 1 round)"
          value={shortlisted}
        />
        <StatCard icon={<CheckCircle />} label="Selected" value={selected} />
      </div>

      {/* Search Input */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Search by name or branch..."
          className="w-full md:w-1/3 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Applicants Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden mt-6">
        <TableHeader title="Applicants List" />
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Branch</th>
              <th className="px-6 py-3 text-left">CGPA</th>
              <th className="px-6 py-3 text-left">Process</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplicants.map((a) => (
              <tr key={a.id} className="border-t hover:bg-indigo-50">
                <td className="px-6 py-3 font-medium">{a.name}</td>
                <td className="px-6 py-3">{a.branch}</td>
                <td className="px-6 py-3 font-semibold">{a.cgpa}</td>

                {/* Process Rounds */}
                <td className="px-6 py-3 flex gap-2">
                  {a.rounds.map((r, i) => (
                    <span
                      key={i}
                      className={`w-45 p-5 h-5 flex items-center justify-center rounded-full text-white text-sm ${
                        r === "Cleared" ? "bg-green-600" : "bg-red-600"
                      }`}
                      title={`Round ${i + 1}: ${r}`}
                    >
                      Round {i + 1}: {r}
                      {r === "Cleared" ? " ✔" : " ✖"}
                    </span>
                  ))}
                </td>

                {/* Status */}
                <td className="px-6 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      a.status === "Selected"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Reusable Components ---------- */

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-lg transition">
      <div className="w-14 h-14 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );
}

function TableHeader({ title }) {
  return (
    <div className="h-14 px-6 flex items-center border-b font-semibold text-indigo-700">
      {title}
    </div>
  );
}
