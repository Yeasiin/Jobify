import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/store/useAuthStore";
import { useLayoutEffect } from "react";
import { useNavigate } from "react-router";

export default function EmployerDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (user?.user_type === "Job Seeker") {
      navigate("/dashboard/jobseeker");
    }
  }, [user?.user_type, navigate]);

  return (
    <div>
      <Navbar />

      <div className="max-w-xl mx-auto">
        {/*  */}
        ---
      </div>
    </div>
  );
}
