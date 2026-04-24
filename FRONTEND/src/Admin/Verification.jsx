import { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

export default function Verification() {
  const [pendingStudents, setPendingStudents] = useState([]);
  const [verifiedStudents, setVerifiedStudents] = useState([]);
  const [pendingCompanies, setPendingCompanies] = useState([]);
  const [verifiedCompanies, setVerifiedCompanies] = useState([]);

  // 🔄 FETCH STUDENTS
  const fetchStudents = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/admin/sverified", {
        credentials: "include",
      });
      const data = await res.json();

      // ✅ Backend returns { pending, verified }
      setPendingStudents(data.pending || []);
      setVerifiedStudents(data.verified || []);
    } catch (err) {
      console.error("Students fetch error:", err);
    }
  };

  // 🔄 FETCH COMPANIES
  const fetchCompanies = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/admin/cverified", {
        credentials: "include",
      });
      const data = await res.json();

      // ✅ Backend returns { pending, verified, rejected }
      setPendingCompanies(data.pending || []);
      setVerifiedCompanies(data.verified || []);
    } catch (err) {
      console.error("Companies fetch error:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchCompanies();
  }, []);

  // ✅ STUDENT ACTION — pass placementId not student._id
  const handleStudentAction = async (placementId, status) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/admin/sverification/${placementId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status }),
        },
      );

      if (!res.ok) {
        const err = await res.json();
        console.error("Update failed:", err.message);
        return;
      }

      fetchStudents(); // ✅ Refresh after update
    } catch (err) {
      console.error("Student action error:", err);
    }
  };

  // ✅ COMPANY ACTION — pass verificationId not company._id
  const handleCompanyAction = async (verificationId, status) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/admin/cverification/${verificationId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status }),
        },
      );

      if (!res.ok) {
        const err = await res.json();
        console.error("Update failed:", err.message);
        return;
      }

      fetchCompanies(); // ✅ Refresh after update
    } catch (err) {
      console.error("Company action error:", err);
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
          title="Pending Students"
          students={pendingStudents}
          showActions
          onAction={handleStudentAction}
        />

        <VerificationTable
          title="Verified Students"
          students={verifiedStudents}
          showActions={false}
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
          title="Pending Companies"
          companies={pendingCompanies}
          showActions
          onAction={handleCompanyAction}
        />

        <VerificationTableCompanies
          title="Verified Companies"
          companies={verifiedCompanies}
          showActions={false}
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
          {students.length === 0 ? (
            <tr>
              <td
                colSpan={showActions ? 7 : 6}
                className="px-6 py-6 text-center text-slate-400"
              >
                No students found
              </td>
            </tr>
          ) : (
            students.map((student) => (
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
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      {/* ✅ Pass placementId for the update route */}
                      <button
                        onClick={() =>
                          onAction(student.placementId, "Verified")
                        }
                        className="px-3 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-semibold hover:bg-green-200"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          onAction(student.placementId, "Rejected")
                        }
                        className="px-3 py-1 rounded-lg bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
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
            <th className="px-6 py-3 text-left">Industry</th>
            <th className="px-6 py-3 text-left">Location</th>
            <th className="px-6 py-3 text-left">Status</th>
            {showActions && <th className="px-6 py-3 text-left">Action</th>}
          </tr>
        </thead>

        <tbody>
          {companies.length === 0 ? (
            <tr>
              <td
                colSpan={showActions ? 5 : 4}
                className="px-6 py-6 text-center text-slate-400"
              >
                No companies found
              </td>
            </tr>
          ) : (
            companies.map((company) => (
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
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      {/* ✅ Pass verificationId for the update route */}
                      <button
                        onClick={() =>
                          onAction(company.verificationId, "Verified")
                        }
                        className="px-3 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-semibold hover:bg-green-200"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          onAction(company.verificationId, "Rejected")
                        }
                        className="px-3 py-1 rounded-lg bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
