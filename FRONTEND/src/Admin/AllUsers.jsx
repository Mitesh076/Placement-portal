import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

export default function AllUsers() {
  const [admins, setAdmins] = useState([]);
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "student",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ FETCH USERS
  const fetchUsers = async () => {
    try {
      const [adminRes, studentRes, companyRes] = await Promise.all([
        axios.get("http://localhost:8000/api/admin/admins", {
          withCredentials: true,
        }),
        axios.get("http://localhost:8000/api/admin/students", {
          withCredentials: true,
        }),
        axios.get("http://localhost:8000/api/admin/companies", {
          withCredentials: true,
        }),
      ]);

      setAdmins(adminRes.data || []);
      setStudents(studentRes.data || []);
      setCompanies(companyRes.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ FILTER USERS BY ROLE

  // ✅ ADD USER
  const handleAddUser = async () => {
    try {
      await axios.post("http://localhost:8000/api/auth/register", formData, {
        withCredentials: true,
      });

      setShowModal(false);
      setFormData({
        username: "",
        email: "",
        password: "",
        role: "student",
      });

      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding user");
    }
  };

  // ✅ DELETE USER
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?",
    );
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:8000/api/admin/delete/${id}`, {
        withCredentials: true,
      });
      fetchUsers(); // ✅ Refresh the tables
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
      console.error(err);
    }
  };

  return (
    <div className="h-screen w-screen flex bg-slate-100 text-sm overflow-hidden">
      <main className="flex-1 overflow-y-auto p-6 space-y-10">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              User Management
            </h2>
            <p className="text-xs text-slate-500">
              Manage Admins, Students, and Company users separately
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus size={16} /> Add User
          </button>
        </div>
        <UserTable
          title="Admin Users"
          role="Admin"
          badgeClass="bg-purple-100 text-purple-700"
          users={admins}
          onDelete={handleDelete}
        />

        <UserTable
          title="Student Users"
          role="Student"
          badgeClass="bg-blue-100 text-blue-700"
          users={students}
          onDelete={handleDelete}
        />

        <UserTable
          title="Company Users"
          role="Company"
          badgeClass="bg-green-100 text-green-700"
          users={companies}
          onDelete={handleDelete}
        />
      </main>

      {/* ✅ ADD USER MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white w-96 p-6 rounded-xl shadow-lg space-y-4">
            <h2 className="text-lg font-semibold">Add User</h2>

            <input
              type="text"
              placeholder="Name"
              className="w-full border p-2 rounded"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full border p-2 rounded"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border p-2 rounded"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            <select
              className="w-full border p-2 rounded"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option value="admin">Admin</option>
              <option value="student">Student</option>
              <option value="company">Company</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleAddUser}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= TABLE ================= */

function UserTable({ title, role, badgeClass, users, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="h-14 px-6 flex items-center border-b">
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      </div>

      <table className="w-full">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-6 py-3 text-left">Name</th>
            <th className="px-6 py-3 text-left">Role</th>
            <th className="px-6 py-3 text-left">Email</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <UserRow
              key={user._id}
              user={user}
              role={role}
              badgeClass={badgeClass}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ================= ROW ================= */

function UserRow({ user, role, badgeClass, onDelete }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <tr className="border-t hover:bg-slate-50">
      <td className="px-6 py-3">{user.name}</td>

      <td className="px-6 py-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeClass}`}
        >
          {role}
        </span>
      </td>

      <td className="px-6 py-3">{user.email}</td>

      <td className="px-6 py-3 text-center">
        <div className="flex justify-center gap-3">
          <button
            onClick={() => onDelete(user._id)}
            className="p-2 rounded-lg hover:bg-red-50 text-red-600"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
