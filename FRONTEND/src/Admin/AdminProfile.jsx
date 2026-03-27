import { useState, useEffect } from "react";
import axios from "axios";
import { Camera } from "lucide-react";

export default function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profileData, setProfileData] = useState({});
  const [formData, setFormData] = useState({});

  // ✅ FETCH ADMIN DATA
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/admin/profile", {
          withCredentials: true,
        });

        const admin = res.data.admin;

        const formattedData = {
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

        setProfileData(formattedData);
        setFormData(formattedData);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAdmin();
  }, []);

  // ✅ HANDLE CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ IMAGE UPLOAD
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const data = new FormData();
    data.append("profilepic", file);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/upload/admin-profile",
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      // 🔥 assuming backend returns URL
      const imageUrl = res.data.url;

      setFormData({
        ...formData,
        profilepic: imageUrl,
      });
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ SAVE PROFILE
  const handleSave = async () => {
    try {
      const payload = {
        name: formData.fullName,
        gender:
          formData.gender === "Male"
            ? "M"
            : formData.gender === "Female"
              ? "F"
              : "O",
        branch: formData.department === "Computer Engineering" ? "CE" : "IT",
        email: formData.email,
        mobile: formData.mobile,
        profilepic: formData.profilepic,
      };

      await axios.put("http://localhost:8000/api/admin/profile", payload, {
        withCredentials: true,
      });

      setProfileData(formData);
      setIsEditing(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancel = () => {
    setFormData(profileData);
    setIsEditing(false);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="w-full mx-auto space-y-8 p-10 overflow-y-scroll">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Admin Profile</h2>
          <p className="text-lg text-slate-500">
            Complete your profile details
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg"
          >
            Edit Profile
          </button>
        ) : (
          <button
            onClick={handleCancel}
            className="bg-gray-500 text-white px-8 py-3 rounded-lg"
          >
            Cancel
          </button>
        )}
      </div>

      {/* PROFILE CARD */}
      <div className="bg-white p-10 rounded-2xl shadow flex items-center gap-10">
        <div className="relative">
          <img
            src={
              (isEditing ? formData.profilepic : profileData.profilepic) ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            className="w-40 h-40 rounded-full object-cover"
          />

          {isEditing && (
            <label className="absolute bottom-2 right-2 bg-indigo-600 text-white p-3 rounded-full cursor-pointer">
              <Camera size={20} />
              <input type="file" hidden onChange={handleImageUpload} />
            </label>
          )}
        </div>

        <div>
          <h3 className="text-2xl font-semibold">
            {isEditing ? formData.fullName : profileData.fullName}
          </h3>
          <p className="text-lg text-slate-500">
            {isEditing ? formData.email : profileData.email}
          </p>
        </div>
      </div>

      {/* PERSONAL DETAILS */}
      <div className="bg-white p-10 rounded-2xl shadow">
        <h3 className="text-2xl font-semibold mb-6">Personal Details</h3>

        {!isEditing ? (
          <div className="grid md:grid-cols-3 gap-8">
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
              options={["Computer Engineering", "Information Technology"]}
            />
          </div>
        )}
      </div>

      {/* CONTACT */}
      <div className="bg-white p-10 rounded-2xl shadow">
        <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>

        {!isEditing ? (
          <div className="grid md:grid-cols-2 gap-8">
            <Info label="Email" value={profileData.email} />
            <Info label="Mobile" value={profileData.mobile} />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <Input
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />

            <Input
              label="Mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
            />
          </div>
        )}
      </div>

      {/* SAVE */}
      {isEditing && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-indigo-600 text-white px-10 py-4 rounded-xl"
          >
            Save Profile
          </button>
        </div>
      )}
    </div>
  );
}

/* COMPONENTS */

function Input({ label, name, value, onChange }) {
  return (
    <div>
      <label>{label}</label>
      <input
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full mt-2 p-3 border rounded"
      />
    </div>
  );
}

function Select({ label, name, value, onChange, options }) {
  return (
    <div>
      <label>{label}</label>
      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full mt-2 p-3 border rounded"
      >
        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-gray-500">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
