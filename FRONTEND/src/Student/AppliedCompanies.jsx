export default function AppliedCompanies() {
  return (
    <div className="bg-white w-screen rounded-xl shadow-sm overflow-hidden">
      <div className="h-14 px-6 flex items-center border-b">
        <h3 className="font-semibold">Applied Companies</h3>
      </div>

      <table className="w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left">Company</th>
            <th className="px-6 py-3 text-left">Role</th>
            <th className="px-6 py-3 text-left">Package</th>
            <th className="px-6 py-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="px-6 py-3">TCS</td>
            <td className="px-6 py-3">Software Engineer</td>
            <td className="px-6 py-3">7 LPA</td>
            <td className="px-6 py-3 text-yellow-600 font-semibold">
              Interview Scheduled
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
