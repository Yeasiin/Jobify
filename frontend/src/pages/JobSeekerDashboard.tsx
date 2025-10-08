import { jobApi } from "@/api/jobApi";
import Navbar from "@/components/Navbar";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router";

export default function JobSeekerDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const appliedJobs = useQuery({
    queryFn: jobApi.appliedJobs,
    queryKey: ["appliedJobs"],
  });

  useEffect(() => {
    if (user?.user_type === "Employer") {
      navigate("/dashboard/employer");
    }
  }, [user?.user_type, navigate]);

  return (
    <div>
      <Navbar />
      <div className="max-w-xl mx-auto">
        {/*  */}
        {appliedJobs.isLoading ? (
          <div className="flex justify-center py-5">
            <Loader2 className="animate-spin h-7 w-7 text-gray-500" />
          </div>
        ) : appliedJobs.data?.data?.length !== 0 ? (
          <table className="table-auto w-full mt-4 border-separate border-spacing-y-2">
            <thead className="bg-gray-200 ">
              <tr className="text-left">
                <th className="px-2 py-1 font-semibold text-center">Title</th>
                <th className="px-2 py-1 font-semibold text-center">Company</th>
                <th className="px-2 py-1 font-semibold text-center">
                  Location
                </th>
                <th className="px-2 py-1 font-semibold text-center">
                  Category
                </th>
                <th className="px-2 py-1 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {appliedJobs.data?.data?.map((job, index: number) => (
                <tr className="odd:bg-white even:bg-gray-100">
                  <td className="px-2 py-1 text-center">{job.job.title}</td>
                  <td className="px-2 py-1 text-center">
                    {job.job.company_name}
                  </td>
                  <td className="px-2 py-1 text-center">{job.job.location}</td>
                  <td className="px-2 py-1 text-center">{job.job.category}</td>
                  <td className="capitalize text-center px-2 py-1">
                    <StatusBadge status={job.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex justify-center flex-col items-center mt-4">
            <h4 className="font-medium text-lg mb-2">
              You haven't applied for any jobs yet.
            </h4>
            <Button asChild>
              <Link to={"/jobs"}>Apply to jobs</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
