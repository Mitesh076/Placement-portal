import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Building2,
  PlusCircle,
  BarChart3,
  UserCheck,
  Settings,
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="h-screen w-screen bg-slate-100 flex overflow-hidden text-sm">
  

      {/* Main Area */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white flex items-center justify-between px-6 border-b">
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
              <p className="text-sm font-medium">Placement Officer</p>
              <p className="text-xs text-slate-500">Admin</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
              A
            </div>
          </div>
        </header>

        {/* Content */}
        <section className="flex-1 overflow-y-auto p-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <StatCard title="Total Students" value="1,240" />
            <StatCard title="Registered Companies" value="48" />
            <StatCard title="Placed Students" value="620" />
            <StatCard title="Active Drives" value="12" />
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="h-14 px-6 flex items-center border-b">
              <h3 className="text-base font-semibold text-slate-800">
                Recent Placement Drives
              </h3>
            </div>

            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-3 text-left">Company</th>
                  <th className="px-6 py-3 text-left">Location</th>
                  <th className="px-6 py-3 text-left">Role</th>
                  <th className="px-6 py-3 text-left">Package</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                <TableRow
                  company="Google"
                  Location="xyz"
                  role="SDE"
                  pkg="₹18 LPA"
                  status="Open"
                />
                <TableRow
                  company="Infosys"
                  Location="xyz"
                  role="SE"
                  pkg="₹6 LPA"
                  status="Closed"
                />
                <TableRow
                  company="TCS"
                  Location="xyz"
                  role="Developer"
                  pkg="₹4 LPA"
                  status="Open"
                />
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}


function StatCard({ title, value }) {
  return (
    <div className="h-24 bg-white rounded-xl shadow-sm px-5 flex flex-col justify-center">
      <p className="text-xs text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-indigo-700 mt-1">{value}</p>
    </div>
  );
}

function TableRow({ company, Location, role, pkg, status }) {
  return (
    <tr className="border-t hover:bg-slate-50">
      <td className="px-6 py-3">{company}</td>
      <td className="px-6 py-3">{Location}</td>
      <td className="px-6 py-3">{role}</td>
      <td className="px-6 py-3">{pkg}</td>
      <td className="px-6 py-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold \
          ${
            status === "Open"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status}
        </span>
      </td>
    </tr>
  );
}
