import { Camera } from "lucide-react";

export default function AdminProfile() {
  return (
    <div className="space-y-6 w-full m-6 overflow-y-scroll ">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">Admin Profile</h2>
        <p className="text-sm text-slate-500">
          Complete your profile details for placement Drives
        </p>
      </div>

      {/* Profile Picture */}
      <div className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-6">
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-sm">
            Profile Photo
          </div>
          <button className="absolute bottom-1 right-1 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700">
            <Camera size={16} />
          </button>
        </div>

        <div>
          <h3 className="font-semibold">Upload Profile Picture</h3>
          <p className="text-sm text-slate-500">JPG, PNG or JPEG (max 2MB)</p>
        </div>
      </div>

      {/* Personal Details */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="font-semibold mb-4">Personal Details</h3>

        <div className="grid md:grid-cols-3 gap-4">
          <Input label="Full Name" placeholder="Enter full name" />
          <Input label="Date of Birth" type="date" />
          <Input label="Gender" placeholder="Male / Female / Other" />
          <Input label="Branch" placeholder="Computer Engineering" />
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="font-semibold mb-4">Contact Information</h3>

        <div className="grid md:grid-cols-3 gap-4">
          <Input label="Email Address" placeholder="name@college.edu" />
          <Input label="Mobile Number" placeholder="+91 98765 43210" />
          <Input label="Alternate Contact" placeholder="Optional" />
        </div>
      </div>

      {/* Address Details */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="font-semibold mb-4">Address Details</h3>

        <div className="grid md:grid-cols-3 gap-4">
          <Input label="Address Line 1" placeholder="Street / Area" />
          <Input label="Address Line 2" placeholder="Landmark" />
          <Input label="City" placeholder="Ahmedabad" />
          <Input label="State" placeholder="Gujarat" />
          <Input label="Pincode" placeholder="380001" />
          <Input label="Country" placeholder="India" />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700">
          Save Profile
        </button>
      </div>
    </div>
  );
}

/* ---------- REUSABLE INPUT ---------- */
function Input({ label, placeholder, type = "text" }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full mt-1 p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
