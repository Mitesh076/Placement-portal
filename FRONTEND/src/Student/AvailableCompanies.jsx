export default function AvailableCompanies() {
  return (
    <div
      className="  w-full items-center
     gap-6"
    >
      <CompanyCard
        name="Infosys"
        role="System Engineer"
        package="6.5 LPA"
        eligibility="CGPA ≥ 6.5"
      />
      <CompanyCard
        name="Amazon"
        role="SDE Intern"
        package="10 LPA"
        eligibility="CGPA ≥ 7.5"
      />
    </div>
  );
}

function CompanyCard({ name, role, package: pkg, eligibility }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="font-semibold text-lg">{name}</h3>
      <p className="text-sm text-slate-600">{role}</p>
      <p className="mt-2 font-semibold">{pkg}</p>
      <p className="text-xs text-slate-500">{eligibility}</p>

      <button className="mt-4 w-full  py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700">
        Apply
      </button>
    </div>
  );
}
