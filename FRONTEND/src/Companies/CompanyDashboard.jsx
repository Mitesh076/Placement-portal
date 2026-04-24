import { useState, useEffect } from "react";
import {
  Users,
  CheckCircle,
  Building2,
  AlertCircle,
  BarChart2,
} from "lucide-react";
import axios from "axios";

export default function CompanyDashboard() {
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Dashboard Data
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, studentsRes] = await Promise.all([
          axios.get("http://localhost:8000/api/company/stats", {
            withCredentials: true,
          }),
          axios.get("http://localhost:8000/api/company/selected-students", {
            withCredentials: true,
          }),
        ]);

        setStats(statsRes.data.data);
        setStudents(studentsRes.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleVerify = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/company/verify",
        {},
        { withCredentials: true },
      );
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Verification failed");
    }
  };

  if (loading) return <div className="p-6 text-slate-500">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  const isVerified = stats?.isVerified;
  const isProfileComplete = stats?.profileCompletion === 100;

  return (
    <div className="space-y-6 w-full p-6">
      {/* HEADER */}
      <header className="h-20 bg-white flex items-center justify-between px-6 border-b rounded-xl shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-indigo-700">
            {stats?.companyName || "Company Dashboard"}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage verification and view selected students
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium">
              {stats?.companyName || "Company Admin"}
            </p>
            <p className="text-xs text-slate-500">{stats?.HrName || "HR"}</p>
          </div>

          <img
            src={
              stats?.companyLogo || "https://via.placeholder.com/40?text=Logo"
            }
            alt="logo"
            className="w-10 h-10 rounded-full object-cover border"
          />
        </div>
      </header>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={<Users />}
          label="Total Students"
          value={stats?.totalStudents ?? "-"}
        />
        <StatCard
          icon={<Building2 />}
          label="Applied Students"
          value={stats?.appliedStudents ?? "-"}
        />
        <StatCard
          icon={<CheckCircle />}
          label="Selected Students"
          value={stats?.selectedStudents ?? "-"}
        />
        <StatCard
          icon={<BarChart2 />}
          label="Profile Completion"
          value={`${stats?.profileCompletion ?? 0}%`}
          accent={stats?.profileCompletion === 100 ? "green" : "indigo"}
        />
      </div>

      {/* ACTION BANNERS */}
      <div className="space-y-4">
        <StepBanner
          completed={isProfileComplete}
          message="Complete company profile"
          buttonLabel="Complete Profile"
          onClick={() => (window.location.href = "/company")}
        />

        <StepBanner
          completed={isVerified}
          message={
            stats?.verificationStatus === "Pending"
              ? "Verification pending admin approval"
              : stats?.verificationStatus === "Rejected"
                ? "Verification rejected — contact admin"
                : "Verify company details with admin"
          }
          buttonLabel="Verify Company"
          onClick={handleVerify}
          disabled={!isProfileComplete}
        />
      </div>

      {/* SELECTED STUDENTS TABLE */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="h-14 px-6 flex items-center border-b font-semibold text-indigo-700">
          Selected Students
        </div>

        {!isVerified ? (
          <div className="p-6 text-center text-slate-400">
            Selected students will appear here after verification
          </div>
        ) : students.length === 0 ? (
          <div className="p-6 text-center text-slate-400">
            No students have been selected yet
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left">Profile</th>
                <th className="px-6 py-3 text-left">Student Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left">Drive</th>
                <th className="px-6 py-3 text-left">Rounds</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.appliedId} className="border-t hover:bg-indigo-50">
                  <td className="px-6 py-3">
                    <img
                      src={
                        s.student?.profilePic ||
                        "https://via.placeholder.com/40"
                      }
                      alt="profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-6 py-3 font-medium">
                    {s.student?.name || "—"}
                  </td>
                  <td className="px-6 py-3">{s.student?.email || "—"}</td>
                  <td className="px-6 py-3">{s.role || "—"}</td>
                  <td className="px-6 py-3">{s.drive?.title || "—"}</td>
                  <td className="px-6 py-3">
                    {s.roundsCleared} / {s.totalRounds}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({ icon, label, value, accent = "indigo" }) {
  const bg =
    accent === "green"
      ? "bg-green-100 text-green-600"
      : "bg-indigo-100 text-indigo-600";

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center ${bg}`}
      >
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
