import { useState } from "react";
import { Building2, Users, Send, Mail, CheckCircle } from "lucide-react";

export default function PostCompany() {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [drivePosted, setDrivePosted] = useState(false);

  /* ---------------- MOCK DATA ---------------- */

  const companies = [
    {
      id: 1,
      name: "Google",
      role: "Software Engineer",
      package: "18 LPA",
      location: "Bangalore",
      status: "Approved",
    },
    {
      id: 2,
      name: "Amazon",
      role: "SDE-1",
      package: "16 LPA",
      location: "Hyderabad",
      status: "Approved",
    },
  ];

  const appliedStudents = [
    {
      id: 1,
      name: "Rahul Sharma",
      branch: "CSE",
      cgpa: 8.4,
      status: "Applied",
    },
    {
      id: 2,
      name: "Priya Patel",
      branch: "IT",
      cgpa: 8.9,
      status: "Applied",
    },
  ];

  return (
    <div className="space-y-6 p-6 w-full">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">Post Company Drive</h2>
        <p className="text-sm text-slate-500">
          Select company drive, post it, and send eligible students data
        </p>
      </div>

      {/* ---------------- COMPANY LIST ---------------- */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <SectionHeader title="Approved Companies" />

        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left">Company</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-left">Package</th>
              <th className="px-6 py-3 text-left">Location</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c) => (
              <tr key={c.id} className="border-t hover:bg-slate-50">
                <td className="px-6 py-3 font-medium flex items-center gap-2">
                  <Building2 size={16} /> {c.name}
                </td>
                <td className="px-6 py-3">{c.role}</td>
                <td className="px-6 py-3">{c.package}</td>
                <td className="px-6 py-3">{c.location}</td>
                <td className="px-6 py-3">
                  <button
                    onClick={() => {
                      setSelectedCompany(c);
                      setDrivePosted(false);
                    }}
                    className="px-3 py-1 text-xs rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Select Drive
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------------- SELECTED DRIVE DETAILS ---------------- */}
      {selectedCompany && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <CheckCircle className="text-green-600" />
            Selected Drive Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <Detail label="Company" value={selectedCompany.name} />
            <Detail label="Role" value={selectedCompany.role} />
            <Detail label="Package" value={selectedCompany.package} />
            <Detail label="Location" value={selectedCompany.location} />
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={() => setDrivePosted(true)}
              className="px-4  py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
            >
              <Mail size={16} /> Post Drive & Notify Students
            </button>

            <button className="px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-900 flex items-center gap-2">
              <Mail size={16} /> Notify Company
            </button>
          </div>
        </div>
      )}

      {/* ---------------- APPLIED STUDENTS ---------------- */}
      {drivePosted && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <SectionHeader title="Students Applied for the Drive" />

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <StatCard
              label="Total Applied"
              value={appliedStudents.length}
              icon={<Users />}
            />
            <StatCard
              label="Eligible Students"
              value={appliedStudents.length}
              icon={<CheckCircle />}
            />
            <StatCard label="Data Sent to Company" value="No" icon={<Send />} />
          </div>

          {/* Students Table */}
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left">Student Name</th>
                <th className="px-6 py-3 text-left">Branch</th>
                <th className="px-6 py-3 text-left">CGPA</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {appliedStudents.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="px-6 py-3 font-medium">{s.name}</td>
                  <td className="px-6 py-3">{s.branch}</td>
                  <td className="px-6 py-3">{s.cgpa}</td>
                  <td className="px-6 py-3">
                    <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Send Data Button */}
          <div className="p-6 text-right">
            <button className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2 ml-auto">
              <Send size={16} /> Send Student Data to Company
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- REUSABLE COMPONENTS ---------------- */

function SectionHeader({ title }) {
  return (
    <div className="h-14 px-6 flex items-center border-b">
      <h3 className="font-semibold">{title}</h3>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
}
