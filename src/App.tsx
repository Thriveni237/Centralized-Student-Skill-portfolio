import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "next-themes";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import StudentDashboard from "./pages/student/Dashboard";
import Skills from "./pages/student/Skills";
import Projects from "./pages/student/Projects";
import Certifications from "./pages/student/Certifications";
import Profile from "./pages/student/Profile";
import Jobs from "./pages/student/Jobs";
import Applications from "./pages/student/Applications";
import ResumeBuilder from "./pages/student/ResumeBuilder";
import Settings from "./pages/Settings";
import RecruiterDashboard from "./pages/recruiter/Dashboard";
import SavedProfiles from "./pages/recruiter/SavedProfiles";
import RecruiterJobs from "./pages/recruiter/Jobs";
import Applicants from "./pages/recruiter/Applicants";
import CompanyProfile from "./pages/recruiter/CompanyProfile";
import Interviews from "./pages/recruiter/Interviews";
import AdminDashboard from "./pages/admin/Dashboard";
import ManageStudents from "./pages/admin/ManageStudents";
import ManageRecruiters from "./pages/admin/ManageRecruiters";
import InstitutionProfile from "./pages/admin/InstitutionProfile";
import Reports from "./pages/admin/Reports";
import DatabaseExplorer from "./pages/admin/DatabaseExplorer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Student Routes */}
              <Route path="/dashboard/student" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
              <Route path="/dashboard/student/profile" element={<ProtectedRoute allowedRoles={['student']}><Profile /></ProtectedRoute>} />
              <Route path="/dashboard/student/skills" element={<ProtectedRoute allowedRoles={['student']}><Skills /></ProtectedRoute>} />
              <Route path="/dashboard/student/projects" element={<ProtectedRoute allowedRoles={['student']}><Projects /></ProtectedRoute>} />
              <Route path="/dashboard/student/certs" element={<ProtectedRoute allowedRoles={['student']}><Certifications /></ProtectedRoute>} />
              <Route path="/dashboard/student/jobs" element={<ProtectedRoute allowedRoles={['student']}><Jobs /></ProtectedRoute>} />
              <Route path="/dashboard/student/applications" element={<ProtectedRoute allowedRoles={['student']}><Applications /></ProtectedRoute>} />
              <Route path="/dashboard/student/resume" element={<ProtectedRoute allowedRoles={['student']}><ResumeBuilder /></ProtectedRoute>} />
              
              {/* Recruiter Routes */}
              <Route path="/dashboard/recruiter" element={<ProtectedRoute allowedRoles={['recruiter']}><RecruiterDashboard /></ProtectedRoute>} />
              <Route path="/dashboard/recruiter/student/:studentId" element={<ProtectedRoute allowedRoles={['recruiter']}><Profile /></ProtectedRoute>} />
              <Route path="/dashboard/recruiter/saved" element={<ProtectedRoute allowedRoles={['recruiter']}><SavedProfiles /></ProtectedRoute>} />
              <Route path="/dashboard/recruiter/jobs" element={<ProtectedRoute allowedRoles={['recruiter']}><RecruiterJobs /></ProtectedRoute>} />
              <Route path="/dashboard/recruiter/jobs/:jobId/applicants" element={<ProtectedRoute allowedRoles={['recruiter']}><Applicants /></ProtectedRoute>} />
              <Route path="/dashboard/recruiter/company" element={<ProtectedRoute allowedRoles={['recruiter']}><CompanyProfile /></ProtectedRoute>} />
              <Route path="/dashboard/recruiter/interviews" element={<ProtectedRoute allowedRoles={['recruiter']}><Interviews /></ProtectedRoute>} />
              
              {/* Admin Routes */}
              <Route path="/dashboard/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/dashboard/admin/students" element={<ProtectedRoute allowedRoles={['admin']}><ManageStudents /></ProtectedRoute>} />
              <Route path="/dashboard/admin/recruiters" element={<ProtectedRoute allowedRoles={['admin']}><ManageRecruiters /></ProtectedRoute>} />
              <Route path="/dashboard/admin/profile" element={<ProtectedRoute allowedRoles={['admin']}><InstitutionProfile /></ProtectedRoute>} />
              <Route path="/dashboard/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><Reports /></ProtectedRoute>} />
              <Route path="/dashboard/admin/database" element={<ProtectedRoute allowedRoles={['admin']}><DatabaseExplorer /></ProtectedRoute>} />
              
              {/* Shared Routes */}
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              
              <Route path="/dashboard" element={<Navigate to="/" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;