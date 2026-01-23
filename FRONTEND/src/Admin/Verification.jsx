import { CheckCircle, XCircle, Eye } from "lucide-react";

export default function Verification() {
  const verifiedStudents = students.filter((s) => s.verified);
  const unverifiedStudents = students.filter((s) => !s.verified);

  const verifiedCompanies = companies.filter((c) => c.verified);
  const unverifiedCompanies = companies.filter((c) => !c.verified);

  return (
    <div className="h-screen w-screen flex bg-slate-100 text-sm overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 space-y-10">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Student Verification
          </h2>
          <p className="text-xs text-slate-500">
            Verify student eligibility before placement participation
          </p>
        </div>

        {/* Unverified Students Table */}
        <VerificationTable
          title="Unverified Students"
          students={unverifiedStudents}
          showActions
        />

        {/* Verified Students Table */}
        <VerificationTable
          title="Verified Students"
          students={verifiedStudents}
        />

        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Company Verification
          </h2>
          <p className="text-xs text-slate-500">
            Verify companies eligibility before placement process
          </p>
        </div>

        {/* Unverified Companies Table */}
        <VerificationTableCompanies
          title="Unverified Companies"
          companies={unverifiedCompanies}
          showActions
        />

        {/* Verified Companies Table */}
        <VerificationTableCompanies
          title="Verified Companies"
          companies={verifiedCompanies}
        />
      </main>
    </div>
  );
}

/* ---------------- Verification Table ---------------- */

function VerificationTable({ title, students, showActions }) {
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
            <th className="px-6 py-3 text-left">Documents</th>
            <th className="px-6 py-3 text-left">Status</th>
            {showActions && <th className="px-6 py-3 text-left">Action</th>}
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="border-t hover:bg-slate-50">
              <td className="px-6 py-3 font-medium">{student.id}</td>
              <td className="px-6 py-3">{student.name}</td>
              <td className="px-6 py-3">{student.department}</td>
              <td className="px-6 py-3 font-semibold">{student.cgpa}</td>
              <td className="px-6 py-3">
                {student.backlogs === 0 ? (
                  <span className="text-green-600 font-semibold">0</span>
                ) : (
                  <span className="text-red-600 font-semibold">
                    {student.backlogs}
                  </span>
                )}
              </td>
              <td className="px-6 py-3">
                <button className="flex items-center gap-1 text-indigo-600 text-xs font-semibold">
                  <Eye size={14} /> View
                </button>
              </td>
              <td className="px-6 py-3">
                {student.verified ? (
                  <span className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                    <CheckCircle size={14} /> Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-yellow-600 text-xs font-semibold">
                    <XCircle size={14} /> Pending
                  </span>
                )}
              </td>

              {showActions && (
                <td className="px-6 py-3 flex gap-2">
                  <button className="px-3 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-semibold hover:bg-green-200">
                    Approve
                  </button>
                  <button className="px-3 py-1 rounded-lg bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200">
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
function VerificationTableCompanies({ title, companies, showActions }) {
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
            <th className="px-6 py-3 text-left">Company ID</th>
            <th className="px-6 py-3 text-left">Name</th>
            <th className="px-6 py-3 text-left">Type</th>
            <th className="px-6 py-3 text-left">Location</th>
            <th className="px-6 py-3 text-left">Vacancy</th>
            <th className="px-6 py-3 text-left">Documents</th>
            <th className="px-6 py-3 text-left">Status</th>
            {showActions && <th className="px-6 py-3 text-left">Action</th>}
          </tr>
        </thead>

        <tbody>
          {companies.map((company) => (
            <tr key={company.id} className="border-t hover:bg-slate-50">
              <td className="px-6 py-3 font-medium">{company.id}</td>
              <td className="px-6 py-3">{company.name}</td>
              <td className="px-6 py-3">{company.type}</td>
              <td className="px-6 py-3 font-semibold">{company.location}</td>

              <td className="px-6 py-3 font-semibold">{company.vacancy}</td>

              <td className="px-6 py-3">
                <button className="flex items-center gap-1 text-indigo-600 text-xs font-semibold">
                  <Eye size={14} /> View
                </button>
              </td>
              <td className="px-6 py-3">
                {companies.verified ? (
                  <span className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                    <CheckCircle size={14} /> Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-yellow-600 text-xs font-semibold">
                    <XCircle size={14} /> Pending
                  </span>
                )}
              </td>

              {showActions && (
                <td className="px-6 py-3 flex gap-2">
                  <button className="px-3 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-semibold hover:bg-green-200">
                    Approve
                  </button>
                  <button className="px-3 py-1 rounded-lg bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200">
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

/* ---------------- Dummy Student Data ---------------- */

const students = [
  {
    id: "STD201",
    name: "Neha Patel",
    department: "CSE",
    cgpa: 8.6,
    backlogs: 0,
    verified: false,
  },
  {
    id: "STD202",
    name: "Rohan Mehta",
    department: "IT",
    cgpa: 7.4,
    backlogs: 1,
    verified: false,
  },
  {
    id: "STD203",
    name: "Ankit Shah",
    department: "ECE",
    cgpa: 8.1,
    backlogs: 0,
    verified: true,
  },
];
const companies = [
  {
    id: "C201",
    name: "Google",
    type: "Product",
    location: "US",
    vacancy: 5,
    verified: false,
  },
  {
    id: "C202",
    name: "Amazon",
    type: "Service",
    location: "US",
    vacancy: 15,
    verified: false,
  },
  {
    id: "C203",
    name: "Microsoft",
    type: "Product ",
    location: "US",
    vacancy: 10,
    verified: true,
  },
];
