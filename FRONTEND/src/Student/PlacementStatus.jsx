import { useEffect, useState } from "react";
import axios from "axios";
import { Building2, CheckCircle, XCircle, Clock, Trophy } from "lucide-react";
import Offers from "./Offers";

export default function PlacementStatus() {
  const [data, setData] = useState({
    totalApplied: 0,
    shortlisted: 0,
    selected: 0,
    placementStatus: "Unplaced",
    offers: [],
  });

  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/student/pstatus", {
        withCredentials: true,
      });
      setData(res.data.data);
    } catch (err) {
      console.error("Error fetching status", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="space-y-6 w-full p-6 overflow-y-scroll">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">Placement Status</h2>
        <p className="text-sm text-slate-500">
          Track your applied companies and placement performance
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard
          label="Total Applied"
          value={data.totalApplied}
          icon={<Building2 />}
        />
        <SummaryCard
          label="Shortlisted"
          value={data.shortlisted}
          icon={<Clock />}
        />
        <SummaryCard label="Selected" value={data.selected} icon={<Trophy />} />

        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              data.placementStatus === "Placed"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {data.placementStatus === "Placed" ? <CheckCircle /> : <XCircle />}
          </div>
          <div>
            <p className="text-xs text-slate-500">Placement Status</p>
            <p
              className={`text-lg font-semibold ${
                data.placementStatus === "Placed"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {data.placementStatus}
            </p>
          </div>
        </div>
      </div>

      {/* Offers Section */}
      <Offers offers={data.offers} refresh={fetchStatus} />
    </div>
  );
}

/* ---------- Helper ---------- */

function SummaryCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
}
