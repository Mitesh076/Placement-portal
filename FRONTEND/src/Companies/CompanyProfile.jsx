function CompanyProfile() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm space-y-6 w-full">
      <h3 className="text-lg   font-semibold">Company Profile</h3>

      <div className="grid bg-slate-100 p-6 grid-cols-2 gap-6">
        <ProfileField label="Company Name" value="Google" />
        <ProfileField label="Industry" value="Technology" />
        <ProfileField label="Location" value="Bangalore" />
        <ProfileField label="Package" value="12 LPA" />
        <ProfileField label="Bond" value="2 Years" />
        <ProfileField label="HR Email" value="hr@google.com" />
      </div>
    </div>
  );
}

function ProfileField({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

export default CompanyProfile;
