import { useState } from "react";
import {
  Users,
  CheckCircle,
  Building2,
  AlertCircle,
  GraduationCap,
} from "lucide-react";

export default function CompanyDashboard() {
  /* ---------- FLOW STATES ---------- */
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [verified, setVerified] = useState(false);

  /* ---------- SELECTED STUDENTS (ADMIN → COMPANY) ---------- */
  const selectedStudentsData = [
    {
      id: 1,
      name: "Priya Patel",
      branch: "IT",
      cgpa: 8.9,
      role: "Frontend Developer",
    },
    {
      id: 2,
      name: "Aman Shah",
      branch: "CSE",
      cgpa: 8.6,
      role: "Backend Developer",
    },
  ];

  const students = verified ? selectedStudentsData : [];

  /* ---------- STATS ---------- */
  const totalEligible = verified ? 25 : "-";
  const applied = verified ? 18 : "-";
  const selected = verified ? students.length : "-";

  return (
    <div className="space-y-6 w-full p-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-indigo-700">
          Company Dashboard
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Manage verification and view selected students
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<Users />}
          label="Eligible Students"
          value={totalEligible}
        />
        <StatCard
          icon={<Building2 />}
          label="Applied Students"
          value={applied}
        />
        <StatCard
          icon={<CheckCircle />}
          label="Selected Students"
          value={selected}
        />
      </div>

      {/* VERTICAL FLOW BANNERS */}
      <div className="space-y-4">
        <StepBanner
          completed={profileCompleted}
          message="Complete company profile"
          buttonLabel="Complete Profile"
          onClick={() => setProfileCompleted(true)}
        />

        <StepBanner
          completed={verified}
          message="Verify company details with admin"
          buttonLabel="Verify Company"
          onClick={() => setVerified(true)}
          disabled={!profileCompleted}
        />
      </div>

      {/* SELECTED STUDENTS TABLE */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <TableHeader title="Selected Students" />

        {!verified ? (
          <div className="p-6 text-center text-slate-400">
            Selected students will appear here after verification
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left">Student Name</th>
                <th className="px-6 py-3 text-left">Branch</th>
                <th className="px-6 py-3 text-left">CGPA</th>
                <th className="px-6 py-3 text-left">Role</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-t hover:bg-indigo-50">
                  <td className="px-6 py-3 font-medium">{s.name}</td>
                  <td className="px-6 py-3">{s.branch}</td>
                  <td className="px-6 py-3 font-semibold">{s.cgpa}</td>
                  <td className="px-6 py-3">{s.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ---------- REUSABLE COMPONENTS ---------- */

function StatCard({ icon, label, value }) {
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

function StepBanner({
  completed,
  message,
  buttonLabel,
  onClick,
  disabled,
}) {
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
        disabled={disabled || completed}
        className={`px-4 py-2 text-sm font-medium rounded-lg text-white ${
          completed
            ? "bg-green-600 cursor-not-allowed"
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
