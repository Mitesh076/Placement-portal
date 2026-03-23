import { useState } from "react";
import {
  Building2,
  Mail,
  Globe,
  MapPin,
  Briefcase,
  Calendar,
  Layers,
  Save,
  Edit3,
  Camera,
  Phone,
} from "lucide-react";

export default function CompanyProfile() {
  const [editMode, setEditMode] = useState(false);

  const [company, setCompany] = useState({
    name: "Google",
    industry: "Technology",
    website: "https://www.google.com",
    location: "Bangalore, India",
    hrName: "John Doe",
    hrEmail: "hr@google.com",
    mobile: "9876543210",
    description:
      "Google is a global technology company focusing on search, cloud computing, and AI-driven solutions.",

    jobRole: "Software Engineer",
    jobType: "Full Time",
    package: "12 LPA",
    minCGPA: "7.0",
    eligibleBranches: "CSE, IT",
    bond: "No Bond",
    driveDate: "2026-03-10",
    lastDate: "2026-03-05",

    rounds: [
      "Online Coding Test",
      "Technical Interview",
      "Managerial Interview",
      "HR Interview",
    ],
  });

  const handleChange = (field, value) => {
    setCompany({ ...company, [field]: value });
  };

  return (
    <div className="space-y-6 p-6 w-full overflow-y-scroll">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold">Company Profile</h2>
          <p className="text-sm text-slate-500">
            Manage your company and placement drive details
          </p>
        </div>

        <button
          onClick={() => setEditMode(!editMode)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
        >
          {editMode ? <Save size={16} /> : <Edit3 size={16} />}
          {editMode ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-6">
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-lg">
            Photo
          </div>
          <button className="absolute bottom-1 right-1 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700">
            <Camera size={20} />
          </button>
        </div>

        <div>
          <h3 className="font-semibold text-2xl ">
            Upload Profile Picture / Company Logo
          </h3>
          <p className="text-lg text-slate-500">JPG, PNG or JPEG (max 2MB)</p>
        </div>
      </div>

      {/* Company Info */}
      <Section title="Company Information" icon={<Building2 />}>
        <Input
          label="Company Name"
          value={company.name}
          edit={editMode}
          onChange={(v) => handleChange("name", v)}
        />
        <Input
          label="Industry"
          value={company.industry}
          edit={editMode}
          onChange={(v) => handleChange("industry", v)}
        />
        <Input
          label="Website"
          icon={<Globe size={14} />}
          value={company.website}
          edit={editMode}
          onChange={(v) => handleChange("website", v)}
        />
        <Input
          label="Location"
          icon={<MapPin size={14} />}
          value={company.location}
          edit={editMode}
          onChange={(v) => handleChange("location", v)}
        />
        <Input
          label="HR Name"
          value={company.hrName}
          edit={editMode}
          onChange={(v) => handleChange("hrName", v)}
        />
        <Input
          label="HR Email"
          icon={<Mail size={14} />}
          value={company.hrEmail}
          edit={editMode}
          onChange={(v) => handleChange("hrEmail", v)}
        />
        <Input
          label="Contact"
          icon={<Phone size={14} />}
          value={company.mobile}
          edit={editMode}
          onChange={(v) => handleChange("mobile", v)}
        />
        <Textarea
          label="Company Description"
          value={company.description}
          edit={editMode}
          onChange={(v) => handleChange("description", v)}
        />
      </Section>

      {/* Placement Details */}
      <Section title="Placement Drive Details" icon={<Briefcase />}>
        <Input
          label="Job Role"
          value={company.jobRole}
          edit={editMode}
          onChange={(v) => handleChange("jobRole", v)}
        />
        <Input
          label="Job Type"
          value={company.jobType}
          edit={editMode}
          onChange={(v) => handleChange("jobType", v)}
        />
        <Input
          label="Package (CTC)"
          value={company.package}
          edit={editMode}
          onChange={(v) => handleChange("package", v)}
        />
        <Input
          label="Minimum CGPA"
          value={company.minCGPA}
          edit={editMode}
          onChange={(v) => handleChange("minCGPA", v)}
        />
        <Input
          label="Eligible Branches"
          value={company.eligibleBranches}
          edit={editMode}
          onChange={(v) => handleChange("eligibleBranches", v)}
        />
        <Input
          label="Bond"
          value={company.bond}
          edit={editMode}
          onChange={(v) => handleChange("bond", v)}
        />
        <Input
          label="Drive Date"
          icon={<Calendar size={14} />}
          type="date"
          value={company.driveDate}
          edit={editMode}
          onChange={(v) => handleChange("driveDate", v)}
        />
        <Input
          label="Last Date to Apply"
          type="date"
          value={company.lastDate}
          edit={editMode}
          onChange={(v) => handleChange("lastDate", v)}
        />
      </Section>

      {/* ---------------- INTERVIEW ROUNDS ---------------- */}
      <Section title="Interview Process" icon={<Layers />}>
        <ul className="space-y-2">
          {company.rounds.map((round, index) => (
            <li key={index} className="flex items-center gap-3 text-xl">
              <span className="w-10 h-10 flex items-center  justify-center rounded-full bg-indigo-600 text-white text-2xl">
                {index + 1}
              </span>

              {/* Editable Input */}
              {editMode ? (
                <input
                  className="border rounded-md px-2 py-1 flex-1"
                  value={round}
                  onChange={(e) => {
                    const updatedRounds = [...company.rounds];
                    updatedRounds[index] = e.target.value;
                    handleChange("rounds", updatedRounds);
                  }}
                />
              ) : (
                <span className="flex-1">{round}</span>
              )}

              {/* Delete button (visible in edit mode) */}
              {editMode && (
                <button
                  onClick={() => {
                    const updatedRounds = company.rounds.filter(
                      (_, i) => i !== index,
                    );
                    handleChange("rounds", updatedRounds);
                  }}
                  className="mt-2 px-3 py-1 bg-red-600 text-2xl hover:bg-red-800  text-white rounded-lg"
                >
                  Delete
                </button>
              )}
            </li>
          ))}

          {/* Add new round button */}
          {editMode && (
            <li>
              <button
                onClick={() =>
                  handleChange("rounds", [...company.rounds, "New Round"])
                }
                className="mt-2 px-3 py-1 bg-indigo-600 text-white text-2xl rounded-lg hover:bg-indigo-700"
              >
                + Add Round
              </button>
            </li>
          )}
        </ul>
      </Section>
    </div>
  );
}

/* ---------- REUSABLE COMPONENTS ---------- */

function Section({ title, icon, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
      <h3 className="font-bold text-2xl flex items-center gap-2">
        {icon} {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Input({ label, value, edit, onChange, icon, type = "text" }) {
  return (
    <div>
      <p className="text-xl text-slate-500  mb-1 flex items-center gap-1">
        {icon} {label}
      </p>
      {edit ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />
      ) : (
        <p className="text-xl text-black ">{value}</p>
      )}
    </div>
  );
}

function Textarea({ label, value, edit, onChange }) {
  return (
    <div className="md:col-span-2">
      <p className="text-xl text-slate-500  mb-1">{label}</p>
      {edit ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border rounded-lg  px-3 py-2"
        />
      ) : (
        <p className="text-xl text-black ">{value}</p>
      )}
    </div>
  );
}
