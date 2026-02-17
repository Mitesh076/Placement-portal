import { useState } from "react";
import {
  Briefcase,
  CheckCircle,
  Building2,
  TrendingUp,
  AlertCircle,
  ShieldCheck,
  Clock,
} from "lucide-react";

export default function StudentDashboard() {
  const [profileCompletion, setProfileCompletion] = useState(20);
  const [verificationStatus, setVerificationStatus] = useState("not_requested");

  const isProfileComplete = profileCompletion === 100;

  const requestVerification = () => {
    setVerificationStatus("pending");

    // simulate admin verification
    setTimeout(() => {
      setVerificationStatus("verified");
    }, 5000);
  };

  return (
    <div className="space-y-6 w-full p-5">
      {/* Header */}
      <header className="h-20 bg-white flex items-center justify-between px-6 border-b">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Dashboard Overview
          </h2>
          <p className="text-xs text-slate-500">
            Placement statistics & management
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-lg font-medium">Student Name</p>
            <p className="text-md text-slate-500">Student</p>
          </div>
          <div className="w-15 h-15 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
            S
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={<TrendingUp />}
          label="Profile Completion"
          value={`${profileCompletion}%`}
        />
        <StatCard icon={<Briefcase />} label="Applied Companies" value="6" />
        <StatCard icon={<Building2 />} label="Eligible Companies" value="12" />
        <StatCard
          icon={<CheckCircle />}
          label="Verification Status"
          value={
            verificationStatus === "verified"
              ? "Verified"
              : verificationStatus === "pending"
                ? "Pending"
                : "Not Verified"
          }
          highlight={verificationStatus !== "verified"}
        />
      </div>

      {/* PROFILE COMPLETION ALERT */}
      {profileCompletion < 100 && (
        <Notification
          icon={<AlertCircle />}
          color="yellow"
          title="Complete Your Profile"
          message="Complete your profile and upload all required documents to become eligible for more companies."
          actionLabel="Complete Profile"
          onAction={() => alert("Navigate to Profile Page")}
        />
      )}

      {/* REQUEST VERIFICATION */}
      {isProfileComplete && verificationStatus === "not_requested" && (
        <Notification
          icon={<ShieldCheck />}
          color="indigo"
          title="Verify Your Account"
          message="Your profile is complete. Request admin verification to apply for placement drives."
          actionLabel="Request Verification"
          onAction={requestVerification}
        />
      )}

      {/* PENDING VERIFICATION */}
      {verificationStatus === "pending" && (
        <Notification
          icon={<Clock />}
          color="orange"
          title="Verification Pending"
          message="Your verification request has been sent. Please wait for admin approval."
        />
      )}

      {/* VERIFIED */}
      {verificationStatus === "verified" && (
        <Notification
          icon={<CheckCircle />}
          color="green"
          title="Account Verified"
          message="Your account is verified. You can now apply for placement drives."
        />
      )}

      {/* Upcoming Drives */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <SectionHeader title="Upcoming Placement Drives" />

        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left">Company</th>
              <th className="px-6 py-3 text-left">Location</th>
              <th className="px-6 py-3 text-left">Package</th>
              <th className="px-6 py-3 text-left">Drive Date</th>
            </tr>
          </thead>
          <tbody>
            {upcomingDrives.map((d) => (
              <tr key={d.id} className="border-t hover:bg-slate-50">
                <td className="px-6 py-3 font-medium">{d.company}</td>
                <td className="px-6 py-3">{d.location}</td>
                <td className="px-6 py-3">{d.package}</td>
                <td className="px-6 py-3">{d.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <SectionHeader title="Recent Applications" />

        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left">Company</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Round</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="px-6 py-3">{a.company}</td>
                <td className="px-6 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      a.status === "Selected"
                        ? "bg-green-100 text-green-700"
                        : a.status === "Shortlisted"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {a.status}
                  </span>
                </td>
                <td className="px-6 py-3">{a.round}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function Notification({ icon, title, message, actionLabel, onAction, color }) {
  const colorMap = {
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-800",
    indigo: "bg-indigo-50 border-indigo-200 text-indigo-800",
    orange: "bg-orange-50 border-orange-200 text-orange-800",
    green: "bg-green-50 border-green-200 text-green-800",
  };

  return (
    <div
      className={`border rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${colorMap[color]}`}
    >
      <div className="flex items-start gap-3">
        {icon}
        <p className="text-sm">{message}</p>
      </div>

      {actionLabel && (
        <button
          onClick={onAction}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-white border hover:bg-slate-50"
        >
          {actionLabel}
        </button>
      )}
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

function SectionHeader({ title }) {
  return (
    <div className="h-14 px-6 flex items-center border-b">
      <h3 className="font-semibold">{title}</h3>
    </div>
  );
}

/* ---------- MOCK DATA ---------- */

const upcomingDrives = [
  {
    id: 1,
    company: "Infosys",
    location: "Bangalore",
    package: "6 LPA",
    date: "20 Feb 2026",
  },
  {
    id: 2,
    company: "TCS",
    location: "Pune",
    package: "7 LPA",
    date: "25 Feb 2026",
  },
];

const applications = [
  {
    id: 1,
    company: "Google",
    status: "Shortlisted",
    round: "Technical Interview",
  },
  {
    id: 2,
    company: "Amazon",
    status: "Applied",
    round: "Online Test",
  },
];
