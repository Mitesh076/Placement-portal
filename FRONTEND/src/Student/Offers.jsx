import axios from "axios";
import { CheckCircle, XCircle, Building2, MailCheck } from "lucide-react";

export default function Offers({ offers, refresh }) {
  const handleAccept = async (id) => {
    try {
      await axios.put(
        `http://localhost:8000/api/student/offer/accept/${id}`,
        {},
        { withCredentials: true },
      );
      refresh(); // 🔥 refresh parent data
    } catch (err) {
      console.error("Accept failed", err);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(
        `http://localhost:8000/api/student/offer/reject/${id}`,
        {},
        { withCredentials: true },
      );
      refresh();
    } catch (err) {
      console.error("Reject failed", err);
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">Placement Offers</h2>
        <p className="text-sm text-slate-500">
          Review your selected offers and respond to companies
        </p>
      </div>

      {/* Notification Banner */}
      {offers.some((o) => o.choice === "Pending") && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
          <MailCheck className="text-yellow-600 mt-0.5" />
          <p className="text-sm text-yellow-800">
            🎉 Congratulations! You have been selected. Please respond to your
            offers.
          </p>
        </div>
      )}

      {/* Offers List */}
      <div className="space-y-4">
        {offers.length === 0 && (
          <p className="text-sm text-slate-500">No offers available</p>
        )}

        {offers.map((offer) => (
          <div
            key={offer._id}
            className="bg-white rounded-xl shadow-sm p-6 border-l-4"
            style={{
              borderColor:
                offer.choice === "Accepted"
                  ? "#16a34a"
                  : offer.choice === "Rejected"
                    ? "#dc2626"
                    : "#facc15",
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Details */}
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Building2 size={18} /> {offer.cname}
                </h3>
                <p className="text-sm text-slate-600">
                  {offer.role} • {offer.location}
                </p>
                <p className="text-sm font-medium">Package: {offer.pack} LPA</p>
              </div>

              {/* Status */}
              <div>
                {offer.choice === "Pending" && (
                  <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">
                    Awaiting Response
                  </span>
                )}
                {offer.choice === "Accepted" && (
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                    Offer Accepted
                  </span>
                )}
                {offer.choice === "Rejected" && (
                  <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">
                    Offer Rejected
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            {offer.choice === "Pending" && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleAccept(offer._id)}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
                >
                  <CheckCircle size={16} /> Accept Offer
                </button>

                <button
                  onClick={() => handleReject(offer._id)}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
                >
                  <XCircle size={16} /> Reject Offer
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
