import {
  LayoutDashboard,
  Building2,
  Settings,
  Briefcase,
  CheckCircle,
  User,
  Files,
  BookCheck,
  BookOpen,
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
          <h1 className="text-lg font-semibold tracking-wide">Student User</h1>
        </div>

        {/* Menu */}
        <ul className="flex-1 px-3 py-4 space-y-1">
          <li>
            <NavLink to="/students" end className={linkClass}>
              <LayoutDashboard size={18} />
              Student Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/students/profile" className={linkClass}>
              <User size={18} />
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink to="/students/academics" className={linkClass}>
              <BookOpen size={18} />
              Academic Details
            </NavLink>
          </li>

          <li>
            <NavLink to="/students/applied" className={linkClass}>
              <Briefcase size={18} />
              Applied Companies
            </NavLink>
          </li>

          <li>
            <NavLink to="/students/available" className={linkClass}>
              <Building2 size={18} />
              Available Companies
            </NavLink>
          </li>

          <li>
            <NavLink to="/students/status" className={linkClass}>
              <CheckCircle size={18} />
              Placement Offers
            </NavLink>
          </li>

          {/* <li>
            <NavLink to="/students/documents" className={linkClass}>
              <Files size={18} />
              Documents
            </NavLink>
          </li> */}

          {/* <li>
            <NavLink to="/students/settings" className={linkClass}>
              <Settings size={18} />
              Settings
            </NavLink>
          </li> */}
        </ul>

        {/* Footer */}
        <div className="h-14 flex items-center justify-center border-t border-indigo-600 text-xs text-indigo-200">
          © 2026 Placement System
        </div>
      </aside>
    </div>
  );
}
