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
import { useAuthStore } from "@/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";

const status = [
  { value: "pending", label: "Pending" },
  { value: "reviewing", label: "Reviewing" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "rejected", label: "Rejected" },
  { value: "accepted", label: "Accepted" },
];

export default function JobApplications() {
  const { user } = useAuthStore();
  const { jobId } = useParams();
  const navigate = useNavigate();

  const applicationsQuery = useQuery({
    queryFn: () => jobApi.getJobApplicant(jobId),
    queryKey: ["getApplicants", jobId],
  });

  const handleUpdateStatus = () => {
    //
  };

  useEffect(() => {
    if (user?.user_type === "Job Seeker") {
      navigate("/dashboard/jobseeker");
    }
  }, [user?.user_type, navigate]);

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4">
        <h4 className="font-medium text-2xl pt-4">Job Applicant</h4>
        {applicationsQuery.isLoading ? (
          <div className="flex justify-center py-5">
            <Loader2 className="animate-spin h-7 w-7 text-gray-500" />
          </div>
        ) : applicationsQuery.data?.data?.length !== 0 ? (
          <table className="table-auto w-full border-separate border-spacing-y-2.5">
            <thead className="bg-gray-200 ">
              <tr className="text-left">
                <th className="px-2 py-1 font-semibold text-center">Name</th>
                <th className="px-2 py-1 font-semibold text-center">Email</th>
                <th className="px-2 py-1 font-semibold text-center">
                  Expected Salary
                </th>
                <th className="px-2 py-1 font-semibold text-center">
                  Experience
                </th>
                <th className="px-2 py-1 font-semibold text-center">
                  Cover Letter
                </th>
                <th className="px-2 py-1 font-semibold text-center">Status</th>
                <th className="px-2 py-1 font-semibold text-center">Resume</th>
              </tr>
            </thead>
            <tbody className="">
              {applicationsQuery.data?.data?.map((applicant, index: number) => (
                <tr className={`${index % 2 === 0 ? "" : "bg-gray-100"}`}>
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
                    <Select
                      onValueChange={handleUpdateStatus}
                      value={applicant.status || ""}
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
                  <td className="text-center">
                    <Dialog>
                      <DialogTrigger className="underline">
                        Preview
                      </DialogTrigger>
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
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex justify-center flex-col items-center mt-4">
            <h4 className="font-medium text-lg mb-2">
              No one applied yet. Come back later
            </h4>
            <Button asChild>
              <Link to={"/dashboard/employer/"}>Create New Post</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
