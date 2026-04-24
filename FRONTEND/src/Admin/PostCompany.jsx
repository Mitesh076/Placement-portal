import { useState, useEffect } from "react";
import { Building2, Users, Send, Mail, CheckCircle } from "lucide-react";

export default function PostCompany() {
  const [drives, setDrives] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [students, setStudents] = useState([]);
  const [drivePosted, setDrivePosted] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Drive form fields
  const [driveForm, setDriveForm] = useState({
    roles: "",
    pack: "",
    ebranches: "",
    drivedate: "",
    jobtype: "Full-time",
    mincgpa: "",
    bond: "",
    lastdate: "",
  });

  useEffect(() => {
    fetchApprovedCompanies();
  }, []);

  const fetchApprovedCompanies = async () => {
    try {
      const res = await fetch(
        "http://localhost:8000/api/admin/approved-companies",
        { credentials: "include" },
      );
      const data = await res.json();
      setDrives(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectCompany = (company) => {
    setSelectedCompany(company);
    setDrivePosted(false);
    setStudents([]);
    // ✅ Pre-fill roles and pack from approved company data
    setDriveForm((prev) => ({
      ...prev,
      roles: company.roles || "",
      pack: company.pack || "",
    }));
  };

  // ✅ POST DRIVE + FETCH ELIGIBLE STUDENTS
  const handlePostDrive = async () => {
    if (!selectedCompany) {
      alert("Please select a company first");
      return;
    }

    // ✅ Validate required fields
    const required = [
      "roles",
      "pack",
      "ebranches",
      "drivedate",
      "mincgpa",
      "bond",
      "lastdate",
    ];
    for (const field of required) {
      if (!driveForm[field]) {
        alert(`Please fill in: ${field}`);
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/admin/drive/post/${selectedCompany._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(driveForm),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to post drive");
        return;
      }

      setStudents(data.eligible || []);
      setDrivePosted(true);

      // ✅ Refresh companies list (posted company will disappear since visited=true)
      fetchApprovedCompanies();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 w-full">
      <div>
        <h2 className="text-xl font-semibold">Post Company Drive</h2>
        <p className="text-sm text-slate-500">
          Select a verified company, fill drive details, and notify eligible
          students
        </p>
      </div>

      {/* APPROVED COMPANIES LIST */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <SectionHeader title="Verified Companies (Not Yet Visited)" />
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
            {drives.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-6 text-center text-slate-400"
                >
                  No verified companies available
                </td>
              </tr>
            ) : (
              drives.map((d) => (
                <tr
                  key={d._id}
                  className={`border-t hover:bg-slate-50 ${
                    selectedCompany?._id === d._id ? "bg-indigo-50" : ""
                  }`}
                >
                  <td className="px-6 py-3 font-medium flex items-center gap-2">
                    <Building2 size={16} /> {d.name}
                  </td>
                  <td className="px-6 py-3">{d.roles}</td>
                  <td className="px-6 py-3">{d.pack}</td>
                  <td className="px-6 py-3">{d.location}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => handleSelectCompany(d)}
                      className="px-3 py-1 text-xs rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* DRIVE DETAILS FORM */}
      {selectedCompany && !drivePosted && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <CheckCircle className="text-green-600" size={20} />
            Drive Details for {selectedCompany.name}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="text-xs text-slate-500">Role</label>
              <input
                className="w-full border rounded-lg px-3 py-2 mt-1"
                value={driveForm.roles}
                onChange={(e) =>
                  setDriveForm({ ...driveForm, roles: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-xs text-slate-500">Package (LPA)</label>
              <input
                type="number"
                className="w-full border rounded-lg px-3 py-2 mt-1"
                value={driveForm.pack}
                onChange={(e) =>
                  setDriveForm({ ...driveForm, pack: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-xs text-slate-500">
                Eligible Branches (e.g. CE,IT)
              </label>
              <input
                className="w-full border rounded-lg px-3 py-2 mt-1"
                placeholder="CE,IT"
                value={driveForm.ebranches}
                onChange={(e) =>
                  setDriveForm({ ...driveForm, ebranches: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-xs text-slate-500">Minimum CGPA</label>
              <input
                type="number"
                step="0.1"
                className="w-full border rounded-lg px-3 py-2 mt-1"
                value={driveForm.mincgpa}
                onChange={(e) =>
                  setDriveForm({ ...driveForm, mincgpa: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-xs text-slate-500">Drive Date</label>
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2 mt-1"
                value={driveForm.drivedate}
                onChange={(e) =>
                  setDriveForm({ ...driveForm, drivedate: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-xs text-slate-500">
                Last Date to Apply
              </label>
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2 mt-1"
                value={driveForm.lastdate}
                onChange={(e) =>
                  setDriveForm({ ...driveForm, lastdate: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-xs text-slate-500">Job Type</label>
              <select
                className="w-full border rounded-lg px-3 py-2 mt-1"
                value={driveForm.jobtype}
                onChange={(e) =>
                  setDriveForm({ ...driveForm, jobtype: e.target.value })
                }
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500">
                Bond (e.g. 2 years / None)
              </label>
              <input
                className="w-full border rounded-lg px-3 py-2 mt-1"
                placeholder="None"
                value={driveForm.bond}
                onChange={(e) =>
                  setDriveForm({ ...driveForm, bond: e.target.value })
                }
              />
            </div>
          </div>

          <button
            onClick={handlePostDrive}
            disabled={loading}
            className="mt-4 px-4 py-2 rounded-lg flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
          >
            <Mail size={16} />
            {loading ? "Posting..." : "Post Drive & Notify Students"}
          </button>
        </div>
      )}

      {/* ELIGIBLE STUDENTS */}
      {drivePosted && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <SectionHeader title="Eligible Students" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <StatCard
              label="Total Eligible"
              value={students.length}
              icon={<Users />}
            />
            <StatCard
              label="Company"
              value={selectedCompany?.name}
              icon={<CheckCircle />}
            />
            <StatCard label="Drive Posted" value="Yes" icon={<Send />} />
          </div>

          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left">Enrollment No</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Branch</th>
                <th className="px-6 py-3 text-left">CGPA</th>
                <th className="px-6 py-3 text-left">Email</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-6 text-center text-slate-400"
                  >
                    No eligible students found
                  </td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr key={s._id} className="border-t hover:bg-slate-50">
                    <td className="px-6 py-3">{s.erno}</td>
                    <td className="px-6 py-3 font-medium">{s.name}</td>
                    <td className="px-6 py-3">{s.branch}</td>
                    <td className="px-6 py-3">{s.cgpa}</td>
                    <td className="px-6 py-3">{s.email}</td>
                  </tr>
                ))
              )}
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
