import {
  LayoutDashboard,
  Users,
  UserCheck,
  Building2,
  BarChart3,
  Settings,
  GraduationCap,
  CirclePlus,
  PlusSquareIcon,
  User,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    `h-10 px-3 flex items-center gap-3 rounded-lg transition
     ${
       isActive ? "bg-white/20 text-white" : "text-indigo-100 hover:bg-white/10"
     }`;

  return (
    <div className="h-screen flex bg-slate-100 text-sm overflow-hidden">
      <aside className="w-64 bg-linear-to-b from-indigo-700 to-indigo-900 text-white flex flex-col">
        {/* Header */}
        <div className="h-16 flex items-center justify-center border-b border-indigo-600">
          <h1 className="text-lg font-semibold tracking-wide">
            Placement Admin
          </h1>
        </div>

        {/* Menu */}
        <ul className="flex-1 px-3 py-4 space-y-1">
          <li>
            <NavLink to="/admin" end className={linkClass}>
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/profile" className={linkClass}>
              <User size={18} />
              Profile
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/users" className={linkClass}>
              <Users size={18} />
              All Users
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/students" className={linkClass}>
              <GraduationCap size={18} />
              Students
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/verification" className={linkClass}>
              <UserCheck size={18} />
              Verification
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/companies" className={linkClass}>
              <Building2 size={18} />
              Companies
            </NavLink>
          </li>

          {/* <li>
            <NavLink to="/admin/addcompany" className={linkClass}>
              <CirclePlus size={18} />
              Add Companies
            </NavLink>
          </li> */}
          <li>
            <NavLink to="/admin/postcompany" className={linkClass}>
              <PlusSquareIcon size={18} />
              Post Companies
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/reports" className={linkClass}>
              <BarChart3 size={18} />
              Reports
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/settings" className={linkClass}>
              <Settings size={18} />
              Settings
            </NavLink>
          </li>
        </ul>

        {/* Footer */}
        <div className="h-14 flex items-center justify-center border-t border-indigo-600 text-xs text-indigo-200">
          © 2026 Placement System
        </div>
      </aside>
    </div>
  );
}
