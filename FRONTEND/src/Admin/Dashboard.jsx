import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [drives, setDrives] = useState([]);
  const [admin, setAdmin] = useState({});

  useEffect(() => {
    (fetchDashboardData(), fetchAdmin());
  }, []);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await axios.get("http://localhost:8000/api/admin/stats");
      const drivesRes = await axios.get(
        "http://localhost:8000/api/admin/drives",
      );

      setStats(statsRes.data);
      setDrives(drivesRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAdmin = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/admin/profile", {
        withCredentials: true, // 🔥 IMPORTANT for cookies
      });

      setAdmin(res.data.admin);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="h-screen w-screen bg-slate-100 flex overflow-hidden text-2xl">
      {/* Main Area */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white flex items-center justify-between px-8 border-b">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              Dashboard Overview
            </h2>
            <p className="text-sm text-slate-500">
              Placement statistics & management
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <img
                src={
                  admin?.profilepic ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                alt="Admin"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold"></p>
                <p className="text-sm text-gray-500">{admin.name}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <section className="flex-1 overflow-y-auto p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="h-32 bg-white rounded-xl shadow-sm px-6 flex flex-col justify-center">
              <p className="text-sm text-slate-500">Total Students:</p>
              <p className="text-3xl font-bold text-indigo-700 mt-1">
                {stats.totalStudents}
              </p>
            </div>

            <div className="h-32 bg-white rounded-xl shadow-sm px-6 flex flex-col justify-center">
              <p className="text-sm text-slate-500">Total Companies:</p>
              <p className="text-3xl font-bold text-indigo-700 mt-1">
                {stats.totalCompanies}
              </p>
            </div>

            <div className="h-32 bg-white rounded-xl shadow-sm px-6 flex flex-col justify-center">
              <p className="text-sm text-slate-500">Placed Students:</p>
              <p className="text-3xl font-bold text-indigo-700 mt-1">
                {stats.placedStudents}
              </p>
            </div>

            <div className="h-32 bg-white rounded-xl shadow-sm px-6 flex flex-col justify-center">
              <p className="text-sm text-slate-500">Remaining Drives:</p>
              <p className="text-3xl font-bold text-indigo-700 mt-1">
                {stats.activeDrives}
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="h-16 px-8 flex items-center border-b">
              <h3 className="text-lg font-semibold text-slate-800">
                Placement Drives
              </h3>
            </div>

            <table className="w-full text-base">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-4 text-left">Company</th>
                  <th className="px-6 py-4 text-left">Location</th>
                  <th className="px-6 py-4 text-left">Role</th>
                  <th className="px-6 py-4 text-left">Package</th>
                  <th className="px-6 py-4 text-left">Visited</th>
                </tr>
              </thead>

              <tbody>
                {drives.map((drive, index) => (
                  <tr className="border-t hover:bg-slate-50" key={index}>
                    <td className="px-6 py-4">{drive.company?.name}</td>
                    <td className="px-6 py-4">{drive.company?.location}</td>
                    <td className="px-6 py-4">{drive.roles}</td>
                    <td className="px-6 py-4">₹{drive.pack} LPA</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-4 py-2 rounded-full text-md font-semibold ${
                          drive.visited
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {drive.visited ? "Yes" : "No"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
