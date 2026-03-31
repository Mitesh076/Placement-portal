import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Eye } from "lucide-react";

export default function Verification() {
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);

  // 🔄 FETCH STUDENTS
  const fetchStudents = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/admin/sverified");
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔄 FETCH COMPANIES
  const fetchCompanies = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/admin/cverified");
      const data = await res.json();
      setCompanies(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchCompanies();
  }, []);

  // ✅ FILTERS
  const verifiedStudents = students.filter((s) => s.status === "Verified");
  const unverifiedStudents = students.filter((s) => s.status === "Unverified");

  const verifiedCompanies = companies.filter((c) => c.status === "Verified");
  const unverifiedCompanies = companies.filter(
    (c) => c.status === "Unverified",
  );

  // ✅ ACTION HANDLERS
  const handleStudentAction = async (id, status) => {
    try {
      await fetch(`/api/admin/sverification/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompanyAction = async (id, status) => {
    try {
      await fetch(`/api/admin/cverification/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      fetchCompanies();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-screen w-screen flex bg-slate-100 text-sm overflow-hidden">
      <main className="flex-1 overflow-y-auto p-6 space-y-10">
        {/* STUDENT SECTION */}
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Student Verification
          </h2>
          <p className="text-xs text-slate-500">
            Verify student eligibility before placement participation
          </p>
        </div>

        <VerificationTable
          title="Unverified Students"
          students={unverifiedStudents}
          showActions
          onAction={handleStudentAction}
        />

        <VerificationTable
          title="Verified Students"
          students={verifiedStudents}
        />

        {/* COMPANY SECTION */}
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Company Verification
          </h2>
          <p className="text-xs text-slate-500">
            Verify companies before placement process
          </p>
        </div>

        <VerificationTableCompanies
          title="Unverified Companies"
          companies={unverifiedCompanies}
          showActions
          onAction={handleCompanyAction}
        />

        <VerificationTableCompanies
          title="Verified Companies"
          companies={verifiedCompanies}
        />
      </main>
    </div>
  );
}

/* ---------------- STUDENT TABLE ---------------- */

function VerificationTable({ title, students, showActions, onAction }) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="h-14 px-6 flex items-center justify-between border-b">
        <h3 className="font-semibold">{title}</h3>
        <span className="text-xs text-slate-500">Total: {students.length}</span>
      </div>

      <table className="w-full">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-6 py-3 text-left">Student ID</th>
            <th className="px-6 py-3 text-left">Name</th>
            <th className="px-6 py-3 text-left">Department</th>
            <th className="px-6 py-3 text-left">CGPA</th>
            <th className="px-6 py-3 text-left">Backlogs</th>
            <th className="px-6 py-3 text-left">Status</th>
            {showActions && <th className="px-6 py-3 text-left">Action</th>}
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student._id} className="border-t hover:bg-slate-50">
              <td className="px-6 py-3 font-medium">{student.studentId}</td>
              <td className="px-6 py-3">{student.name}</td>
              <td className="px-6 py-3">{student.department}</td>
              <td className="px-6 py-3">{student.cgpa}</td>
              <td className="px-6 py-3">{student.backlogs}</td>

              <td className="px-6 py-3">
                {student.status === "Verified" ? (
                  <span className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                    <CheckCircle size={14} /> Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-yellow-600 text-xs font-semibold">
                    <XCircle size={14} /> Unverified
                  </span>
                )}
              </td>

              {showActions && (
                <td className="px-6 py-3 flex gap-2">
                  <button
                    onClick={() => onAction(student._id, "Verified")}
                    className="px-3 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-semibold"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => onAction(student._id, "Rejected")}
                    className="px-3 py-1 rounded-lg bg-red-100 text-red-700 text-xs font-semibold"
                  >
                    Reject
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- COMPANY TABLE ---------------- */

function VerificationTableCompanies({
  title,
  companies,
  showActions,
  onAction,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="h-14 px-6 flex items-center justify-between border-b">
        <h3 className="font-semibold">{title}</h3>
        <span className="text-xs text-slate-500">
          Total: {companies.length}
        </span>
      </div>

      <table className="w-full">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-6 py-3 text-left">Name</th>
            <th className="px-6 py-3 text-left">Type</th>
            <th className="px-6 py-3 text-left">Location</th>
            <th className="px-6 py-3 text-left">Status</th>
            {showActions && <th className="px-6 py-3 text-left">Action</th>}
          </tr>
        </thead>

        <tbody>
          {companies.map((company) => (
            <tr key={company._id} className="border-t hover:bg-slate-50">
              <td className="px-6 py-3">{company.name}</td>
              <td className="px-6 py-3">{company.industry}</td>
              <td className="px-6 py-3">{company.location}</td>

              <td className="px-6 py-3">
                {company.status === "Verified" ? (
                  <span className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                    <CheckCircle size={14} /> Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-yellow-600 text-xs font-semibold">
                    <XCircle size={14} /> Unverified
                  </span>
                )}
              </td>

              {showActions && (
                <td className="px-6 py-3 flex gap-2">
                  <button
                    onClick={() => onAction(company._id, "Verified")}
                    className="px-3 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-semibold"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => onAction(company._id, "Rejected")}
                    className="px-3 py-1 rounded-lg bg-red-100 text-red-700 text-xs font-semibold"
                  >
                    Reject
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
