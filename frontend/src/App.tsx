import { Routes, Route } from "react-router";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import NotFound404 from "./pages/404";
import ProtectedRoute from "./components/ProtectedRoute";
import AnonymousRoute from "./components/AnonymousRoute";
import CreateJob from "./pages/CreateJob";
import EmployerDashboard from "./pages/EmployerDashboard";
import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import PreviewJob from "./pages/PreviewJob";
import Jobs from "./pages/Jobs";
import JobApplications from "./pages/JobApplications";

function App() {
  return (
    <Routes>
      <Route path="/" index element={<Home />} />
      <Route element={<AnonymousRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/forgot" element={<ForgotPassword />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/createJob" element={<CreateJob />} />
        <Route path="/dashboard/employer" element={<EmployerDashboard />} />
        <Route path="/applications/:jobId" element={<JobApplications />} />

        <Route path="/dashboard/jobseeker" element={<JobSeekerDashboard />} />
      </Route>
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/job/:jobId" element={<PreviewJob />} />

      <Route path="*" element={<NotFound404 />} />
    </Routes>
  );
}

export default App;
