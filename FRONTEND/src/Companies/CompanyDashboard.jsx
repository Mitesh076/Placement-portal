import { useState } from "react";
import {
  Users,
  Briefcase,
  CheckCircle,
  AlertCircle,
  Building2,
  Layers,
} from "lucide-react";

export default function CompanyDashboard() {
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [verified, setVerified] = useState(false);
  const [requested, setRequested] = useState(false);

  const stats = {
    totalEligible: requested ? 120 : "-",
    applied: requested ? 45 : "-",
    selected: requested ? 18 : "-",
    drives: 4,
  };

  const selectedStudents = [
    {
      id: 1,
      name: "Rahul Sharma",
      branch: "CSE",
      cgpa: 8.5,
      status: "Selected",
    },
    { id: 2, name: "Priya Patel", branch: "IT", cgpa: 8.9, status: "Selected" },
    { id: 3, name: "Amit Verma", branch: "CSE", cgpa: 8.2, status: "Selected" },
  ];

  return (
    <div className="space-y-6 w-full p-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-indigo-700">
          Company Dashboard
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Overview of your placement drives and student interactions
        </p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={<Users />}
          label="Total Eligible Students"
          value={stats.totalEligible}
        />
        <StatCard
          icon={<Briefcase />}
          label="Applied Students"
          value={stats.applied}
        />
        <StatCard
          icon={<CheckCircle />}
          label="Selected Students"
          value={stats.selected}
        />
        <StatCard
          icon={<Layers />}
          label="Interview Rounds"
          value={stats.drives}
        />
      </div>

      {/* Vertical Flow: Profile → Verification → Request */}
      <div className="space-y-4 mt-6">
        {/* Profile Completion */}
        <StepBanner
          completed={profileCompleted}
          message="Complete your company profile"
          buttonLabel="Complete Profile"
          onClick={() => setProfileCompleted(true)}
        />

        {/* Verification */}
        <StepBanner
          completed={verified}
          message="Verify your company details"
          buttonLabel="Verify Company"
          onClick={() => setVerified(true)}
          disabled={!profileCompleted}
        />
        <StepBanner
          completed={requested}
          message="Request eligible student details"
          buttonLabel="Request Students"
          onClick={() => setRequested(true)}
          disabled={!verified}
        />
      </div>

      {/* Selected Students Table */}
      {requested && (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mt-6">
          <TableHeader title="Selected Students" />
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Branch</th>
                <th className="px-6 py-3 text-left">CGPA</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {selectedStudents.map((s) => (
                <tr key={s.id} className="border-t hover:bg-indigo-50">
                  <td className="px-6 py-3 font-medium">{s.name}</td>
                  <td className="px-6 py-3">{s.branch}</td>
                  <td className="px-6 py-3 font-semibold">{s.cgpa}</td>
                  <td className="px-6 py-3 text-green-600 font-semibold">
                    {s.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ---------------- Reusable Components ---------------- */

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

function StepBanner({ completed, message, buttonLabel, onClick, disabled }) {
  const bannerColor = completed
    ? "bg-green-50 border-green-200 text-green-800"
    : "bg-yellow-50 border-yellow-200 text-yellow-800";
  const Icon = completed ? CheckCircle : AlertCircle;

  return (
    <div
      className={`rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border ${bannerColor}`}
    >
      <div className="flex items-start gap-3">
        <Icon
          className={`mt-0.5 ${completed ? "text-green-600" : "text-yellow-600"}`}
        />
        <p className="text-sm">{message}</p>
      </div>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`px-4 py-2 text-sm font-medium rounded-lg text-white transition ${
          completed
            ? "bg-green-600 hover:bg-green-700"
            : disabled
              ? "bg-yellow-400 cursor-not-allowed"
              : "bg-yellow-600 hover:bg-yellow-700"
        }`}
      >
        {completed ? "Completed" : buttonLabel}
      </button>
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
