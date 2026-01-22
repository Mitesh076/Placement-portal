import { useState } from "react";
import { Users, CheckCircle, CalendarCheck } from "lucide-react";

export default function SelectedStudents() {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      branch: "CSE",
      cgpa: 8.5,
      email: "rahul.sharma@example.com",
      phone: "9876543210",
      offerStatus: "Offer Accepted",
      joiningDate: "10 Mar 2026",
    },
    {
      id: 2,
      name: "Priya Patel",
      branch: "IT",
      cgpa: 8.9,
      email: "priya.patel@example.com",
      phone: "9876541230",
      offerStatus: "Offer Pending",
      joiningDate: "-",
    },
    {
      id: 3,
      name: "Amit Verma",
      branch: "CSE",
      cgpa: 8.2,
      email: "amit.verma@example.com",
      phone: "9876512340",
      offerStatus: "Offer Accepted",
      joiningDate: "15 Mar 2026",
    },
  ]);

  // Stats
  const totalSelected = students.length;
  const joined = students.filter(
    (s) => s.offerStatus === "Offer Accepted",
  ).length;
  const pending = students.filter(
    (s) => s.offerStatus === "Offer Pending",
  ).length;

  const [search, setSearch] = useState("");

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.branch.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6 w-full p-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-indigo-700">
          Selected Students
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Overview of students selected for the placement drive
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<Users />}
          label="Total Selected"
          value={totalSelected}
        />
        <StatCard icon={<CheckCircle />} label="Joined" value={joined} />
        <StatCard
          icon={<CalendarCheck />}
          label="Pending Joining"
          value={pending}
        />
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

      {/* Selected Students Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden mt-6">
        <TableHeader title="Selected Students List" />
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Branch</th>
              <th className="px-6 py-3 text-left">CGPA</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Phone</th>
              <th className="px-6 py-3 text-left">Offer Status</th>
              <th className="px-6 py-3 text-left">Joining Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s) => (
              <tr key={s.id} className="border-t hover:bg-indigo-50">
                <td className="px-6 py-3 font-medium">{s.name}</td>
                <td className="px-6 py-3">{s.branch}</td>
                <td className="px-6 py-3 font-semibold">{s.cgpa}</td>
                <td className="px-6 py-3">{s.email}</td>
                <td className="px-6 py-3">{s.phone}</td>
                <td className="px-6 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      s.offerStatus === "Offer Accepted"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {s.offerStatus}
                  </span>
                </td>
                <td className="px-6 py-3 font-medium">{s.joiningDate}</td>
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
