import { useEffect, useState } from "react";
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
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH DATA
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(
          "http://localhost:8000/api/student/student-dashboard",
          {
            credentials: "include",
          },
        );

        const data = await res.json();
        setDashboard(data.data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // ✅ REQUEST VERIFICATION API
  const handleRequestVerification = async () => {
    try {
      const res = await fetch(
        "http://localhost:8000/api/student/request-verification",
        {
          method: "PUT",
          credentials: "include",
        },
      );

      const data = await res.json();

      if (data.success) {
        alert("Verification request sent!");

        // ✅ update UI instantly
        setDashboard((prev) => ({
          ...prev,
          stats: {
            ...prev.stats,
            verified: "Pending",
          },
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="p-5">Loading...</p>;
  if (!dashboard) return <p className="p-5">No Data Found</p>;

  const { stats, student, upcomingDrives, recentApplications } = dashboard;

  // ✅ SAFE CONDITIONS
  const isProfileComplete = Number(stats.completion) >= 100;
  const status = stats.verified?.toLowerCase();

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
            <p className="text-lg font-medium">{student?.name}</p>
            <p className="text-md text-slate-500">Student</p>
          </div>

          <img
            src={student?.profilepic || "/default-avatar.png"}
            alt="profile"
            className="w-12 h-12 rounded-full object-cover"
          />
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={<TrendingUp />}
          label="Profile Completion"
          value={`${stats.completion}%`}
        />

        <StatCard
          icon={<Briefcase />}
          label="Applied Companies"
          value={stats.applied}
        />

        <StatCard
          icon={<Building2 />}
          label="Eligible Companies"
          value={stats.eligible}
        />

        <StatCard
          icon={<CheckCircle />}
          label="Verification Status"
          value={stats.verified}
          highlight={status !== "verified"}
        />
      </div>

      {/* ❌ INCOMPLETE PROFILE */}
      {!isProfileComplete && (
        <Notification
          icon={<AlertCircle />}
          color="yellow"
          message="Complete your profile to unlock placement opportunities."
        />
      )}

      {/* 🟡 REQUEST BUTTON */}
      {isProfileComplete && status === "unverified" && (
        <Notification
          icon={<ShieldCheck />}
          color="indigo"
          message="Your profile is complete. Request admin verification."
          actionLabel="Request Verification"
          onAction={handleRequestVerification}
        />
      )}

      {/* 🟠 PENDING */}
      {status === "pending" && (
        <Notification
          icon={<Clock />}
          color="orange"
          message="Verification request sent. Please wait for admin approval."
        />
      )}

      {/* 🟢 VERIFIED */}
      {status === "verified" && (
        <Notification
          icon={<CheckCircle />}
          color="green"
          message="Your account is verified. You can apply for drives."
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
            {upcomingDrives.map((d, i) => (
              <tr key={i} className="border-t hover:bg-slate-50">
                <td className="px-6 py-3 font-medium">{d.company}</td>
                <td className="px-6 py-3">{d.location}</td>
                <td className="px-6 py-3">{d.package} LPA</td>
                <td className="px-6 py-3">
                  {new Date(d.date).toLocaleDateString()}
                </td>
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
            {recentApplications.map((a, i) => (
              <tr key={i} className="border-t">
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

// ---------- COMPONENTS ----------

function Notification({ icon, message, actionLabel, onAction, color }) {
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
