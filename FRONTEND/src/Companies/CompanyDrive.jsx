import { useState, useEffect } from "react";
import {
  Briefcase,
  Loader2,
  CheckCircle,
  Plus,
  Edit3,
  Save,
  X,
} from "lucide-react";
import axios from "axios";

const API = "http://localhost:8000/api";

export default function CompanyDrive() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // ─── Fetch Drives ─────────────────────────────────────────────
  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      const { data } = await axios.get(`${API}/company/drives`, {
        withCredentials: true,
      });
      setDrives(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ─── Open Add Form ────────────────────────────────────────────
  const openAdd = () => {
    setForm({
      roles: "",
      jobtype: "",
      pack: "",
      mincgpa: "",
      ebranches: "",
      bond: "",
      drivedate: "",
      lastdate: "",
    });
    setEditingId(null);
    setShowForm(true);
  };

  // ─── Open Edit Form ───────────────────────────────────────────
  const openEdit = (d) => {
    setForm({
      ...d,
      drivedate: d.drivedate?.slice(0, 10),
      lastdate: d.lastdate?.slice(0, 10),
    });
    setEditingId(d._id);
    setShowForm(true);
  };

  // ─── Handle Change ────────────────────────────────────────────
  const handleChange = (k, v) => {
    setForm((prev) => ({ ...prev, [k]: v }));
  };

  // ─── Save Drive ───────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId) {
        await axios.put(`${API}/company/drives/${editingId}`, form, {
          withCredentials: true,
        });
      } else {
        await axios.post(`${API}/company/drives`, form, {
          withCredentials: true,
        });
      }

      setShowForm(false);
      fetchDrives();
    } catch (err) {
      alert(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-400 gap-2">
        <Loader2 className="animate-spin" /> Loading drives...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 w-full">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-semibold">Placement Drives</h2>
          <p className="text-sm text-slate-500">
            Create and manage multiple drives
          </p>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus size={16} /> Add Drive
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Package</th>
              <th className="px-4 py-3 text-left">CGPA</th>
              <th className="px-4 py-3 text-left">Job Type</th>
              <th className="px-4 py-3 text-left">Drive Date</th>
              <th className="px-4 py-3 text-left">Last Date</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {drives.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-slate-400">
                  No drives created yet
                </td>
              </tr>
            ) : (
              drives.map((d) => (
                <tr key={d._id} className="border-t hover:bg-indigo-50">
                  <td className="px-4 py-3">{d.roles}</td>
                  <td className="px-4 py-3">{d.pack} LPA</td>
                  <td className="px-4 py-3">{d.mincgpa}</td>
                  <td className="px-4 py-3">{d.jobtype}</td>
                  <td className="px-4 py-3">
                    {new Date(d.drivedate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(d.lastdate).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() => openEdit(d)}
                      className="flex items-center gap-1 text-indigo-600 hover:underline"
                    >
                      <Edit3 size={14} /> Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-125 space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Briefcase size={18} />
              {editingId ? "Edit Drive" : "Add Drive"}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Role"
                value={form.roles}
                onChange={(v) => handleChange("roles", v)}
              />
              <Input
                label="Package"
                value={form.pack}
                onChange={(v) => handleChange("pack", v)}
              />
              <Input
                label="Min CGPA"
                value={form.mincgpa}
                onChange={(v) => handleChange("mincgpa", v)}
              />
              <Input
                label="Job Type"
                value={form.jobtype}
                onChange={(v) => handleChange("jobtype", v)}
              />
              <Input
                label="Branches"
                value={form.ebranches}
                onChange={(v) => handleChange("ebranches", v)}
              />
              <Input
                label="Bond"
                value={form.bond}
                onChange={(v) => handleChange("bond", v)}
              />
              <Input
                type="date"
                label="Drive Date"
                value={form.drivedate}
                onChange={(v) => handleChange("drivedate", v)}
              />
              <Input
                type="date"
                label="Last Date"
                value={form.lastdate}
                onChange={(v) => handleChange("lastdate", v)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg flex items-center gap-1"
              >
                <X size={14} /> Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-1"
              >
                {saving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Input Component ───────────────────────────── */
function Input({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400"
      />
    </div>
  );
}
