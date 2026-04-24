import { useState, useEffect } from "react";
import axios from "axios";
import { Camera } from "lucide-react";

export default function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profileData, setProfileData] = useState({});
  const [formData, setFormData] = useState({});

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  // ✅ FETCH ADMIN DATA
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/admin/profile", {
          withCredentials: true,
        });

        const admin = res.data.admin;

        if (!admin) return;

        const formatted = {
          fullName: admin.name || "",
          gender:
            admin.gender === "M"
              ? "Male"
              : admin.gender === "F"
                ? "Female"
                : "Other",
          department:
            admin.branch === "CE"
              ? "Computer Engineering"
              : "Information Technology",
          email: admin.email || "",
          mobile: admin.mobile || "",
          profilepic: admin.profilepic || "",
        };

        setProfileData(formatted);
        setFormData(formatted);
        setPreview(admin.profilepic || "");
      } catch (err) {
        console.log("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, []);

  // ✅ HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ✅ HANDLE IMAGE CHANGE
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // ✅ SAVE PROFILE
  const handleSave = async () => {
    try {
      const form = new FormData();

      form.append("name", formData.fullName);
      form.append(
        "gender",
        formData.gender === "Male"
          ? "M"
          : formData.gender === "Female"
            ? "F"
            : "O",
      );
      form.append(
        "branch",
        formData.department === "Computer Engineering" ? "CE" : "IT",
      );
      form.append("email", formData.email);
      form.append("mobile", formData.mobile);

      if (image) form.append("profilepic", image);

      const res = await axios.post(
        "http://localhost:8000/api/admin/profile",
        form,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      const updated = res.data.admin;

      const formatted = {
        fullName: updated.name,
        gender:
          updated.gender === "M"
            ? "Male"
            : updated.gender === "F"
              ? "Female"
              : "Other",
        department:
          updated.branch === "CE"
            ? "Computer Engineering"
            : "Information Technology",
        email: updated.email,
        mobile: updated.mobile,
        profilepic: updated.profilepic,
      };

      setProfileData(formatted);
      setFormData(formatted);
      setPreview(updated.profilepic);
      setImage(null);
      setIsEditing(false);
    } catch (err) {
      console.log("Save Error:", err);
    }
  };

  // ✅ CANCEL EDIT
  const handleCancel = () => {
    setFormData(profileData);
    setPreview(profileData.profilepic);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-slate-500 text-lg">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-slate-100 to-slate-200 p-6">
      <div className="w-full mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Admin Profile</h2>
            <p className="text-slate-500">Manage and update your details</p>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg shadow-md"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleCancel}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2.5 rounded-lg shadow-md"
            >
              Cancel
            </button>
          )}
        </div>

        {/* PROFILE CARD */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-6">
          <div className="relative group">
            <img
              src={
                preview ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-indigo-100"
            />

            {isEditing && (
              <label className="absolute bottom-1 right-1 bg-indigo-600 text-white p-2 rounded-full cursor-pointer shadow hover:bg-indigo-700">
                <Camera size={16} />
                <input type="file" hidden onChange={handleImageChange} />
              </label>
            )}
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-800">
              {profileData.fullName || "Your Name"}
            </h3>
            <p className="text-slate-500 text-sm">{profileData.email}</p>
          </div>
        </div>

        {/* FORM CARD */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-lg font-semibold text-slate-700 mb-6">
            Personal Information
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              disabled={!isEditing}
            />

            <Select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              options={["Male", "Female", "Other"]}
              disabled={!isEditing}
            />

            <Select
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              options={["Computer Engineering", "Information Technology"]}
              disabled={!isEditing}
            />

            <Input
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
            />

            <Input
              label="Mobile Number"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          {isEditing && (
            <div className="flex justify-end mt-8">
              <button
                onClick={handleSave}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl shadow-lg"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* INPUT */
function Input({ label, name, value, onChange, disabled }) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-600">{label}</label>
      <input
        name={name}
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        className="w-full mt-2 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100"
      />
    </div>
  );
}

/* SELECT */
function Select({ label, name, value, onChange, options, disabled }) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-600">{label}</label>
      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        className="w-full mt-2 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100"
      >
        <option value="">Select</option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
