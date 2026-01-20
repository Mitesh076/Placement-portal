export default function StudentDashboard() {
  return (
    <div className=" w-screen space-y-6 m-5">
      <div>
        <h2 className="text-xl font-semibold">Welcome, Student</h2>
        <p className="text-sm text-slate-500">
          Track your placement journey from one place
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="Applied Companies" value="5" />
        <Card title="Interview Calls" value="2" />
        <Card title="Offers Received" value="1" />
        <Card title="Placement Status" value="Placed" highlight />
      </div>
    </div>
  );
}

function Card({ title, value, highlight }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <p className="text-xs text-slate-500">{title}</p>
      <p className={`text-lg font-semibold ${highlight && "text-green-600"}`}>
        {value}
      </p>
    </div>
  );
}
