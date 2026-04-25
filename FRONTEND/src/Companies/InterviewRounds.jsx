import { useState, useEffect } from "react";
import {
  Users,
  CheckCircle,
  XCircle,
  Layers,
  Send,
  X,
  ChevronDown,
} from "lucide-react";
import axios from "axios";

const API = "http://localhost:8000/api";

const ROUNDS = [
  { id: 1, name: "Online Test" },
  { id: 2, name: "Technical Interview" },
  { id: 3, name: "HR Interview" },
  { id: 4, name: "Offer Letter" },
];

export default function InterviewRounds() {
  const [drives, setDrives] = useState([]);
  const [selectedDrive, setSelectedDrive] = useState(null); // full drive object
  const [selectedRoundId, setSelectedRoundId] = useState(1);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    selected: 0,
    rejected: 0,
    shortlisted: 0,
    inProgress: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [drivesLoading, setDrivesLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Offer modal
  const [offerModal, setOfferModal] = useState(false);
  const [offerTarget, setOfferTarget] = useState(null);
  const [offerForm, setOfferForm] = useState({
    role: "",
    pack: "",
    bond: "",
    location: "",
  });
  const [offerLoading, setOfferLoading] = useState(false);

  // ── 1. Fetch all drives for this company on mount ────────
  useEffect(() => {
    const fetchDrives = async () => {
      setDrivesLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:8000/api/company/cdrives`,
          {
            withCredentials: true,
          },
        );
        if (res.data.success) {
          setDrives(res.data.drives);
          // auto-select first drive
          if (res.data.drives.length > 0) {
            setSelectedDrive(res.data.drives[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching drives", err);
      } finally {
        setDrivesLoading(false);
      }
    };
    fetchDrives();
  }, []);

  // ── 2. Fetch applicants whenever selected drive changes ──
  useEffect(() => {
    if (!selectedDrive) return;

    const fetchData = async () => {
      setLoading(true);
      setStudents([]);
      setSelectedRoundId(1); // reset to round 1 on drive change
      try {
        const res = await axios.get(
          `${API}/company/rounds/${selectedDrive._id}`,
          {
            withCredentials: true,
          },
        );
        if (res.data.success) {
          setStudents(res.data.students);
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error("Error fetching rounds data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDrive]);

  // ── Filter students for selected round ───────────────────
  const studentsInRound = students.filter((s) => {
    const inRound =
      s.currentRound === selectedRoundId ||
      (s.status === "Rejected" && s.roundsCleared === selectedRoundId - 1);
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.branch.toLowerCase().includes(searchQuery.toLowerCase());
    return inRound && matchesSearch;
  });

  const roundStatusOf = (s) => {
    if (s.status === "Rejected" && s.roundsCleared === selectedRoundId - 1)
      return "Rejected";
    if (s.roundsCleared >= selectedRoundId) return "Cleared";
    return "In Progress";
  };

  // ── Handle Select / Reject ───────────────────────────────
  const handleAction = async (appliedId, action) => {
    setActionLoading(appliedId + action);
    try {
      const { data } = await axios.patch(
        `${API}/company/rounds/action`,
        { appliedId, roundId: selectedRoundId, action },
        { withCredentials: true },
      );
      if (data.success && data.requiresOffer) {
        const student = students.find((s) => s._id === appliedId);
        setOfferTarget({ appliedId, name: student?.name });
        setOfferModal(true);
      } else if (data.success) {
        // re-fetch for this drive
        const res = await axios.get(
          `${API}/company/rounds/${selectedDrive._id}`,
          { withCredentials: true },
        );
        if (res.data.success) {
          setStudents(res.data.students);
          setStats(res.data.stats);
        }
      }
    } catch (err) {
      console.error("handleAction:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // ── Send Offer ───────────────────────────────────────────
  const handleSendOffer = async () => {
    if (!offerTarget) return;
    setOfferLoading(true);
    try {
      const { data } = await axios.post(
        `${API}/company/rounds/offer`,
        { appliedId: offerTarget.appliedId, ...offerForm },
        { withCredentials: true },
      );
      if (data.success) {
        setOfferModal(false);
        setOfferForm({ role: "", pack: "", bond: "", location: "" });
        const res = await axios.get(
          `${API}/company/rounds/${selectedDrive._id}`,
          { withCredentials: true },
        );
        if (res.data.success) {
          setStudents(res.data.students);
          setStats(res.data.stats);
        }
      }
    } catch (err) {
      console.error("handleSendOffer:", err);
    } finally {
      setOfferLoading(false);
    }
  };

  // ────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 w-full p-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold">Interview Rounds</h2>
          <p className="text-sm text-slate-500">
            Manage student selection for each round
          </p>
        </div>

        {/* ── Drive Selector Dropdown ── */}
        <div className="relative">
          {drivesLoading ? (
            <div className="px-4 py-2 border rounded-lg text-sm text-slate-400">
              Loading drives…
            </div>
          ) : drives.length === 0 ? (
            <div className="px-4 py-2 border rounded-lg text-sm text-slate-400">
              No drives found
            </div>
          ) : (
            <>
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm min-w-55 justify-between"
              >
                <span>
                  {selectedDrive
                    ? `${selectedDrive.roles || "Drive"}${selectedDrive.Company?.name || ""}`
                    : "Select a Drive"}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-1 w-full min-w-70 bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden">
                  {drives.map((d) => (
                    <button
                      key={d._id}
                      onClick={() => {
                        setSelectedDrive(d);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-50 border-b last:border-0 ${
                        selectedDrive?._id === d._id
                          ? "bg-indigo-50 text-indigo-700 font-medium"
                          : "text-slate-700"
                      }`}
                    >
                      <p className="font-medium">
                        {d.title || d.roles || "Untitled Drive"}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {d.cname || ""} {d.location ? `· ${d.location}` : ""}{" "}
                        {d.package ? `· ${d.package} LPA` : ""}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Users size={20} />}
          label="Total Applied"
          value={loading ? "…" : stats.total}
        />
        <StatCard
          icon={<CheckCircle size={20} />}
          label="Shortlisted"
          value={loading ? "…" : stats.shortlisted}
          colorClass="text-green-600 bg-green-100"
        />
        <StatCard
          icon={<XCircle size={20} />}
          label="Rejected"
          value={loading ? "…" : stats.rejected}
          colorClass="text-red-600 bg-red-100"
        />
        <StatCard
          icon={<Layers size={20} />}
          label="In Progress"
          value={loading ? "…" : stats.inProgress}
          colorClass="text-yellow-600 bg-yellow-100"
        />
      </div>

      {/* Round Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {ROUNDS.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedRoundId(r.id)}
            className={`px-4 py-2 rounded-lg font-medium border text-sm whitespace-nowrap ${
              selectedRoundId === r.id
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
            }`}
          >
            {r.name}
          </button>
        ))}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name or branch"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full md:w-1/3 p-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
      />

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="h-14 px-6 flex items-center justify-between border-b">
          <h3 className="font-semibold">
            Students in "{ROUNDS.find((r) => r.id === selectedRoundId)?.name}"
            {selectedDrive && (
              <span className="ml-2 text-xs font-normal text-slate-400">
                — {selectedDrive.title || selectedDrive.role}
              </span>
            )}
          </h3>
          <span className="text-xs text-slate-400">
            {studentsInRound.length} student(s)
          </span>
        </div>

        {!selectedDrive ? (
          <div className="flex items-center justify-center py-16 text-slate-400 text-sm">
            Please select a drive to view students.
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 text-sm">
            Loading…
          </div>
        ) : studentsInRound.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-slate-400 text-sm">
            No students in this round.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Branch
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Erno
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  CGPA
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {studentsInRound.map((s) => {
                const rStatus = roundStatusOf(s);
                const isActing =
                  actionLoading === s._id + "select" ||
                  actionLoading === s._id + "reject";
                return (
                  <tr key={s._id} className="border-t hover:bg-slate-50">
                    <td className="px-6 py-3">
                      <p className="font-medium text-slate-800">{s.name}</p>
                      <p className="text-xs text-slate-400">{s.email}</p>
                    </td>
                    <td className="px-6 py-3 text-slate-600">{s.branch}</td>
                    <td className="px-6 py-3 text-slate-600">{s.erno}</td>
                    <td className="px-6 py-3 text-slate-600">{s.cgpa}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          rStatus === "Cleared"
                            ? "bg-green-100 text-green-700"
                            : rStatus === "Rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {rStatus}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      {rStatus === "In Progress" ? (
                        <div className="flex gap-2">
                          <button
                            disabled={isActing}
                            onClick={() => handleAction(s._id, "select")}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700 disabled:opacity-50"
                          >
                            {selectedRoundId === 4 ? "Send Offer" : "Select"}
                          </button>
                          <button
                            disabled={isActing}
                            onClick={() => handleAction(s._id, "reject")}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs hover:bg-red-700 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Offer Modal */}
      {offerModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setOfferModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-semibold mb-1">Send Offer Letter</h3>
            <p className="text-sm text-slate-500 mb-5">
              Sending offer to <strong>{offerTarget?.name}</strong>
            </p>
            <div className="space-y-3">
              <OfferInput
                label="Role / Position"
                placeholder="e.g. Software Engineer"
                value={offerForm.role}
                onChange={(v) => setOfferForm((f) => ({ ...f, role: v }))}
              />
              <OfferInput
                label="Package (LPA)"
                placeholder="e.g. 12"
                value={offerForm.pack}
                onChange={(v) => setOfferForm((f) => ({ ...f, pack: v }))}
                type="number"
              />
              <OfferInput
                label="Bond (months / NA)"
                placeholder="e.g. 12 months or NA"
                value={offerForm.bond}
                onChange={(v) => setOfferForm((f) => ({ ...f, bond: v }))}
              />
              <OfferInput
                label="Location"
                placeholder="e.g. Bangalore"
                value={offerForm.location}
                onChange={(v) => setOfferForm((f) => ({ ...f, location: v }))}
              />
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => setOfferModal(false)}
                className="px-4 py-2 rounded-lg border text-slate-700 hover:bg-slate-100 text-sm"
              >
                Cancel
              </button>
              <button
                disabled={offerLoading || !offerForm.role || !offerForm.pack}
                onClick={handleSendOffer}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50"
              >
                <Send size={14} />
                {offerLoading ? "Sending…" : "Send Offer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  colorClass = "text-indigo-600 bg-indigo-100",
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
}

function OfferInput({ label, placeholder, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-xs text-slate-500 mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
