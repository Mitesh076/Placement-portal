import { useState } from "react";
import { CheckCircle, XCircle, Building2, MailCheck } from "lucide-react";

export default function Offers() {
  const [offers, setOffers] = useState([
    {
      id: 1,
      company: "Google",
      role: "Software Engineer",
      package: "18 LPA",
      location: "Bangalore",
      status: "Selected", // Only selected offers
      response: "Pending", // Pending | Accepted | Rejected
    },
    {
      id: 2,
      company: "Amazon",
      role: "SDE-1",
      package: "16 LPA",
      location: "Hyderabad",
      status: "Selected",
      response: "Pending",
    },
  ]);

  const handleResponse = (id, decision) => {
    setOffers((prev) =>
      prev.map((offer) =>
        offer.id === id ? { ...offer, response: decision } : offer,
      ),
    );
  };

  return (
    <div className="space-y-6 w-full ">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">Placement Status</h2>
        <p className="text-sm text-slate-500">
          Review your selected offers and respond to companies
        </p>
      </div>

      {/* Notification Banner */}
      {offers.some((o) => o.response === "Pending") && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
          <MailCheck className="text-yellow-600 mt-0.5" />
          <p className="text-sm text-yellow-800">
            🎉 Congratulations! You have been selected by one or more companies.
            Please accept or reject the offer to proceed further.
          </p>
        </div>
      )}

      {/* Selected Offers */}
      <div className="space-y-4">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white rounded-xl shadow-sm p-6 border-l-4"
            style={{
              borderColor:
                offer.response === "Accepted"
                  ? "#16a34a"
                  : offer.response === "Rejected"
                    ? "#dc2626"
                    : "#facc15",
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Offer Details */}
              <div className="space-y-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Building2 size={18} /> {offer.company}
                </h3>
                <p className="text-sm text-slate-600">
                  {offer.role} • {offer.location}
                </p>
                <p className="text-sm font-medium">Package: {offer.package}</p>
              </div>

              {/* Offer Status */}
              <div className="text-sm">
                {offer.response === "Pending" && (
                  <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium">
                    Awaiting Response
                  </span>
                )}
                {offer.response === "Accepted" && (
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                    Offer Accepted
                  </span>
                )}
                {offer.response === "Rejected" && (
                  <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-medium">
                    Offer Rejected
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {offer.response === "Pending" && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleResponse(offer.id, "Accepted")}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
                >
                  <CheckCircle size={16} /> Accept Offer
                </button>

                <button
                  onClick={() => handleResponse(offer.id, "Rejected")}
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
