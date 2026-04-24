import { useState, useEffect } from "react";
import axios from "axios";
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
  const [loading, setLoading] = useState(true);

  const [cgpa, setCgpa] = useState(0);
  const [currentSem, setCurrentSem] = useState(null);

  const [academicData, setAcademicData] = useState({
    tenth: {},
    twelfth: {},
    semesters: [],
  });

  /* =========================
     FETCH DATA
  ========================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/student/academics",
          { withCredentials: true },
        );

        const profile = await axios.get(
          "http://localhost:8000/api/student/profile",
          { withCredentials: true },
        );

        const semData = res.data.sem;

        // 🔥 Always create semesters
        const semesters = [
          { sem: 1, sgpa: semData?.sem1 || "", backlogs: semData?.sem1b || 0 },
          { sem: 2, sgpa: semData?.sem2 || "", backlogs: semData?.sem2b || 0 },
          { sem: 3, sgpa: semData?.sem3 || "", backlogs: semData?.sem3b || 0 },
          { sem: 4, sgpa: semData?.sem4 || "", backlogs: semData?.sem4b || 0 },
          { sem: 5, sgpa: semData?.sem5 || "", backlogs: semData?.sem5b || 0 },
          { sem: 6, sgpa: semData?.sem6 || "", backlogs: semData?.sem6b || 0 },
          { sem: 7, sgpa: semData?.sem7 || "", backlogs: semData?.sem7b || 0 },
          { sem: 8, sgpa: semData?.sem8 || "", backlogs: semData?.sem8b || 0 },
        ];

        setAcademicData({
          tenth: res.data.tenth || {},
          twelfth: res.data.twelth || {},
          semesters,
        });

        setCgpa(profile.data.student?.cgpa || 0);
        setCurrentSem(Number(profile.data.student?.sem) || null);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* =========================
     HANDLE CHANGE
  ========================= */
  const handleChange = (section, field, value, index = null) => {
    setAcademicData((prev) => {
      const updated = { ...prev };

      if (section === "semesters") {
        updated.semesters = [...updated.semesters];
        updated.semesters[index] = {
          ...updated.semesters[index],
          [field]: value,
        };
      } else {
        updated[section] = {
          ...updated[section],
          [field]: value,
        };
      }

      return updated;
    });
  };

  /* =========================
     SAVE DATA
  ========================= */
  const handleSave = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/student/tenth",
        academicData.tenth,
        { withCredentials: true },
      );

      await axios.post(
        "http://localhost:8000/api/student/twelth",
        academicData.twelfth,
        { withCredentials: true },
      );

      const semPayload = {};
      academicData.semesters.forEach((s) => {
        semPayload[`sem${s.sem}`] = s.sgpa;
        semPayload[`sem${s.sem}b`] = s.backlogs;
      });

      await axios.post("http://localhost:8000/api/student/sem", semPayload, {
        withCredentials: true,
      });

      setIsEditing(false);
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="space-y-6 w-full p-6 overflow-y-scroll">
      {/* HEADER */}
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
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            <Pencil size={16} /> Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              <Save size={16} /> Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg"
            >
              <X size={16} /> Cancel
            </button>
          </div>
        )}
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard
          label="Current CGPA"
          value={cgpa}
          icon={<GraduationCap />}
        />
        <SummaryCard
          label="Total Backlogs"
          value={academicData.semesters.reduce(
            (sum, s) => sum + Number(s.backlogs || 0),
            0,
          )}
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

      {/* 10th */}
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

      {/* 12th */}
      <Section title="12th Standard">
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

      {/* SEM TABLE */}
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
              <tr
                key={i}
                className={`border-t ${
                  currentSem === s.sem
                    ? "bg-indigo-100 font-semibold"
                    : "hover:bg-slate-50"
                }`}
              >
                <td className="px-6 py-3">
                  Semester {s.sem}
                  {currentSem === s.sem && (
                    <span className="ml-2 text-xs bg-indigo-600 text-white px-2 py-1 rounded">
                      Current
                    </span>
                  )}
                </td>

                <td className="px-6 py-3">
                  {isEditing ? (
                    <input
                      value={s.sgpa || ""}
                      onChange={(e) =>
                        handleChange("semesters", "sgpa", e.target.value, i)
                      }
                      className="border rounded px-2 py-1 w-20"
                    />
                  ) : (
                    s.sgpa
                  )}
                </td>

                <td className="px-6 py-3">
                  {isEditing ? (
                    <input
                      value={s.backlogs || ""}
                      onChange={(e) =>
                        handleChange("semesters", "backlogs", e.target.value, i)
                      }
                      className="border rounded px-2 py-1 w-20"
                    />
                  ) : (
                    s.backlogs
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* COMPONENTS */
function SummaryCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
      <div className="w-12 h-12 bg-indigo-100 flex items-center justify-center rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-lg font-semibold">{value || "-"}</p>
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
      <div className="grid md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Field({ label, value, isEditing, onChange }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      {isEditing ? (
        <input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        />
      ) : (
        <p className="font-medium">{value || "-"}</p>
      )}
    </div>
  );
}
