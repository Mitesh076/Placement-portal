import { Outlet } from "react-router";
import CompanySidebar from "./CompanySidebar";

function Company() {
  return (
    <div className="h-screen flex bg-slate-100 ">
      <CompanySidebar />
      <Outlet />
    </div>
  );
}

export default Company;
