import { useState, useEffect } from "react";
import { Building2, Users, Send, Mail, CheckCircle } from "lucide-react";

export default function PostCompany() {
  const [drives, setDrives] = useState([]);
  const [driveId, setDriveId] = useState(null);
  const [students, setStudents] = useState([]);

  const [selectedDrive, setSelectedDrive] = useState(null);
  const [drivePosted, setDrivePosted] = useState(false);

  useEffect(() => {
    fetchDrives();
  }, []);

  // ✅ FETCH ALL DRIVES (NOT COMPANIES)
  const fetchDrives = async () => {
    try {
      const res = await fetch(
        "http://localhost:8000/api/admin/approved-companies",
      );
      const data = await res.json();
      setDrives(data);
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ SELECT DRIVE (NO API CALL)
  const handleSelectDrive = (drive) => {
    console.log("Selected Drive:", drive); //
    setSelectedDrive(drive);
    setDriveId(drive._id); // 🔥 IMPORTANT
    setDrivePosted(false);
  };

  // ✅ FETCH ELIGIBLE STUDENTS
  const handlePostDrive = async () => {
    if (!driveId) {
      alert("Please select drive first");
      return;
    }

    const res = await fetch(
      `http://localhost:8000/api/admin/drive/eligible/${driveId}`,
    );

    const data = await res.json();

    console.log("Students:", data);

    // ✅ FIX HERE
    setStudents(Array.isArray(data) ? data : data.students || []);

    setDrivePosted(true);
  };

  return (
    <div className="space-y-6 p-6 w-full">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">Post Company Drive</h2>
        <p className="text-sm text-slate-500">
          Select drive, view students, and send data to company
        </p>
      </div>

      {/* DRIVES LIST */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <SectionHeader title="Active Drives" />

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
            {drives.map((d) => (
              <tr key={d._id} className="border-t hover:bg-slate-50">
                <td className="px-6 py-3 font-medium flex items-center gap-2">
                  <Building2 size={16} /> {d.name}
                </td>
                <td className="px-6 py-3">{d.roles}</td>
                <td className="px-6 py-3">{d.pack}</td>
                <td className="px-6 py-3">{d.location}</td>
                <td className="px-6 py-3">
                  <button
                    onClick={() => handleSelectDrive(d)}
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

      {/* SELECTED DRIVE DETAILS */}
      {selectedDrive && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <CheckCircle className="text-green-600" />
            Selected Drive Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <Detail label="Company" value={selectedDrive.name} />
            <Detail label="Role" value={selectedDrive.roles} />
            <Detail label="Package" value={selectedDrive.pack} />
            <Detail label="Location" value={selectedDrive.location} />
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handlePostDrive}
              disabled={!driveId}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                driveId
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-400 cursor-not-allowed text-white"
              }`}
            >
              <Mail size={16} /> Post Drive & Notify Students
            </button>
          </div>
        </div>
      )}

      {/* STUDENTS */}
      {drivePosted && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <SectionHeader title="Eligible Students" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <StatCard
              label="Total Students"
              value={students.length}
              icon={<Users />}
            />
            <StatCard
              label="Eligible Students"
              value={students.length}
              icon={<CheckCircle />}
            />
            <StatCard label="Data Sent" value="No" icon={<Send />} />
          </div>

          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left">Student Name</th>
                <th className="px-6 py-3 text-left">Branch</th>
                <th className="px-6 py-3 text-left">CGPA</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s) => (
                <tr key={s._id} className="border-t">
                  <td className="px-6 py-3 font-medium">{s.name}</td>
                  <td className="px-6 py-3">{s.branch}</td>
                  <td className="px-6 py-3">{s.cgpa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* COMPONENTS */

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
