import { Moon, Sun, Bell, Shield, UserCog } from "lucide-react";

export default function StudentSetting() {
  return (
    <div className="h-screen w-screen flex bg-slate-100 text-sm overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Settings</h2>
          <p className="text-xs text-slate-500">
            Manage appearance, security, and preferences
          </p>
        </div>

        {/* Appearance Settings */}
        <SettingCard title="Appearance" icon={<Sun />}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-xs text-slate-500">Light or Dark mode</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold flex items-center gap-1">
                <Sun size={14} /> Light
              </button>
              <button className="px-4 py-2 rounded-lg border text-xs font-semibold flex items-center gap-1">
                <Moon size={14} /> Dark
              </button>
            </div>
          </div>
        </SettingCard>

        {/* Notification Settings */}
        <SettingCard title="Notifications" icon={<Bell />}>
          <div className="space-y-3">
            <Toggle label="New company added" />
            <Toggle label="Student placed update" />
            <Toggle label="Weekly placement summary" />
          </div>
        </SettingCard>

        {/* Security Settings */}
        <SettingCard title="Security" icon={<Shield />}>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Change Password" placeholder="New password" />
            <Input label="Confirm Password" placeholder="Confirm password" />
          </div>
          <button className="mt-4 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold">
            Update Password
          </button>
        </SettingCard>

        {/* Account Settings */}
        <SettingCard title="Account" icon={<UserCog />}>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Admin Name" placeholder="Placement Officer" />
            <Input label="Email" placeholder="admin@college.edu" />
          </div>
          <button className="mt-4 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold">
            Save Changes
          </button>
        </SettingCard>
      </main>
    </div>
  );
}

function SettingCard({ title, icon, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-2 text-indigo-600">
        {icon}
        <h3 className="font-semibold text-slate-800">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Toggle({ label }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <div className="w-10 h-5 rounded-full bg-slate-300 relative">
        <span className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5" />
      </div>
    </div>
  );
}

function Input({ label, placeholder }) {
  return (
    <div>
      <label className="text-xs font-medium">{label}</label>
      <input
        className="mt-1 w-full px-3 py-2 border rounded-lg"
        placeholder={placeholder}
      />
    </div>
  );
}
