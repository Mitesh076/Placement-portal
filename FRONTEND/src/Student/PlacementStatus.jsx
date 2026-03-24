import {
  Building2,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Layers,
  Trophy,
  TicketCheck,
} from "lucide-react";
import Offers from "./Offers";

export default function PlacementStatus() {
  const applications = [
    {
      id: 1,
      company: "Google",
      role: "Software Engineer",
      appliedDate: "10 Jan 2026",
      currentStatus: "Shortlisted",
      roundsCompleted: 2,
      totalRounds: 4,
      nextRound: "Technical Interview",
      nextRoundDate: "22 Jan 2026",
      performance: "Excellent problem-solving skills",
    },
    {
      id: 2,
      company: "Infosys",
      role: "System Engineer",
      appliedDate: "08 Jan 2026",
      currentStatus: "Selected",
      roundsCompleted: 3,
      totalRounds: 3,
      nextRound: "-",
      nextRoundDate: "-",
      performance: "Selected after HR round",
    },
    {
      id: 3,
      company: "Amazon",
      role: "Frontend Developer",
      appliedDate: "05 Jan 2026",
      currentStatus: "Rejected",
      roundsCompleted: 1,
      totalRounds: 4,
      nextRound: "-",
      nextRoundDate: "-",
      performance: "Did not clear online assessment",
    },
  ];

  return (
    <div className="space-y-6 w-full p-6 overflow-y-scroll">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">Placement Status</h2>
        <p className="text-sm text-slate-500">
          Track your applied companies and placement performance
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard label="Total Applied" value="3" icon={<Building2 />} />
        <SummaryCard label="Shortlisted" value="1" icon={<Clock />} />
        <SummaryCard label="Selected" value="1" icon={<Trophy />} />
        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-indigo-100 text-green-600 flex items-center justify-center">
            {<CheckCircle />}
          </div>
          <div>
            <p className="text-xs text-slate-500">Placement Status</p>
            <p className="text-lg text-green-600 font-semibold">Placed</p>
          </div>
        </div>
      </div>
      <div>
        <Offers />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="h-14 px-6 flex items-center border-b">
          <h3 className="font-semibold">Application Details</h3>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left">Company</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Rounds</th>
              <th className="px-6 py-3 text-left">Next Round</th>
              <th className="px-6 py-3 text-left">Next Date</th>
            </tr>
          </thead>

          <tbody>
            {applications.map((app) => (
              <tr
                key={app.id}
                className="border-t hover:bg-slate-50 transition"
              >
                <td className="px-6 py-4 font-medium">{app.company}</td>
                <td className="px-6 py-4">{app.role}</td>

                <td className="px-6 py-4">
                  <StatusBadge status={app.currentStatus} />
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Layers size={14} />
                    {app.roundsCompleted}/{app.totalRounds}
                  </div>
                </td>

                <td className="px-6 py-4">{app.nextRound}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    {app.nextRoundDate}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Performance Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h3 className="font-semibold">Performance Summary</h3>

        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
              <div>
                <p className="font-medium">
                  {app.company} – {app.role}
                </p>
                <p className="text-sm text-slate-600">{app.performance}</p>
              </div>

              {app.currentStatus === "Selected" && (
                <span className="flex items-center gap-2 text-green-600 font-medium">
                  <CheckCircle size={18} /> Selected
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Helper Components ---------- */

function SummaryCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Applied: "bg-slate-100 text-slate-700",
    Shortlisted: "bg-blue-100 text-blue-700",
    Selected: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}
