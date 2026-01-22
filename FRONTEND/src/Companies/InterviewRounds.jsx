import { useState } from "react";
import { Users, CheckCircle, XCircle, Layers, Mail } from "lucide-react";

export default function InterviewRounds() {
  const rounds = [
    { id: 1, name: "Online Test" },
    { id: 2, name: "Technical Interview" },
    { id: 3, name: "HR Interview" },
    { id: 4, name: "Offer Letter" },
  ];

  const initialStudents = [
    {
      id: 1,
      name: "Rahul Sharma",
      branch: "CSE",
      roundStatus: { 1: "In Progress" },
    },
    {
      id: 2,
      name: "Priya Patel",
      branch: "IT",
      roundStatus: { 1: "In Progress" },
    },
    {
      id: 3,
      name: "Amit Verma",
      branch: "CSE",
      roundStatus: { 1: "In Progress" },
    },
    {
      id: 4,
      name: "Sneha Joshi",
      branch: "IT",
      roundStatus: { 1: "In Progress" },
    },
    {
      id: 5,
      name: "Aditya Singh",
      branch: "CSE",
      roundStatus: { 1: "In Progress" },
    },
  ];

  const [selectedRoundId, setSelectedRoundId] = useState(1);
  const [students, setStudents] = useState(initialStudents);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle Select / Reject for a student
  const handleAction = (studentId, action) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s; // Only update clicked student

        const newRoundStatus = { ...s.roundStatus };
        newRoundStatus[selectedRoundId] =
          action === "select" ? "Selected" : "Rejected";

        // If selected, prepare next round if exists
        if (
          action === "select" &&
          rounds.find((r) => r.id === selectedRoundId + 1)
        ) {
          newRoundStatus[selectedRoundId + 1] =
            newRoundStatus[selectedRoundId + 1] || "In Progress";
        }

        return { ...s, roundStatus: newRoundStatus };
      }),
    );
  };

  // Filtered students based on search
  const studentsInRound = students.filter(
    (s) =>
      (s.roundStatus[selectedRoundId] === "In Progress" ||
        s.roundStatus[selectedRoundId] === "Selected" ||
        s.roundStatus[selectedRoundId] === "Rejected") &&
      (s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.branch.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  // Stats for current round
  const total = studentsInRound.length;
  const selectedCount = studentsInRound.filter(
    (s) => s.roundStatus[selectedRoundId] === "Selected",
  ).length;
  const rejectedCount = studentsInRound.filter(
    (s) => s.roundStatus[selectedRoundId] === "Rejected",
  ).length;
  const inProgressCount = studentsInRound.filter(
    (s) => s.roundStatus[selectedRoundId] === "In Progress",
  ).length;

  return (
    <div className="space-y-6 w-full p-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">Interview Rounds</h2>
        <p className="text-sm text-slate-500">
          Manage student selection for each round
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={<Users />} label="Total Students" value={total} />
        <StatCard
          icon={<CheckCircle />}
          label="Selected"
          value={selectedCount}
        />
        <StatCard icon={<XCircle />} label="Rejected" value={rejectedCount} />
        <StatCard
          icon={<Layers />}
          label="In Progress"
          value={inProgressCount}
        />
      </div>

      {/* Round Selector */}
      <div className="flex gap-3 overflow-x-auto mt-4">
        {rounds.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedRoundId(r.id)}
            className={`px-4 py-2 rounded-lg font-medium border ${
              selectedRoundId === r.id
                ? "bg-indigo-600 text-white"
                : "bg-white border-slate-300 text-slate-700"
            }`}
          >
            {r.name}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Search by name or branch"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/3 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mt-4">
        <div className="h-14 px-6 flex items-center border-b">
          <h3 className="font-semibold">
            Students in "{rounds.find((r) => r.id === selectedRoundId)?.name}"
          </h3>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Branch</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {studentsInRound.map((s) => (
              <tr key={s.id} className="border-t hover:bg-slate-50">
                <td className="px-6 py-3 font-medium">{s.name}</td>
                <td className="px-6 py-3">{s.branch}</td>
                <td className="px-6 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      s.roundStatus[selectedRoundId] === "Selected"
                        ? "bg-green-100 text-green-700"
                        : s.roundStatus[selectedRoundId] === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {s.roundStatus[selectedRoundId]}
                  </span>
                </td>
                <td className="px-6 py-3 flex gap-2">
                  <button
                    onClick={() => handleAction(s.id, "select")}
                    className="px-2 py-1 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700"
                  >
                    Select
                  </button>
                  <button
                    onClick={() => handleAction(s.id, "reject")}
                    className="px-2 py-1 bg-red-600 text-white rounded-lg text-xs hover:bg-red-700"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notify Students Button */}
      <div className="mt-4 text-right">
        <button className="px-5 py-2 rounded-lg bg-indigo-600 text-white flex items-center gap-2 hover:bg-indigo-700 transition">
          <Mail size={16} /> Notify Students via Mail
        </button>
      </div>
    </div>
  );
}

/* ---------- STAT CARD ---------- */
function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
}
