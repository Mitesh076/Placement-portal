import { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Trash2,
  Briefcase,
} from "lucide-react";

export default function AppliedCompanies() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [companies, setCompanies] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token"); // ✅ get token

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          withCredentials: true, // ✅ use cookies instead of token
        };

        const [statsRes, companiesRes] = await Promise.all([
          axios.get("http://localhost:8000/api/student/placementstats", config),
          axios.get(
            "http://localhost:8000/api/student/appliedcompanies",
            config,
          ),
        ]);

        setStats(statsRes.data);
        setCompanies(companiesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCompanies = companies.filter((c) => {
    const searchText = search.toLowerCase();

    const matchSearch =
      c.companyName?.toLowerCase().includes(searchText) ||
      c.role?.toLowerCase().includes(searchText);

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

  function StatCard({ icon, label, value }) {
    return (
      <div className="bg-white p-5 rounded-xl shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          <p className="text-lg font-semibold text-slate-800">{value}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <p className="p-6">Loading applications...</p>;
  }

  return (
    <div className="space-y-6 w-full p-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">Applied Drives</h2>
        <p className="text-sm text-slate-500">Overview of your applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<Briefcase />}
          label="Total Drives"
          value={stats.total || 0}
        />
        <StatCard
          icon={<Building2 />}
          label="Eligible Drives"
          value={stats.eligible || 0}
        />
        <StatCard
          icon={<Briefcase />}
          label="Applied Drives"
          value={stats.applied || 0}
        />
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">List of Companies</h2>
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
            </tr>
          </thead>

          <tbody>
            {filteredCompanies.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-slate-500">
                  No applications found
                </td>
              </tr>
            ) : (
              filteredCompanies.map((c) => (
                <tr key={c.id} className="border-t hover:bg-slate-50">
                  <td className="px-6 py-4 flex items-center gap-2 font-medium">
                    <Building2 size={16} className="text-indigo-600" />
                    {c.companyName}
                  </td>

                  <td className="px-6 py-4">{c.role}</td>

                  <td className="px-6 py-4 flex items-center gap-2">
                    <Calendar size={14} />
                    {c.appliedDate
                      ? new Date(c.appliedDate).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="px-6 py-4">
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="h-2 bg-indigo-600 rounded-full"
                        style={{ width: `${c.progressPercent}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {c.roundsCleared}/{c.totalRounds} rounds
                    </p>
                  </td>

                  <td className="px-6 py-4 font-medium">
                    {c.nextRound || "-"}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {c.nextRoundDate
                      ? new Date(c.nextRoundDate).toLocaleDateString()
                      : "-"}
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
