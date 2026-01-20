function ApplicantsList() {
  return (
    <div className="bg-white rounded-xl  w-full shadow-sm overflow-hidden">
      <TableHeader title="Applicants" />

      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left">Name</th>
            <th className="px-6 py-3 text-left">Branch</th>
            <th className="px-6 py-3 text-left">CGPA</th>
            <th className="px-6 py-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map((s) => (
            <tr key={s.id} className="border-t hover:bg-slate-50">
              <td className="px-6 py-3">{s.name}</td>
              <td className="px-6 py-3">{s.branch}</td>
              <td className="px-6 py-3 font-semibold">{s.cgpa}</td>
              <td className="px-6 py-3">
                <span className="px-3 py-1 rounded-full text-xs bg-indigo-100 text-indigo-700">
                  {s.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
const applicants = [
  { id: 1, name: "Rahul Sharma", branch: "CSE", cgpa: 8.4, status: "Applied" },
  {
    id: 2,
    name: "Priya Patel",
    branch: "IT",
    cgpa: 8.9,
    status: "Shortlisted",
  },
];
function TableHeader({ title }) {
  return (
    <div className="h-14 px-6 flex items-center border-b">
      <h3 className="font-semibold">{title}</h3>
    </div>
  );
}

export default ApplicantsList;
