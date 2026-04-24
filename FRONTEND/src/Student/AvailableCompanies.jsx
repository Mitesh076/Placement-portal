import { useState, useEffect } from "react";
import axios from "axios";
import {
  Building2,
  MapPin,
  IndianRupee,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  Briefcase,
  Search,
} from "lucide-react";

export default function AvailableCompanies() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedCompany, setSelectedCompany] = useState(null);

  const [companies, setCompanies] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Data
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/student/available-companies",
          { withCredentials: true },
        );

        setCompanies(res.data.drives);
        setStats(res.data.stats);
      } catch (err) {
        console.error("Error:", err);
        alert("Failed to load companies");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // ✅ Apply Function
  const handleApply = async (driveId) => {
    try {
      await axios.post(
        "http://localhost:8000/api/student/apply",
        { driveId },
        { withCredentials: true },
      );

      // ✅ Update UI instantly
      setCompanies((prev) =>
        prev.map((c) => (c.id === driveId ? { ...c, applied: true } : c)),
      );

      alert("✅ You have successfully applied!");
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "❌ Failed to apply");
    }
  };

  // ✅ Filtering
  const filteredCompanies = companies.filter((c) => {
    const matchSearch =
      c.companyName?.toLowerCase().includes(search.toLowerCase()) ||
      c.role?.toLowerCase().includes(search.toLowerCase());

    if (filter === "Eligible") return c.isEligible && matchSearch;
    if (filter === "Not Eligible") return !c.isEligible && matchSearch;
    if (filter === "Applied") return c.applied && matchSearch;
    if (filter === "Not applied") return !c.applied && matchSearch;

    return matchSearch;
  });

  if (loading) {
    return <p className="p-6">Loading companies...</p>;
  }

  return (
    <div className="space-y-6 w-full p-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">Available Company Drives</h2>
        <p className="text-sm text-slate-500">Overview of Available Drives</p>
        <span className="text-sm text-slate-500">
          Total: {filteredCompanies.length}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
          label="Not Eligible Drives"
          value={stats.notEligible || 0}
        />
        <StatCard
          icon={<Briefcase />}
          label="Applied Drives"
          value={companies.filter((c) => c.applied).length}
        />
      </div>

      {/* Search + Filter */}
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
          className="px-4 py-2 rounded-lg border"
        >
          <option>All</option>
          <option>Applied</option>
          <option>Not applied</option>
          <option>Eligible</option>
          <option>Not Eligible</option>
        </select>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-xl shadow-sm p-5 space-y-4"
          >
            {/* Header */}
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold text-lg">{c.companyName}</h3>
                <p className="text-sm text-slate-500">{c.role}</p>
              </div>

              {c.isEligible ? (
                <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  <CheckCircle size={14} /> Eligible
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                  <XCircle size={14} /> Not Eligible
                </span>
              )}
            </div>

            {/* Details */}
            <div className="text-sm space-y-2 text-slate-600">
              <p className="flex gap-2 items-center">
                <MapPin size={14} /> {c.location}
              </p>
              <p className="flex gap-2 items-center">
                <IndianRupee size={14} /> {c.package} LPA
              </p>
              <p className="flex gap-2 items-center">
                <Clock size={14} />
                Apply by {new Date(c.lastDate).toLocaleDateString()}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCompany(c)}
                className="flex-1 border rounded-lg py-2 text-sm hover:bg-slate-100 flex items-center justify-center gap-2"
              >
                <Eye size={16} /> View
              </button>

              <button
                onClick={() => handleApply(c.id)}
                disabled={!c.isEligible || c.applied}
                className={`flex-1 rounded-lg py-2 text-sm font-medium ${
                  c.applied
                    ? "bg-green-100 text-green-700 cursor-not-allowed"
                    : c.isEligible
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "bg-red-200 text-red-700 cursor-not-allowed"
                }`}
              >
                {c.applied ? "Applied" : "Apply"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedCompany && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg space-y-4">
            <h3 className="text-lg font-semibold">
              {selectedCompany.companyName}
            </h3>

            <p className="text-sm text-slate-600">
              Role: {selectedCompany.role}
            </p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <Detail label="Location" value={selectedCompany.location} />
              <Detail
                label="Package"
                value={`${selectedCompany.package} LPA`}
              />
              <Detail label="Min CGPA" value={selectedCompany.mincgpa} />
              <Detail
                label="Deadline"
                value={new Date(selectedCompany.lastDate).toLocaleDateString()}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedCompany(null)}
                className="px-4 py-2 border rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm flex gap-4 items-center">
      <div className="w-12 h-12 bg-indigo-100 text-indigo-600 flex justify-center items-center rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
}
