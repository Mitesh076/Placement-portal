import {
  LayoutDashboard,
  Users,
  Building2,
  Settings,
  CheckCircle,
  Layers,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function CompanySidebar() {
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
          <h1 className="text-lg font-semibold tracking-wide">Company Admin</h1>
        </div>

        {/* Menu */}
        <ul className="flex-1 px-3 py-4 space-y-1">
          <li>
            <NavLink to="/company/profile" className={linkClass}>
              <Building2 size={18} />
              Company Profile
            </NavLink>
          </li>
          <li>
            <NavLink to="/company/dashboard" className={linkClass}>
              <LayoutDashboard size={18} />
              Company Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink to="/company/applicants" className={linkClass}>
              <Users size={18} />
              Applicants
            </NavLink>
          </li>

          <li>
            <NavLink to="/company/selectedstudents" className={linkClass}>
              <CheckCircle size={18} />
              Selected Students
            </NavLink>
          </li>

          <li>
            <NavLink to="/company/rounds" className={linkClass}>
              <Layers size={18} />
              Interview Rounds
            </NavLink>
          </li>

          <li>
            <NavLink to="/company/settings" className={linkClass}>
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
