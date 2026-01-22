import { useState } from "react";
import {
  Search,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Trash2,
} from "lucide-react";

export default function AppliedCompanies() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const companies = [
    {
      id: 1,
      name: "Google",
      role: "Software Engineer",
      appliedDate: "12 Jan 2026",
      status: "Selected",
      roundsCleared: 4,
      totalRounds: 4,
      nextRound: null,
      nextRoundDate: null,
    },
    {
      id: 2,
      name: "Infosys",
      role: "System Engineer",
      appliedDate: "18 Jan 2026",
      status: "Shortlisted",
      roundsCleared: 2,
      totalRounds: 4,
      nextRound: "Technical Interview",
      nextRoundDate: "28 Jan 2026",
    },
    {
      id: 3,
      name: "TCS",
      role: "Assistant System Engineer",
      appliedDate: "20 Jan 2026",
      status: "Applied",
      roundsCleared: 0,
      totalRounds: 3,
      nextRound: "Online Test",
      nextRoundDate: "25 Jan 2026",
    },
    {
      id: 4,
      name: "Amazon",
      role: "Frontend Developer",
      appliedDate: "22 Jan 2026",
      status: "Rejected",
      roundsCleared: 1,
      totalRounds: 4,
      nextRound: null,
      nextRoundDate: null,
    },
  ];

  const filteredCompanies = companies.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase());

    const matchFilter = filter === "All" || c.status === filter;
    return matchSearch && matchFilter;
  });

  const statusBadge = (status) => {
    switch (status) {
      case "Selected":
        return "bg-green-100 text-green-700";
      case "Shortlisted":
        return "bg-blue-100 text-blue-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const statusIcon = (status) => {
    switch (status) {
      case "Selected":
        return <CheckCircle size={16} />;
      case "Rejected":
        return <XCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  return (
    <div className="space-y-6 w-full p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Applied Companies</h2>
        <span className="text-sm text-slate-500">
          Total Applications: {companies.length}
        </span>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-2.5 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500"
        >
          <option>All</option>
          <option>Applied</option>
          <option>Shortlisted</option>
          <option>Selected</option>
          <option>Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left">Company</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-left">Applied On</th>
              <th className="px-6 py-3 text-left">Progress</th>
              <th className="px-6 py-3 text-left">Next Round</th>
              <th className="px-6 py-3 text-left">Next Round Date</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCompanies.map((c) => (
              <tr key={c.id} className="border-t hover:bg-slate-50">
                <td className="px-6 py-4 flex items-center gap-2 font-medium">
                  <Building2 size={16} className="text-indigo-600" />
                  {c.name}
                </td>

                <td className="px-6 py-4">{c.role}</td>

                <td className="px-6 py-4 flex items-center gap-2">
                  <Calendar size={14} />
                  {c.appliedDate}
                </td>

                <td className="px-6 py-4">
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="h-2 bg-indigo-600 rounded-full"
                      style={{
                        width: `${(c.roundsCleared / c.totalRounds) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {c.roundsCleared}/{c.totalRounds} rounds
                  </p>
                </td>

                <td className="px-6 py-4 font-medium">{c.nextRound || "—"}</td>

                <td className="px-6 py-4 text-slate-600">
                  {c.nextRoundDate || "—"}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusBadge(
                      c.status,
                    )}`}
                  >
                    {statusIcon(c.status)}
                    {c.status}
                  </span>
                </td>

                <td className="px-6 py-4 flex gap-2">
                  <button className="p-2 rounded-lg border hover:bg-slate-100">
                    <Eye size={16} />
                  </button>

                  {c.status === "Applied" && (
                    <button className="p-2 rounded-lg border hover:bg-red-50 text-red-600">
                      <Trash2 size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
