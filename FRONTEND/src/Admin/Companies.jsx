import {
  CheckCircle,
  XCircle,
  CalendarDays,
  MapPin,
  Users,
} from "lucide-react";

export default function Companies() {
  return (
    <div className="h-screen w-screen flex bg-slate-100 text-sm overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 space-y-10">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Companies Overview
          </h2>
          <p className="text-xs text-slate-500">
            Manage visited and upcoming companies for campus placements
          </p>
        </div>

        {/* Stats Cards */}
        <div className="flex items-center justify-between">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Total Companies" value="8" icon={<Users />} />
            <StatCard
              title="Visited Companies"
              value="5"
              icon={<CheckCircle />}
            />
            <StatCard
              title="Upcoming Companies"
              value="3"
              icon={<CalendarDays />}
            />
          </div>
        </div>

        {/* Visited Companies */}
        <CompanyTable
          title="Visited Companies"
          companies={visitedCompanies}
          visited
        />

        {/* Upcoming Companies */}
        <CompanyTable
          title="Upcoming / Not Visited Companies"
          companies={upcomingCompanies}
        />
      </main>
    </div>
  );
}

/* ==========================
   STAT CARD
========================== */

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between">
      <div>
        <p className="text-xs text-slate-500">{title}</p>
        <h3 className="text-2xl font-semibold text-slate-800">{value}</h3>
      </div>
      <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
        {icon}
      </div>
    </div>
  );
}

/* ==========================
   COMPANY TABLE
========================== */

function CompanyTable({ title, companies, visited }) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="h-14 px-6 flex items-center justify-between border-b">
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
        <span className="text-xs text-slate-500">
          Total: {companies.length}
        </span>
      </div>

      <table className="w-full">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-6 py-3 text-left">Company ID</th>
            <th className="px-6 py-3 text-left">Company Name</th>
            <th className="px-6 py-3 text-left">Location</th>
            <th className="px-6 py-3 text-left">Package</th>
            <th className="px-6 py-3 text-left">Students Appeared</th>
            <th className="px-6 py-3 text-left">Placed Students</th>
            <th className="px-6 py-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id} className="border-t hover:bg-slate-50">
              <td className="px-6 py-3 font-medium">{company.id}</td>
              <td className="px-6 py-3">{company.name}</td>
              <td className="px-6 py-3 flex items-center gap-1">
                <MapPin size={14} /> {company.location}
              </td>
              <td className="px-6 py-3">{company.package}</td>
              <td className="px-6 py-3">
                <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
                  {company.studentsAppeared}
                </span>
              </td>
              <td className="px-6 py-3">
                <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
                  {company.placedStudents}
                </span>
              </td>
              <td className="px-6 py-3">
                {visited ? (
                  <span className="flex items-center gap-2 text-green-600">
                    <CheckCircle size={16} /> Visited
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-orange-600">
                    <XCircle size={16} /> Upcoming
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ==========================
   UI-ONLY DUMMY DATA
========================== */

const visitedCompanies = [
  {
    id: "CMP101",
    name: "TCS",
    location: "Mumbai",
    package: "7 LPA",
    studentsAppeared: 120,
    placedStudents: 38,
  },
  {
    id: "CMP102",
    name: "Infosys",
    location: "Pune",
    package: "6.5 LPA",
    studentsAppeared: 95,
    placedStudents: 27,
  },
];

const upcomingCompanies = [
  {
    id: "CMP201",
    name: "Google",
    location: "Bangalore",
    package: "25 LPA",
    studentsAppeared: "—",
  },
  {
    id: "CMP202",
    name: "Amazon",
    location: "Hyderabad",
    package: "18 LPA",
    studentsAppeared: "—",
  },
];
