import {
  MapPin,
  IndianRupee,
  CalendarDays,
  FileText,
  Users,
  Building2,
} from "lucide-react";

export default function PostCompanyPage() {
  return (
    <div className="h-screen w-screen flex bg-slate-100 overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">
              Post New Company
            </h2>
            <p className="text-sm text-slate-500">
              Publish upcoming placement drive details for students
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Name */}
              <InputField
                label="Company Name"
                placeholder="e.g. Infosys"
                icon={<Building2 />}
              />

              {/* Location */}
              <InputField
                label="Job Location"
                placeholder="e.g. Bangalore, Pune"
                icon={<MapPin />}
              />

              {/* Package */}
              <InputField
                label="Package (CTC)"
                placeholder="e.g. 7 LPA"
                icon={<IndianRupee />}
              />

              {/* Bond */}
              <InputField
                label="Bond Details"
                placeholder="e.g. 2 Years / No Bond"
                icon={<FileText />}
              />

              {/* Drive Date */}
              <InputField
                label="Drive Date"
                type="date"
                icon={<CalendarDays />}
              />

              {/* Eligible Students */}
              <InputField
                label="Eligible Branches"
                placeholder="CSE, IT, ECE"
                icon={<Users />}
              />

              {/* Eligibility Criteria */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-slate-700">
                  Eligibility Criteria
                </label>
                <textarea
                  rows="4"
                  placeholder="CGPA, backlog criteria, skills required..."
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Job Description */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-slate-700">
                  Job Description
                </label>
                <textarea
                  rows="5"
                  placeholder="Role, responsibilities, selection process..."
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Buttons */}
              <div className="md:col-span-2 flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  className="h-11 px-6 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-11 px-6 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
                >
                  Post Company
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

function InputField({ label, placeholder, icon, type = "text" }) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="mt-2 relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
        <input
          type={type}
          placeholder={placeholder}
          className="w-full h-11 rounded-xl border border-slate-300 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
}
