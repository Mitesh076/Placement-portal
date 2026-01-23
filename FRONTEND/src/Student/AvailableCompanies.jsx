import { useState } from "react";
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

  const companies = [
    {
      id: 1,
      name: "Google",
      role: "Software Engineer",
      location: "Bangalore",
      package: "18 LPA",
      bond: "No Bond",
      eligibility: "CGPA ≥ 8.0",
      deadline: "30 Jan 2026",
      eligible: true,
      applied: false,
      description:
        "Google is looking for skilled engineers with strong problem-solving abilities.",
    },
    {
      id: 2,
      name: "Infosys",
      role: "System Engineer",
      location: "Pune",
      package: "6.5 LPA",
      bond: "2 Years",
      eligibility: "CGPA ≥ 6.5",
      deadline: "28 Jan 2026",
      eligible: true,
      applied: true,
      description:
        "Infosys campus hiring for system engineers across multiple locations.",
    },
    {
      id: 3,
      name: "Amazon",
      role: "Frontend Developer",
      location: "Hyderabad",
      package: "14 LPA",
      bond: "No Bond",
      eligibility: "CGPA ≥ 7.5",
      deadline: "25 Jan 2026",
      eligible: false,
      applied: false,
      description:
        "Amazon is hiring frontend developers with React experience.",
    },
  ];

  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6 w-full p-6">
      {/* Header */}
      <div className=" items-center">
        <h2 className="text-xl font-semibold">Available Companies</h2>
        <p className="text-sm text-slate-500">
          Overview of Available companies
        </p>
        <span className="text-sm text-slate-500">
          Total: {filteredCompanies.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={<Briefcase />} label="Total Companies" value="12" />

        <StatCard icon={<Building2 />} label="Eligible Companies" value="12" />

        <StatCard
          icon={<Briefcase />}
          label="Not Eligible Companies"
          value="6"
        />
        <StatCard icon={<Briefcase />} label="Applied Companies" value="6" />
      </div>

      {/* Search */}
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
          <option>Not applied</option>
          <option>Eligible</option>
          <option>Not Eligible </option>
        </select>
      </div>

      {/* Company Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-xl shadow-sm p-5 space-y-4"
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{c.name}</h3>
                <p className="text-sm text-slate-500">{c.role}</p>
              </div>

              {c.eligible ? (
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
            <div className="space-y-2 text-sm text-slate-600">
              <p className="flex items-center gap-2">
                <MapPin size={14} /> {c.location}
              </p>
              <p className="flex items-center gap-2">
                <IndianRupee size={14} /> {c.package}
              </p>
              <p className="flex items-center gap-2">
                <Clock size={14} /> Apply by {c.deadline}
              </p>
            </div>

            {/* Footer */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCompany(c)}
                className="flex-1 border rounded-lg py-2 text-sm hover:bg-slate-100 flex items-center justify-center gap-2"
              >
                <Eye size={16} /> View Details
              </button>

              <button
                disabled={!c.eligible || c.applied}
                className={`flex-1 rounded-lg py-2 text-sm font-medium ${
                  c.applied
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                    : c.eligible
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold">{selectedCompany.name}</h3>

            <p className="text-sm text-slate-600">
              {selectedCompany.description}
            </p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <Detail label="Role" value={selectedCompany.role} />
              <Detail label="Location" value={selectedCompany.location} />
              <Detail label="Package" value={selectedCompany.package} />
              <Detail label="Bond" value={selectedCompany.bond} />
              <Detail label="Eligibility" value={selectedCompany.eligibility} />
              <Detail label="Deadline" value={selectedCompany.deadline} />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedCompany(null)}
                className="px-4 py-2 rounded-lg border"
              >
                Close
              </button>
              <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white">
                Apply
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
function StatCard({ icon, label, value, highlight }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p
          className={`text-lg font-semibold ${
            highlight ? "text-orange-600" : "text-slate-800"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
