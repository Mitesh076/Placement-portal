import { BarChart, TrendingUp, Users, Building2 } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Reports() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    placedStudents: 0,
    visitedCompanies: 0,
    placementPercentage: 0,
  });

  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, studentRes, companyRes] = await Promise.all([
        axios.get("http://localhost:8000/api/admin/report-stats", {
          withCredentials: true,
        }),
        axios.get("http://localhost:8000/api/admin/report-pstudents", {
          withCredentials: true,
        }),
        axios.get("http://localhost:8000/api/admin/reports-cwise", {
          withCredentials: true,
        }),
      ]);

      setStats(statsRes.data);
      setStudents(studentRes.data);
      setCompanies(companyRes.data);
    } catch (err) {
      console.error("Reports fetch error:", err);
    }
  };

  return (
    <div className="h-screen w-screen flex bg-slate-100 text-sm overflow-hidden">
      <main className="flex-1 overflow-y-auto p-6 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Reports & Analytics
          </h2>
          <p className="text-xs text-slate-500">
            Overall placement statistics and insights
          </p>
        </div>

        {/* ✅ Stats Cards */}
        <div className="grid grid-cols-4 gap-6">
          <StatCard
            icon={<Users />}
            label="Total Students"
            value={stats.totalStudents}
          />
          <StatCard
            icon={<TrendingUp />}
            label="Placed Students"
            value={stats.placedStudents}
          />
          <StatCard
            icon={<Building2 />}
            label="Visited Companies"
            value={stats.visitedCompanies}
          />
          <StatCard
            icon={<BarChart />}
            label="Placement %"
            value={`${stats.placementPercentage}%`}
          />
        </div>

        {/* ✅ Placed Students Table */}
        <ReportTable title="Placed Students Report" data={students} />

        {/* ✅ Company-wise Placement Table */}
        <CompanyReportTable data={companies} />
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

function ReportTable({ title, data }) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="h-14 px-6 flex items-center border-b">
        <h3 className="font-semibold">{title}</h3>
        <span className="ml-auto text-xs text-slate-400">
          Total: {data.length}
        </span>
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
          {data.length > 0 ? (
            data.map((s, i) => (
              <tr key={i} className="border-t hover:bg-slate-50">
                <td className="px-6 py-3">{s.erno}</td>
                <td className="px-6 py-3">{s.name}</td>
                <td className="px-6 py-3">{s.branch}</td>
                <td className="px-6 py-3">{s.pcname}</td>
                <td className="px-6 py-3">{s.pack} LPA</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-6 text-slate-400">
                No placed students found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function CompanyReportTable({ data }) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="h-14 px-6 flex items-center border-b">
        <h3 className="font-semibold">Company-wise Placement</h3>
        <span className="ml-auto text-xs text-slate-400">
          Total: {data.length}
        </span>
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
          {data.length > 0 ? (
            data.map((c, i) => (
              <tr key={i} className="border-t hover:bg-slate-50">
                <td className="px-6 py-3">{c.company}</td>
                <td className="px-6 py-3">{c.location}</td>
                <td className="px-6 py-3">{c.pack} LPA</td>
                <td className="px-6 py-3">{c.splaced}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-6 text-slate-400">
                No company data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
