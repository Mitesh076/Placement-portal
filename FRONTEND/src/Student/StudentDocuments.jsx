import { FileText, Upload, CheckCircle, Clock } from "lucide-react";

export default function StudentDocuments() {
  return (
    <div className="space-y-6 w-full m-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">My Documents</h2>
        <p className="text-sm text-slate-500">
          Upload and manage documents required for the placement process
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="font-semibold mb-4">Add New Document</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Document Type</label>
            <select className="w-full mt-1 p-2.5 border rounded-lg">
              <option>Select document</option>
              <option>Resume</option>
              <option>Aadhar Card</option>
              <option>Marksheet</option>
              <option>Offer Letter</option>
              <option>Internship Certificate</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Document Name</label>
            <input
              type="text"
              placeholder="Eg: Resume 2026"
              className="w-full mt-1 p-2.5 border rounded-lg"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium">Upload File</label>
          <div className="mt-1 flex items-center gap-3 border border-dashed rounded-lg p-4">
            <Upload className="text-indigo-600" />
            <span className="text-sm text-slate-500">
              Choose file (PDF / DOC / JPG)
            </span>
          </div>
        </div>

        <button className="mt-6 bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700">
          Save Document
        </button>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="h-14 px-6 flex items-center border-b">
          <h3 className="font-semibold">Uploaded Documents</h3>
        </div>

        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left">Document</th>
              <th className="px-6 py-3 text-left">Type</th>
              <th className="px-6 py-3 text-left">Uploaded On</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="border-t hover:bg-slate-50">
                <td className="px-6 py-3 flex items-center gap-2">
                  <FileText size={16} />
                  {doc.name}
                </td>
                <td className="px-6 py-3">{doc.type}</td>
                <td className="px-6 py-3">{doc.date}</td>
                <td className="px-6 py-3">
                  {doc.status === "Uploaded" ? (
                    <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                      <CheckCircle size={16} />
                      Uploaded
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-yellow-600 text-sm font-medium">
                      <Clock size={16} />
                      Pending
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* -------- MOCK DATA (UI ONLY) -------- */
const documents = [
  {
    id: 1,
    name: "Resume 2026",
    type: "Resume",
    date: "12 Jan 2026",
    status: "Uploaded",
  },
  {
    id: 2,
    name: "Semester 6 Marksheet",
    type: "Marksheet",
    date: "10 Jan 2026",
    status: "Uploaded",
  },
  {
    id: 3,
    name: "Internship Certificate",
    type: "Certificate",
    date: "-",
    status: "Pending",
  },
];
