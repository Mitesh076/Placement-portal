import { useState } from "react";
import { Users, CheckCircle, Layers, AlertCircle } from "lucide-react";

export default function ApplicantList() {
  /* ---------- MASTER FLOW STATE ---------- */
  const [requested, setRequested] = useState(false);

  /* ---------- APPLICANTS (Loaded AFTER request) ---------- */
  const applicantsData = [
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
  ];

  const [applicants, setApplicants] = useState([]);
  const [search, setSearch] = useState("");

  /* ---------- REQUEST HANDLER ---------- */
  const handleRequestApplicants = () => {
    setRequested(true);
    setApplicants(applicantsData); // simulate admin response
  };

  /* ---------- STATS (Only AFTER request) ---------- */
  const totalApplicants = requested ? applicants.length : "-";
  const shortlisted = requested
    ? applicants.filter((a) => a.rounds.includes("Cleared")).length
    : "-";
  const selected = requested
    ? applicants.filter((a) => a.status === "Selected").length
    : "-";

  /* ---------- SEARCH ---------- */
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
          Applicants received from admin after request
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Total Applicants"
          value={totalApplicants}
          icon={<Users />}
        />
        <StatCard label="Shortlisted" value={shortlisted} icon={<Layers />} />
        <StatCard label="Selected" value={selected} icon={<CheckCircle />} />
      </div>

      {/* REQUEST BANNER */}
      <StepBanner
        completed={requested}
        message={
          requested
            ? "Applicants received from admin"
            : "Request eligible and applied students from admin"
        }
        buttonLabel="Request Applicants"
        onClick={handleRequestApplicants}
      />

      {/* Search (only after request) */}
      {requested && (
        <input
          type="text"
          placeholder="Search by name or branch..."
          className="w-full md:w-1/3 p-2 border rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      )}

      {/* Applicants Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <TableHeader title="Applicants List" />

        {!requested ? (
          <div className="p-6 text-center text-slate-400">
            Applicants will appear here after requesting from admin
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Branch</th>
                <th className="px-6 py-3 text-left">CGPA</th>
                <th className="px-6 py-3 text-left">Process Summary</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplicants.map((a) => (
                <tr key={a.id} className="border-t hover:bg-indigo-50">
                  <td className="px-6 py-3 font-medium">{a.name}</td>
                  <td className="px-6 py-3">{a.branch}</td>
                  <td className="px-6 py-3 font-semibold">{a.cgpa}</td>

                  {/* ROUNDS SUMMARY */}
                  <td className="px-6 py-3 flex gap-2 flex-wrap">
                    {a.rounds.map((r, i) => (
                      <span
                        key={i}
                        className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                          r === "Cleared" ? "bg-green-600" : "bg-red-600"
                        }`}
                      >
                        R{i + 1} {r === "Cleared" ? "✔" : "✖"}
                      </span>
                    ))}
                  </td>

                  {/* FINAL STATUS */}
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
        )}
      </div>
    </div>
  );
}

/* ---------- REUSABLE ---------- */

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
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

function StepBanner({ completed, message, buttonLabel, onClick }) {
  return (
    <div
      className={`rounded-2xl p-4 flex items-center justify-between border ${
        completed
          ? "bg-green-50 border-green-200 text-green-800"
          : "bg-yellow-50 border-yellow-200 text-yellow-800"
      }`}
    >
      <div className="flex items-center gap-3">
        {completed ? (
          <CheckCircle className="text-green-600" />
        ) : (
          <AlertCircle className="text-yellow-600" />
        )}
        <p className="text-sm">{message}</p>
      </div>
      <button
        onClick={onClick}
        disabled={completed}
        className={`px-4 py-2 text-sm font-medium rounded-lg text-white ${
          completed
            ? "bg-green-600 cursor-not-allowed"
            : "bg-yellow-600 hover:bg-yellow-700"
        }`}
      >
        {completed ? "Completed" : buttonLabel}
      </button>
    </div>
  );
}
