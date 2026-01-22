import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Login from "./Login/Login.jsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import Admin from "./Admin/Admin.jsx";
import Dashboard from "./Admin/Dashboard.jsx";
import AllUsers from "./Admin/AllUsers.jsx";
import Students from "./Admin/Students.jsx";
import Verification from "./Admin/Verification.jsx";
import PostCompanies from "./Admin/PostCompanies.jsx";
import Companies from "./Admin/Companies.jsx";
import Reports from "./Admin/Reports.jsx";
import Setting from "./Admin/Setting.jsx";
import Student from "./Student/Student.jsx";
import StudentDashboard from "./Student/StudentDashboard.jsx";
import AppliedCompanies from "./Student/AppliedCompanies.jsx";
import AvailableCompanies from "./Student/AvailableCompanies.jsx";
import PlacementStatus from "./Student/PlacementStatus.jsx";
import StudentProfile from "./Student/StudentProfile.jsx";
import StudentDocuments from "./Student/StudentDocuments.jsx";
import StudentSettings from "./Student/StudentSettings.jsx";
import Company from "./Companies/Company.jsx";
import CompanyDashboard from "./Companies/CompanyDashboard.jsx";
import CompanyProfile from "./Companies/CompanyProfile.jsx";
import ApplicantsList from "./Companies/ApplicantList.jsx";
import SelectedStudents from "./Companies/SelectedStudents.jsx";
import InterviewRounds from "./Companies/InterviewRounds.jsx";
import CompanySettings from "./Companies/CompanySettings.jsx";
import Academic from "./Student/Academic.jsx";

const router = createBrowserRouter([
  {
    path: "",
    element: <Login />,
  },
  {
    path: "admin",
    element: <Admin />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "users",
        element: <AllUsers />,
      },
      {
        path: "students",
        element: <Students />,
      },
      {
        path: "verification",
        element: <Verification />,
      },
      {
        path: "post-company",
        element: <PostCompanies />,
      },
      {
        path: "companies",
        element: <Companies />,
      },
      {
        path: "reports",
        element: <Reports />,
      },
      {
        path: "settings",
        element: <Setting />,
      },
    ],
  },
  {
    path: "students",
    element: <Student />,
    children: [
      {
        path: "dashboard",
        element: <StudentDashboard />,
      },
      {
        path: "academics",
        element: <Academic />,
      },
      {
        path: "applied",
        element: <AppliedCompanies />,
      },
      {
        path: "available",
        element: <AvailableCompanies />,
      },
      {
        path: "status",
        element: <PlacementStatus />,
      },
      {
        path: "profile",
        element: <StudentProfile />,
      },
      {
        path: "documents",
        element: <StudentDocuments />,
      },

      {
        path: "settings",
        element: <StudentSettings />,
      },
    ],
  },
  {
    path: "company",
    element: <Company />,
    children: [
      {
        path: "dashboard",
        element: <CompanyDashboard />,
      },
      {
        path: "profile",
        element: <CompanyProfile />,
      },
      {
        path: "applicants",
        element: <ApplicantsList />,
      },
      {
        path: "selectedstudents",
        element: <SelectedStudents />,
      },
      {
        path: "rounds",
        element: <InterviewRounds />,
      },

      {
        path: "settings",
        element: <CompanySettings />,
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
