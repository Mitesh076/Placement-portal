import { useState } from "react";
import StudentSidebar from "./StudentSidebar";
import StudentDashboard from "./StudentDashboard";
import AppliedCompanies from "./AppliedCompanies";
import AvailableCompanies from "./AvailableCompanies";
import PlacementStatus from "./PlacementStatus";
import StudentProfile from "./StudentProfile";
import StudentSettings from "./StudentSettings";
import StudentDocuments from "./StudentDocuments";

export default function StudentLayout() {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "applied":
        return <AppliedCompanies />;
      case "available":
        return <AvailableCompanies />;
      case "status":
        return <PlacementStatus />;
      case "profile":
        return <StudentProfile />;
      case "settings":
        return <StudentSettings />;
      case "document":
        return <StudentDocuments />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="h-screen flex bg-slate-100 overflow-hidden">
      <StudentSidebar activePage={activePage} setActivePage={setActivePage} />

      <main className="flex-1 p-6 overflow-y-auto">{renderPage()}</main>
    </div>
  );
}
