import StudentSidebar from "./StudentSidebar";
import { Outlet } from "react-router";

function Student() {
  return (
    <div className="h-screen flex bg-slate-100 ">
      <StudentSidebar />
      <Outlet />
    </div>
  );
}

export default Student;
