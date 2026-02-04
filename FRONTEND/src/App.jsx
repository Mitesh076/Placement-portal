import { Routes, Route } from "react-router";
import Login from "./Login/Login";
import Student from "./Student/Student";
import Company from "./Companies/Company";
import Admin from "./Admin/Admin";
import Dashboard from "./Admin/Dashboard";
import AllUsers from "./Admin/AllUsers";
import Students from "./Admin/Students";
import Verification from "./Admin/Verification";
import Companies from "./Admin/Companies";
import AddCompany from "./Admin/AddCompany";
import PostCompany from "./Admin/PostCompany";
import Reports from "./Admin/Reports";
import Setting from "./Admin/Setting";
import StudentDashboard from "./Student/StudentDashboard";
import StudentProfile from "./Student/StudentProfile";
import AppliedCompanies from "./Student/AppliedCompanies";
import AvailableCompanies from "./Student/AvailableCompanies";
import PlacementStatus from "./Student/PlacementStatus";
import Academic from "./Student/Academic";
import StudentDocuments from "./Student/StudentDocuments";
import StudentSetting from "./Student/StudentSettings";
import CompanyProfile from "./Companies/CompanyProfile";
import CompanyDashboard from "./Companies/CompanyDashboard";
import ApplicantList from "./Companies/ApplicantList";
import SelectedStudents from "./Companies/SelectedStudents";
import InterviewRounds from "./Companies/InterviewRounds";
import CompanySettings from "./Companies/CompanySettings";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<AllUsers />} />
          <Route path="students" element={<Students />} />
          <Route path="verification" element={<Verification />} />
          <Route path="companies" element={<Companies />} />
          <Route path="addcompany" element={<AddCompany />} />
          <Route path="postcompany" element={<PostCompany />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Setting />} />
        </Route>
        <Route path="/students" element={<Student />}>
          <Route index element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="applied" element={<AppliedCompanies />} />
          <Route path="available" element={<AvailableCompanies />} />
          <Route path="status" element={<PlacementStatus />} />
          <Route path="academics" element={<Academic />} />
          <Route path="documents" element={<StudentDocuments />} />
          <Route path="settings" element={<StudentSetting />} />
        </Route>
        <Route path="/company" element={<Company />}>
          <Route index element={<CompanyProfile />} />
          <Route path="dashboard" element={<CompanyDashboard />} />
          <Route path="applicants" element={<ApplicantList />} />
          <Route path="selectedstudents" element={<SelectedStudents />} />
          <Route path="rounds" element={<InterviewRounds />} />
          <Route path="settings" element={<CompanySettings />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
