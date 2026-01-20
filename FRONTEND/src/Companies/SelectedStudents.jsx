function SelectedStudents() {
  return (
    <div className="bg-white w-full rounded-xl shadow-sm overflow-hidden">
      <TableHeader title="Selected Students" />

      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left">Student</th>
            <th className="px-6 py-3 text-left">Branch</th>
            <th className="px-6 py-3 text-left">Offer Status</th>
          </tr>
        </thead>
        <tbody>
          {selected.map((s) => (
            <tr key={s.id} className="border-t">
              <td className="px-6 py-3">{s.name}</td>
              <td className="px-6 py-3">{s.branch}</td>
              <td className="px-6 py-3 text-green-600 font-semibold">
                {s.offer}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function TableHeader({ title }) {
  return (
    <div className="h-14 px-6 flex items-center border-b">
      <h3 className="font-semibold">{title}</h3>
    </div>
  );
}
const selected = [
  { id: 1, name: "Amit Verma", branch: "CSE", offer: "Offer Released" },
];
export default SelectedStudents;
