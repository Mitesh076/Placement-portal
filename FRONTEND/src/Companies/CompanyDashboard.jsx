import { Users, Layers, CheckCircle, Briefcase } from "lucide-react";
function CompanyDashboard() {
  return (
    <div className="space-y-6 w-full m-6">
      <h2 className="text-xl font-semibold">Company Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={<Users />} label="Total Applicants" value="120" />
        <StatCard icon={<Layers />} label="Shortlisted" value="45" />
        <StatCard icon={<CheckCircle />} label="Selected" value="18" />
        <StatCard icon={<Briefcase />} label="Interview Rounds" value="4" />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm flex gap-4 items-center">
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

export default CompanyDashboard;
