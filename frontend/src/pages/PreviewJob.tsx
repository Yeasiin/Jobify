import { jobApi } from "@/api/jobApi";
import Navbar from "@/components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router";
import type { JobType } from "./EmployerDashboard";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";

export default function PreviewJob() {
  const { jobId } = useParams();
  const { user, isAuthenticated } = useAuthStore();
  const jobIdNumber = jobId ? Number(jobId) : undefined;

  const jobQuery = useQuery<JobType>({
    queryKey: ["getJob", jobIdNumber],
    queryFn:
      jobIdNumber !== undefined ? () => jobApi.getJob(jobIdNumber) : undefined,
    enabled: !!jobIdNumber,
  });

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 pt-4">
        {jobQuery.isLoading ? (
          <div className="flex justify-center py-5">
            <Loader2 className="animate-spin h-7 w-7 text-gray-500" />
          </div>
        ) : jobQuery.data ? (
          <>
            <h4 className="text-xl font-medium mb-2">{jobQuery.data.title}</h4>
            <div className="flex gap-6 items-center mb-2">
              <span className="inline-flex gap-2 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
                  />
                </svg>
                <span className="font-medium">
                  {jobQuery.data.company_name}
                </span>
              </span>
              <span className="inline-flex gap-2 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
                <span className="font-medium">{jobQuery.data.location}</span>
              </span>
              <span className="inline-flex gap-2 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>

                <span className="font-medium">
                  {new Date(jobQuery.data.created_at).toLocaleDateString(
                    "en-GB"
                  )}
                </span>
              </span>
              <span className="inline-flex gap-2 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 6h.008v.008H6V6Z"
                  />
                </svg>
                <span className="font-medium">{jobQuery.data.category}</span>
              </span>
            </div>
            <p className="mb-4 text-gray-500">
              {jobQuery.data.applications_count} People applied
            </p>
            <div className="mb-4">
              <h4 className="font-medium">Job Description</h4>
              <p className="whitespace-pre-line">{jobQuery.data.description}</p>
            </div>
            <div className="mb-6">
              <h4 className="font-medium">Job Requirements</h4>
              <p className="whitespace-pre-line">
                {jobQuery.data.requirements}
              </p>
            </div>

            <div className="flex flex-col items-start">
              <Button
                disabled={user?.user_type === "Employer" || !isAuthenticated}
              >
                Apply Now
              </Button>
              {user?.user_type === "Employer" && (
                <small>You can't apply as you are using employee account</small>
              )}
              {!isAuthenticated && (
                <small>You can't apply as you are not logged yet</small>
              )}
            </div>
          </>
        ) : (
          <div className="flex justify-center flex-col items-center mt-4">
            <h4 className="font-medium text-lg mb-2">Something went wrong</h4>
          </div>
        )}
      </div>
    </div>
  );
}
