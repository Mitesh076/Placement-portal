import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Building2,
  ShieldCheck,
  Briefcase,
  Users,
  BarChart3,
} from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        const userrole = data.user.role;

        // store token if needed
        localStorage.setItem("token", data.token);

        // role based navigation
        if (userrole === "admin") {
          alert("Admin login successfull");
          navigate("/admin");
        } else if (userrole === "student") {
          alert("Student login successfull");
          navigate("/students");
        } else if (userrole === "company") {
          alert("Company login successfull");
          navigate("/company");
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const roles = {
    student: {
      label: "Student",
      icon: <GraduationCap className="h-6 w-6" />,
      tagline: "Explore opportunities, apply confidently, and get placed",
    },
    company: {
      label: "Company",
      icon: <Building2 className="h-6 w-6" />,
      tagline: "Hire skilled students from one trusted platform",
    },
    admin: {
      label: "Admin",
      icon: <ShieldCheck className="h-6 w-6" />,
      tagline: "Monitor, manage, and streamline placements",
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white ">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-700">
            Student Placement Portal
          </h1>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-indigo-600">
              Features
            </a>
            <a href="#login" className="hover:text-indigo-600">
              Login
            </a>
            <a href="#contact" className="hover:text-indigo-600">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}

      <section
        id="features"
        className="bg-linear-to-r from-blue-600 to-indigo-700 text-white"
      >
        <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
              Centralized <br />
              <span className="text-yellow-300">
                Placement Management System
              </span>
            </h1>

            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              A modern web-based platform designed to manage and streamline
              campus placement activities. It connects students, placement
              officers, and companies through a single unified system to ensure
              transparency, efficiency, and better outcomes.
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="bg-yellow-400 text-blue-900 font-semibold px-6 py-3 rounded-lg hover:bg-yellow-300 transition">
                Get Started
              </button>

              <button className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-blue-700 transition">
                Learn More
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
              <h3 className="text-xl font-semibold mb-4 text-white">
                Key Highlights
              </h3>

              <ul className="space-y-3 text-blue-100">
                <li>✔ Role-based system for Students, Admin & Companies</li>
                <li>✔ Automated placement and application tracking</li>
                <li>✔ Secure and scalable MERN stack architecture</li>
                <li>✔ Interactive dashboards and analytics</li>
                <li>✔ Transparent and efficient recruitment process</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <h3 className="text-3xl font-bold text-center text-indigo-700">
          Why Choose This Portal?
        </h3>
        <p className="text-center text-slate-600 mt-3 max-w-xl mx-auto">
          Designed to simplify placement activities with transparency,
          efficiency, and reliability.
        </p>

        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Briefcase />}
            title="Placement Opportunities"
            description="Students can browse job openings, apply easily, and track their application status in real time."
          />
          <FeatureCard
            icon={<Users />}
            title="Smart Hiring"
            description="Companies can post jobs, shortlist candidates, and manage hiring efficiently."
          />
          <FeatureCard
            icon={<BarChart3 />}
            title="Centralized Management"
            description="Admins get complete control with reports, analytics, and approval workflows."
          />
        </div>
      </section>

      {/* Login Section */}
      <section id="login" className="bg-slate-100 py-24 px-6">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-center text-indigo-700">
            Login
          </h3>
          <p className="text-center text-sm text-slate-500 mt-1">
            Select your role and enter credentials
          </p>

          {/* Role Selector */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {Object.keys(roles).map((key) => (
              <button
                key={key}
                onClick={() => setRole(key)}
                className={`p-3 rounded-xl border text-sm font-medium transition flex flex-col items-center gap-1 ${
                  role === key
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-50 hover:bg-slate-100"
                }`}
              >
                {roles[key].icon}
                {roles[key].label}
              </button>
            ))}
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="name@college.edu"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="w-full mt-2 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700"
            >
              Continue as {roles[role].label}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-4">
            Forgot password? Please contact the placement office
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-white ">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-sm text-slate-600">
            © 2026 Student Placement Portal
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Designed for academic placement management
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="bg-white rounded-2xl shadow-md p-6 text-center"
    >
      <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 mb-4">
        {icon}
      </div>
      <h4 className="text-lg font-semibold text-slate-800">{title}</h4>
      <p className="text-sm text-slate-600 mt-2">{description}</p>
    </motion.div>
  );
}
