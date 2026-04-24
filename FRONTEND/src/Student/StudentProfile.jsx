import { useState, useEffect } from "react";
import axios from "axios";
import { Camera } from "lucide-react";

export default function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isNewProfile, setIsNewProfile] = useState(false);

  const [profileData, setProfileData] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    erno: "",
    gender: "M",
    sem: 1,
    branch: "CE",
    cgpa: "",
    email: "",
    mobile: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  /* ===========================
     FETCH PROFILE
  =========================== */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/student/profile",
          {
            withCredentials: true,
          },
        );

        const student = res.data.student; // ✅ FIX

        if (student) {
          setProfileData(student); // ✅ FIX
          setFormData(student); // ✅ FIX
          setPreview(student.profilepic); // ✅ FIX
          setIsNewProfile(false);
        }
      } catch (error) {
        if (error.response?.status === 404) {
          setIsNewProfile(true);
        } else {
          console.log(error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /* ===========================
     HANDLE INPUT CHANGE
  =========================== */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ===========================
     HANDLE IMAGE CHANGE
  =========================== */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  /* ===========================
     SAVE PROFILE (CREATE/UPDATE)
  =========================== */
  const handleSave = async () => {
    try {
      const form = new FormData();

      Object.keys(formData).forEach((key) => {
        form.append(key, formData[key]);
      });

      if (image) {
        form.append("profilepic", image);
      }

      let res;

      if (isNewProfile) {
        // CREATE
        res = await axios.post(
          "http://localhost:8000/api/student/profile",
          form,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
      } else {
        // UPDATE
        res = await axios.put(
          "http://localhost:8000/api/student/profile",
          form,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
      }

      console.log("DATA:", res.data);
      const data = res.data.student;

      setProfileData(data);
      setFormData(data);
      setPreview(data.profilepic);
      setIsEditing(false);
      setIsNewProfile(false);
      setImage(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setFormData(profileData);
    setPreview(profileData.profilepic);
    setIsEditing(false);
  };

  if (loading) {
    return <div className="p-10 text-lg">Loading profile...</div>;
  }

  return (
    <div className="w-full mx-auto space-y-8 p-10 overflow-y-scroll">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Student Profile</h2>
          <p className="text-lg text-slate-500">
            Complete your profile details for placement drives
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold"
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
        <div className="relative w-40 h-40 rounded-full border border-black overflow-hidden flex items-center justify-center">
          {preview ? (
            <img
              src={preview}
              alt="profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-500 font-semibold text-lg">
              Profile
            </div>
          )}

          {isEditing && (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="upload"
              />
              <label
                htmlFor="upload"
                className="absolute bottom-2 right-2 bg-indigo-600 text-white p-3 rounded-full cursor-pointer"
              >
                <Camera size={20} />
              </label>
            </>
          )}
        </div>

        <div>
          <h3 className="text-2xl font-semibold">
            {profileData.name || "No Name"}
          </h3>
          <p className="text-lg text-slate-500">
            {profileData.email || "No Email"}
          </p>
        </div>
      </div>

      {/* Personal Details */}
      <div className="bg-white p-10 rounded-2xl shadow">
        <h3 className="text-2xl font-semibold mb-6">Personal Details</h3>

        {!isEditing ? (
          <div className="grid md:grid-cols-3 gap-8 text-lg">
            <Info label="Full Name" value={profileData.name} />
            <Info label="Enrollment No" value={profileData.erno} />
            <Info label="Gender" value={profileData.gender} />
            <Info label="Semester" value={profileData.sem} />
            <Info label="Department" value={profileData.branch} />
            <Info label="CGPA" value={profileData.cgpa} />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <Input
              label="Enrollment No"
              name="erno"
              value={formData.erno}
              onChange={handleChange}
            />

            <Select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              options={["M", "F", "O"]}
            />
            <Select
              label="Semester"
              name="sem"
              value={formData.sem}
              onChange={handleChange}
              options={[1, 2, 3, 4, 5, 6, 7, 8]}
            />

            <Input
              label="CGPA"
              name="cgpa"
              value={formData.cgpa}
              onChange={handleChange}
            />

            <Select
              label="Department"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              options={["CE", "IT"]}
            />
          </div>
        )}
      </div>

      {/* Contact */}
      <div className="bg-white p-10 rounded-2xl shadow">
        <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>

        {!isEditing ? (
          <div className="grid md:grid-cols-3 gap-8 text-lg">
            <Info label="Email" value={profileData.email} />
            <Info label="Mobile" value={profileData.mobile} />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
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

      {/* Save */}
      {isEditing && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-indigo-600 text-white px-10 py-4 rounded-xl text-lg font-semibold"
          >
            Save Profile
          </button>
        </div>
      )}
    </div>
  );
}

/* INPUT */
function Input({ label, name, value, onChange }) {
  return (
    <div>
      <label className="text-base font-medium">{label}</label>
      <input
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full mt-2 p-4 border rounded-xl"
      />
    </div>
  );
}

/* SELECT */
function Select({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="text-base font-medium">{label}</label>
      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full mt-2 p-4 border rounded-xl"
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

/* VIEW */
function Info({ label, value }) {
  return (
    <div>
      <p className="text-slate-500 text-sm">{label}</p>
      <p className="font-semibold text-lg">{value || "-"}</p>
    </div>
  );
}
