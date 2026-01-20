import { useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

export default function AllUsers() {
  return (
    <div className="h-screen w-screen flex bg-slate-100 text-sm overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              User Management
            </h2>
            <p className="text-xs text-slate-500">
              Manage Admins, Students, and Company users separately
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Plus size={16} /> Add User
          </button>
        </div>

        <UserTable
          title="Admin Users"
          role="Admin"
          badgeClass="bg-purple-100 text-purple-700"
          users={[
            {
              id: "ADM001",
              name: "Placement Officer",
              email: "admin@college.edu",
            },
          ]}
        />

        <UserTable
          title="Student Users"
          role="Student"
          badgeClass="bg-blue-100 text-blue-700"
          users={[
            { id: "STD101", name: "Rahul Sharma", email: "rahul@college.edu" },
            { id: "STD102", name: "Priya Patel", email: "priya@college.edu" },
          ]}
        />

        <UserTable
          title="Company Users"
          role="Company"
          badgeClass="bg-green-100 text-green-700"
          users={[
            { id: "CMP501", name: "Infosys HR", email: "hr@infosys.com" },
            { id: "CMP502", name: "TCS HR", email: "careers@tcs.com" },
          ]}
        />
      </main>
    </div>
  );
}

function UserTable({ title, role, badgeClass, users }) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="h-14 px-6 flex items-center border-b">
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      </div>

      <table className="w-full">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-6 py-3 text-left">User ID</th>
            <th className="px-6 py-3 text-left">Name</th>
            <th className="px-6 py-3 text-left">Role</th>
            <th className="px-6 py-3 text-left">Email</th>
            <th className="px-6 py-3 text-left">Password</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              role={role}
              badgeClass={badgeClass}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UserRow({ user, role, badgeClass }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <tr className="border-t hover:bg-slate-50">
      <td className="px-6 py-3 font-medium">{user.id}</td>
      <td className="px-6 py-3">{user.name}</td>
      <td className="px-6 py-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeClass}`}
        >
          {role}
        </span>
      </td>
      <td className="px-6 py-3">{user.email}</td>
      <td className="px-6 py-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs">
            {showPassword ? "user@123" : "••••••••"}
          </span>
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="text-slate-500 hover:text-slate-700"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </td>
      <td className="px-6 py-3 text-center">
        <div className="flex justify-center gap-3">
          <button className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600">
            <Pencil size={16} />
          </button>
          <button className="p-2 rounded-lg hover:bg-red-50 text-red-600">
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
