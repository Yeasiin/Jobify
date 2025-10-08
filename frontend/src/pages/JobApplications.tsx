import { jobApi } from "@/api/jobApi";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore, type UserType } from "@/store/useAuthStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import type { JobType } from "./EmployerDashboard";

const status = [
  { value: "pending", label: "Pending" },
  { value: "reviewing", label: "Reviewing" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "rejected", label: "Rejected" },
  { value: "accepted", label: "Accepted" },
] as const;

type ApplicationType = {
  id: number;
  user: UserType;
  job: JobType;
  resume: string;
  cover_letter: string;
  experience: string;
  expected_salary: string;
  link: string;
  applied_at: string;
  status: (typeof status)[number]["value"];
};

export default function JobApplications() {
  const { user } = useAuthStore();
  const { jobId } = useParams();
  const navigate = useNavigate();

  const applicationsQuery = useQuery({
    queryFn: () => jobApi.getJobApplicant(jobId),
    queryKey: ["getApplicants", jobId],
  });

  useEffect(() => {
    if (user?.user_type === "Job Seeker") {
      navigate("/dashboard/jobseeker");
    }
  }, [user?.user_type, navigate]);

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4">
        {applicationsQuery.isLoading ? (
          <div className="flex justify-center py-5">
            <Loader2 className="animate-spin h-7 w-7 text-gray-500" />
          </div>
        ) : (
          applicationsQuery.data?.data?.length >= 1 && (
            <>
              <h4 className="font-medium text-2xl pt-4">Job Applicant</h4>
              <table className="table-auto w-full border-separate border-spacing-y-2.5">
                <thead className="bg-gray-200 ">
                  <tr className="text-left">
                    <th className="px-2 py-1 font-semibold text-center">
                      Name
                    </th>
                    <th className="px-2 py-1 font-semibold text-center">
                      Email
                    </th>
                    <th className="px-2 py-1 font-semibold text-center">
                      Expected Salary
                    </th>
                    <th className="px-2 py-1 font-semibold text-center">
                      Experience
                    </th>
                    <th className="px-2 py-1 font-semibold text-center">
                      Cover Letter
                    </th>
                    <th className="px-2 py-1 font-semibold text-center">
                      Resume
                    </th>
                    <th className="px-2 py-1 font-semibold text-center">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="">
                  {applicationsQuery.data?.data?.map(
                    (applicant: ApplicationType) => (
                      <SingleApplicant
                        key={applicant.id}
                        applicant={applicant}
                        jobId={jobId}
                      />
                    )
                  )}
                </tbody>
              </table>
            </>
          )
        )}
        {(applicationsQuery.isError ||
          applicationsQuery.data?.data?.length === 0) && (
          <div className="flex justify-center flex-col items-center mt-4">
            <h4 className="font-medium text-lg mb-2">
              No one applied yet. Come back later
            </h4>
            <Button asChild>
              <Link to={"/dashboard/employer/"}>Go Back</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function SingleApplicant({
  applicant,
  jobId,
}: {
  applicant: ApplicationType;
  jobId: string | undefined;
}) {
  const [applicationStatus, setApplicationStatus] = useState(
    applicant.status || ""
  );

  const queryClient = useQueryClient();
  const statusMutation = useMutation({
    mutationFn: jobApi.updateApplicantStatus,
    onMutate: () => toast.loading("Loading...", { id: "updateStatus" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getApplicants", jobId] });
      toast.success("Status Updated.", {
        id: "updateStatus",
      });
    },
    onError: (error) => {
      console.log(error, "error--");
      toast.error(
        error.response?.data?.data ||
          "Failed to create new job. Something went wrong...",
        { id: "updateStatus" }
      );
    },
  });

  const handleUpdateStatus = (arg: {
    status: string;
    job: number;
    application_id: number;
  }) => {
    setApplicationStatus(arg.status as (typeof status)[number]["value"]);
    statusMutation.mutate(arg);
  };
  return (
    <tr className={`even:bg-gray-100 odd:bg-white`}>
      <td className="px-2 py-1">
        <p>
          {applicant.user.first_name} {applicant.user.last_name}
        </p>
      </td>
      <td className="px-2 py-1">
        <p>{applicant.user.email}</p>
      </td>
      <td className="text-center px-2 py-1">
        <p>{applicant.expected_salary}</p>
      </td>
      <td className="text-center px-2 py-1">
        <p>{applicant.experience || "---"}</p>
      </td>
      <td className="text-center px-2 py-1">
        <Dialog>
          <DialogTrigger className="underline">View</DialogTrigger>
          <DialogContent>
            <div className="">
              <h4 className="font-semibold">Cover Letter</h4>
              <p>{applicant.cover_letter || "No Cover Letter"}</p>
            </div>
          </DialogContent>
        </Dialog>
      </td>

      <td className="text-center">
        <Dialog>
          <DialogTrigger className="underline">Preview</DialogTrigger>
          <DialogContent className="h-[80%]">
            {applicant.resume ? (
              <>
                <iframe
                  src={`https://docs.google.com/gview?url=${encodeURIComponent(
                    applicant.resume
                  )}&embedded=true`}
                  width="100%"
                  height="100%"
                />
              </>
            ) : (
              <p>No resume available</p>
            )}
          </DialogContent>
        </Dialog>
      </td>
      <td className="text-center">
        <Select
          onValueChange={(value) =>
            handleUpdateStatus({
              status: value,
              job: applicant.job.id,
              application_id: applicant.id,
            })
          }
          value={applicationStatus}
        >
          <SelectTrigger size="sm" className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {status.map((each) => (
              <SelectItem key={each.value} value={each.value}>
                {each.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>
    </tr>
  );
}
