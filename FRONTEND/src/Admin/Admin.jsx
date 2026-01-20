import Sidebar from "./Sidebar";
import { Outlet } from "react-router";

function Admin() {
  return (
    <div className="h-screen flex bg-slate-100 ">
      <Sidebar />
      <Outlet />
    </div>
  );
}

export default Admin;
