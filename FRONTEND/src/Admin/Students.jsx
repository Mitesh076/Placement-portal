import { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import axios from "axios";

export default function Students() {
  const [students, setStudents] = useState([]);

  // ✅ Fetch from backend
  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/admin/placed");
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ✅ Toggle placement status
  const toggleStatus = async (id) => {
    try {
      await axios.put(`http://localhost:8000/api/admin/${id}/toggle`);
      fetchStudents(); // refresh UI
    } catch (err) {
      console.error(err);
    }
  };

  const placedStudents = students.filter((s) => s.placed);
  const unplacedStudents = students.filter((s) => !s.placed);

  return (
    <div className="h-screen w-screen flex bg-slate-100 text-sm overflow-hidden">
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

        {/* Tables */}
        <StudentTable
          title="All Students"
          students={students}
          toggleStatus={toggleStatus}
        />

        <StudentTable
          title="Placed Students"
          students={placedStudents}
          toggleStatus={toggleStatus}
        />

        <StudentTable
          title="Unplaced Students"
          students={unplacedStudents}
          toggleStatus={toggleStatus}
        />
      </main>
    </div>
  );
}

function StudentTable({ title, students, toggleStatus }) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="h-14 px-6 flex items-center justify-between border-b">
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
        <span className="text-xs text-slate-500">Total: {students.length}</span>
      </div>

      <table className="w-full">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-6 py-3 text-left">Name</th>
            <th className="px-6 py-3 text-left">Department</th>
            <th className="px-6 py-3 text-left">Drives Appeared</th>
            <th className="px-6 py-3 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student._id} className="border-t hover:bg-slate-50">
              <td className="px-6 py-3">{student.name}</td>

              <td className="px-6 py-3">{student.branch}</td>

              <td className="px-6 py-3">
                <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
                  {student.applied}
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
