export default function PlacementStatus() {
  return (
    <div className="bg-white w-full rounded-xl shadow-sm p-6">
      <h3 className="font-semibold mb-4">Placement Status</h3>

      <div className="space-y-3 text-sm">
        <Status label="Resume Verified" done />
        <Status label="Eligible for Drives" done />
        <Status label="Interview Cleared" />
        <Status label="Offer Letter Received" />
      </div>
    </div>
  );
}

function Status({ label, done }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`w-3 h-3 rounded-full ${
          done ? "bg-green-500" : "bg-slate-300"
        }`}
      />
      <span>{label}</span>
    </div>
  );
}
