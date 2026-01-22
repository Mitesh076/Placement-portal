import { useState } from "react";
import {
  BookOpen,
  GraduationCap,
  Award,
  AlertTriangle,
  Pencil,
  Save,
  X,
} from "lucide-react";

export default function Academic() {
  const [isEditing, setIsEditing] = useState(false);

  const [academicData, setAcademicData] = useState({
    tenth: {
      board: "GSEB",
      year: 2019,
      percentage: "85%",
      school: "ABC High School",
    },
    twelfth: {
      board: "GSEB",
      year: 2021,
      percentage: "82%",
      stream: "Science",
      school: "XYZ Higher Secondary School",
    },
    graduation: {
      course: "B.Tech",
      branch: "Computer Engineering",
      college: "ABC Institute of Technology",
      cgpa: 8.2,
      backlogs: 0,
    },
    semesters: [
      { sem: 1, sgpa: 7.8, backlogs: 0 },
      { sem: 2, sgpa: 8.0, backlogs: 0 },
      { sem: 3, sgpa: 8.1, backlogs: 0 },
      { sem: 4, sgpa: 8.3, backlogs: 0 },
      { sem: 5, sgpa: 8.4, backlogs: 0 },
    ],
  });

  const handleChange = (section, field, value, index = null) => {
    setAcademicData((prev) => {
      const updated = { ...prev };
      if (section === "semesters") {
        updated.semesters[index][field] = value;
      } else {
        updated[section][field] = value;
      }
      return updated;
    });
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("Saved Academic Data:", academicData);
    // 🔗 API call can be added here
  };

  return (
    <div className="space-y-6 w-full p-6 overflow-y-scroll">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Academic Details</h2>
          <p className="text-sm text-slate-500">
            View and manage your academic performance
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg"
          >
            <Pencil size={16} /> Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg"
            >
              <Save size={16} /> Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg"
            >
              <X size={16} /> Cancel
            </button>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard
          label="Current CGPA"
          value={academicData.graduation.cgpa}
          icon={<GraduationCap />}
        />
        <SummaryCard
          label="Total Backlogs"
          value={academicData.graduation.backlogs}
          icon={<AlertTriangle />}
        />
        <SummaryCard
          label="10th %"
          value={academicData.tenth.percentage}
          icon={<Award />}
        />
        <SummaryCard
          label="12th %"
          value={academicData.twelfth.percentage}
          icon={<Award />}
        />
      </div>

      {/* Sections */}
      <Section title="10th Standard">
        <Field
          label="Board"
          value={academicData.tenth.board}
          isEditing={isEditing}
          onChange={(v) => handleChange("tenth", "board", v)}
        />
        <Field
          label="Year"
          value={academicData.tenth.year}
          isEditing={isEditing}
          onChange={(v) => handleChange("tenth", "year", v)}
        />
        <Field
          label="Percentage"
          value={academicData.tenth.percentage}
          isEditing={isEditing}
          onChange={(v) => handleChange("tenth", "percentage", v)}
        />
        <Field
          label="School"
          value={academicData.tenth.school}
          isEditing={isEditing}
          onChange={(v) => handleChange("tenth", "school", v)}
        />
      </Section>

      <Section title="12th Standard / Diploma">
        <Field
          label="Board"
          value={academicData.twelfth.board}
          isEditing={isEditing}
          onChange={(v) => handleChange("twelfth", "board", v)}
        />
        <Field
          label="Year"
          value={academicData.twelfth.year}
          isEditing={isEditing}
          onChange={(v) => handleChange("twelfth", "year", v)}
        />
        <Field
          label="Percentage"
          value={academicData.twelfth.percentage}
          isEditing={isEditing}
          onChange={(v) => handleChange("twelfth", "percentage", v)}
        />
        <Field
          label="Stream"
          value={academicData.twelfth.stream}
          isEditing={isEditing}
          onChange={(v) => handleChange("twelfth", "stream", v)}
        />
        <Field
          label="School"
          value={academicData.twelfth.school}
          isEditing={isEditing}
          onChange={(v) => handleChange("twelfth", "school", v)}
        />
      </Section>

      <Section title="Graduation">
        <Field
          label="Course"
          value={academicData.graduation.course}
          isEditing={isEditing}
          onChange={(v) => handleChange("graduation", "course", v)}
        />
        <Field
          label="Branch"
          value={academicData.graduation.branch}
          isEditing={isEditing}
          onChange={(v) => handleChange("graduation", "branch", v)}
        />
        <Field
          label="College"
          value={academicData.graduation.college}
          isEditing={isEditing}
          onChange={(v) => handleChange("graduation", "college", v)}
        />
        <Field
          label="CGPA"
          value={academicData.graduation.cgpa}
          isEditing={isEditing}
          onChange={(v) => handleChange("graduation", "cgpa", v)}
        />
      </Section>

      {/* Semester Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b font-semibold">
          Semester-wise Results
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left">Semester</th>
              <th className="px-6 py-3 text-left">SGPA</th>
              <th className="px-6 py-3 text-left">Backlogs</th>
            </tr>
          </thead>
          <tbody>
            {academicData.semesters.map((s, i) => (
              <tr key={s.sem} className="border-t">
                <td className="px-6 py-3">Semester {s.sem}</td>
                <td className="px-6 py-3">
                  {isEditing ? (
                    <input
                      value={s.sgpa}
                      onChange={(e) =>
                        handleChange("semesters", "sgpa", e.target.value, i)
                      }
                      className="border rounded px-2 py-1 w-20"
                    />
                  ) : (
                    s.sgpa
                  )}
                </td>
                <td className="px-6 py-3">{s.backlogs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Helpers ---------- */

function SummaryCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
      <div className="w-12 h-12 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <BookOpen size={18} /> {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Field({ label, value, isEditing, onChange }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      {isEditing ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        />
      ) : (
        <p className="font-medium">{value}</p>
      )}
    </div>
  );
}
