import {
  BarChart,
  TrendingUp,
  Users,
  LayoutDashboard,
  GraduationCap,
  Building2,
  PlusCircle,
  BarChart3,
  UserCheck,
  Settings,
} from "lucide-react";

export default function Reports() {
  return (
    <div className="h-screen w-screen flex bg-slate-100 text-sm overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Reports & Analytics
          </h2>
          <p className="text-xs text-slate-500">
            Overall placement statistics and insights
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6">
          <StatCard icon={<Users />} label="Total Students" value="320" />
          <StatCard icon={<TrendingUp />} label="Placed Students" value="198" />
          <StatCard icon={<Building2 />} label="Visited Companies" value="42" />
          <StatCard icon={<BarChart />} label="Placement %" value="61.8%" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm flex gap-4 items-center">
          <select className="border rounded-lg px-3 py-2">
            <option>All Departments</option>
            <option>CSE</option>
            <option>IT</option>
            <option>ECE</option>
          </select>
          <select className="border rounded-lg px-3 py-2">
            <option>2026 Batch</option>
            <option>2025 Batch</option>
            <option>2024 Batch</option>
          </select>
          <button className="ml-auto px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold">
            Download Report
          </button>
        </div>

        {/* Placed Students Table */}
        <ReportTable title="Placed Students Report" />

        {/* Company-wise Placement Table */}
        <CompanyReportTable />
      </main>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-4">
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

function ReportTable({ title }) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="h-14 px-6 flex items-center justify-between border-b">
        <h3 className="font-semibold">{title}</h3>
      </div>
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left">Student ID</th>
            <th className="px-6 py-3 text-left">Name</th>
            <th className="px-6 py-3 text-left">Department</th>
            <th className="px-6 py-3 text-left">Company</th>
            <th className="px-6 py-3 text-left">Package</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="px-6 py-3">STD101</td>
            <td className="px-6 py-3">Rahul Sharma</td>
            <td className="px-6 py-3">CSE</td>
            <td className="px-6 py-3">Infosys</td>
            <td className="px-6 py-3">6.5 LPA</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function CompanyReportTable() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="h-14 px-6 flex items-center justify-between border-b">
        <h3 className="font-semibold">Company-wise Placement</h3>
      </div>
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left">Company</th>
            <th className="px-6 py-3 text-left">Location</th>
            <th className="px-6 py-3 text-left">Package</th>
            <th className="px-6 py-3 text-left">Students Placed</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="px-6 py-3">TCS</td>
            <td className="px-6 py-3">Ahmedabad</td>
            <td className="px-6 py-3">7 LPA</td>
            <td className="px-6 py-3 font-semibold">24</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
