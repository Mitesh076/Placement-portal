import { useState } from "react";
import { Camera } from "lucide-react";

export default function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: "Admin User",

    gender: "Male",
    department: "Computer Engineering",
    email: "admin@college.edu",
    mobile: "+91 9876543210",
  });

  const [formData, setFormData] = useState(profileData);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setProfileData(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(profileData);
    setIsEditing(false);
  };

  return (
    <div className="w-full  mx-auto space-y-8 p-10 overflow-y-scroll">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Admin Profile</h2>
          <p className="text-lg text-slate-500">
            Complete your profile details for placement drives
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700"
          >
            Edit Profile
          </button>
        ) : (
          <button
            onClick={handleCancel}
            className="bg-gray-500 text-white px-8 py-3 rounded-lg text-lg font-semibold"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-white p-10 rounded-2xl shadow flex items-center gap-10">
        <div className="relative">
          <div className="w-40 h-40 rounded-full bg-slate-200 flex items-center justify-center text-lg text-slate-500">
            Photo
          </div>

          {isEditing && (
            <button className="absolute bottom-2 right-2 bg-indigo-600 text-white p-3 rounded-full">
              <Camera size={20} />
            </button>
          )}
        </div>

        <div>
          <h3 className="text-2xl font-semibold">{profileData.fullName}</h3>
          <p className="text-lg text-slate-500">{profileData.email}</p>
        </div>
      </div>

      {/* Personal Details */}
      <div className="bg-white p-10 rounded-2xl shadow">
        <h3 className="text-2xl font-semibold mb-6">Personal Details</h3>

        {!isEditing ? (
          <div className="grid md:grid-cols-3 gap-8 text-lg">
            <Info label="Full Name" value={profileData.fullName} />
            <Info label="Gender" value={profileData.gender} />
            <Info label="Department" value={profileData.department} />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />

            <Select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              options={["Male", "Female", "Other"]}
            />

            <Select
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              options={[
                "Computer Engineering",
                "Information Technology",
                "Mechanical Engineering",
                "Civil Engineering",
                "Electrical Engineering",
                "Electronics & Communication",
                "Artificial Intelligence",
                "Data Science",
              ]}
            />
          </div>
        )}
      </div>

      {/* Contact Information */}
      <div className="bg-white p-10 rounded-2xl shadow">
        <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>

        {!isEditing ? (
          <div className="grid md:grid-cols-3 gap-8 text-lg">
            <Info label="Email Address" value={profileData.email} />
            <Info label="Mobile Number" value={profileData.mobile} />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <Input
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />

            <Input
              label="Mobile Number"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
            />
          </div>
        )}
      </div>

      {/* Save Button */}
      {isEditing && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-indigo-600 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700"
          >
            Save Profile
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- INPUT COMPONENT ---------- */

function Input({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="text-base font-medium">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full mt-2 p-4 text-lg border rounded-xl focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}

/* ---------- SELECT COMPONENT ---------- */

function Select({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="text-base font-medium">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full mt-2 p-4 text-lg border rounded-xl focus:ring-2 focus:ring-indigo-500"
      >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ---------- VIEW COMPONENT ---------- */

function Info({ label, value }) {
  return (
    <div>
      <p className="text-slate-500 text-sm">{label}</p>
      <p className="font-semibold text-lg">{value}</p>
    </div>
  );
}
