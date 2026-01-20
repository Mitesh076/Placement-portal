import {
  CheckCircle,
  XCircle,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  LayoutDashboard,
  Users,
  GraduationCap,
  Building2,
  PlusCircle,
  BarChart3,
  UserCheck,
  Settings,
} from "lucide-react";

export default function Students() {
  return (
    <div className="h-screen w-screen flex bg-slate-100 text-sm overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 space-y-10">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Students Overview
          </h2>
          <p className="text-xs text-slate-500">
            Track student participation and placement status
          </p>
        </div>

        {/* All Students Table */}
        <StudentTable title="All Students" students={allStudents} />

        {/* Placed Students */}
        <StudentTable
          title="Placed Students"
          students={placedStudents}
          status="placed"
        />

        {/* Unplaced Students */}
        <StudentTable
          title="Unplaced Students"
          students={unplacedStudents}
          status="unplaced"
        />
      </main>
    </div>
  );
}

function StudentTable({ title, students, status }) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="h-14 px-6 flex items-center justify-between border-b">
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
        <span className="text-xs text-slate-500">Total: {students.length}</span>
      </div>

      <table className="w-full">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-6 py-3 text-left">Student ID</th>
            <th className="px-6 py-3 text-left">Name</th>
            <th className="px-6 py-3 text-left">Department</th>
            <th className="px-6 py-3 text-left">Companies Appeared</th>
            <th className="px-6 py-3 text-left">Status</th>
            <th className="px-6 py-3 text-left">Toggle Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="border-t hover:bg-slate-50">
              <td className="px-6 py-3 font-medium">{student.id}</td>
              <td className="px-6 py-3">{student.name}</td>
              <td className="px-6 py-3">{student.department}</td>
              <td className="px-6 py-3">
                <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
                  {student.appliedCount}
                </span>
              </td>
              <td className="px-6 py-3">
                {student.placed ? (
                  <span className="flex items-center gap-2 text-green-600">
                    <CheckCircle size={16} /> Placed
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-red-600">
                    <XCircle size={16} /> Unplaced
                  </span>
                )}
              </td>

              <td className="px-6 py-3">
                {student.placed ? (
                  <button className="px-3 py-1 rounded-lg text-xs font-semibold bg-red-100 text-red-600 hover:bg-red-200">
                    Mark Unplaced
                  </button>
                ) : (
                  <button className="px-3 py-1 rounded-lg text-xs font-semibold bg-green-100 text-green-600 hover:bg-green-200">
                    Mark Placed
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Dummy UI Data
const allStudents = [
  {
    id: "STD101",
    name: "Rahul Sharma",
    department: "CSE",
    appliedCount: 5,
    placed: false,
    onoff: false,
  },
  {
    id: "STD102",
    name: "Priya Patel",
    department: "IT",
    appliedCount: 3,
    placed: true,
    onoff: false,
  },
  {
    id: "STD103",
    name: "Amit Verma",
    department: "ECE",
    appliedCount: 4,
    placed: true,
    onoff: true,
  },
];

const placedStudents = allStudents.filter((s) => s.placed);
const unplacedStudents = allStudents.filter((s) => !s.placed);
