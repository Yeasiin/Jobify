import { jobApi } from "@/api/jobApi";
import DeleteJobPostConfirmation from "@/components/DeleteJobPostConfirmation";
import { EditJobModal } from "@/components/EditJobModal";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useLayoutEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

export type JobType = {
  id: number;
  title: string;
  company_name: string;
  description: string;
  requirements: string;
  location: string;
  category: string;
  created_at: string;
  created_by_name: string;
  applications_count: number;
};

export default function EmployerDashboard() {
  const queryClient = useQueryClient();
  const [isEditingJob, setIsEditingJob] = useState(false);
  const [selectedJob, setSelectJob] = useState<JobType>();

  const getJobQuery = useQuery({
    queryFn: jobApi.getOwnJobs,
    queryKey: ["getOwnJobs"],
  });

  const deleteJobMutation = useMutation({
    mutationFn: jobApi.deletePost,
    onMutate: () => toast.loading("Deleting...", { id: "getOwnJobs" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getOwnJobs"] });
      toast.success("Job deleted successfully.", {
        id: "getOwnJobs",
      });
    },
    onError: (error) => {
      console.log(error, "error--");

      toast.error(
        error.response?.data?.data ||
          "Failed to delete job. Something went wrong...",
        {
          id: "getOwnJobs",
        }
      );
    },
  });

  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleDelete = (postId: number) => {
    deleteJobMutation.mutate(postId);
  };

  useLayoutEffect(() => {
    if (user?.user_type === "Job Seeker") {
      navigate("/dashboard/jobseeker");
    }
  }, [user?.user_type, navigate]);

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4">
        {getJobQuery.isLoading ? (
          <div className="flex justify-center py-5">
            <Loader2 className="animate-spin h-7 w-7 text-gray-500" />
          </div>
        ) : getJobQuery.data?.data?.length !== 0 ? (
          <table className="table-auto w-full mt-4">
            <thead className="bg-gray-200 ">
              <tr className="text-left">
                <th className="px-2 py-1 font-semibold">Title</th>
                <th className="px-2 py-1 text-center font-semibold">
                  Date Posted
                </th>
                <th className="px-2 py-1 text-center font-semibold">
                  Applications
                </th>
                <th className="px-2 py-1 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {getJobQuery.data?.data?.map((each: JobType, index: number) => (
                <tr
                  key={each.id}
                  className={`${
                    index % 2 == 1 && "bg-gray-50"
                  } hover:bg-gray-100`}
                >
                  <td className="px-2 py-1">{each.title}</td>
                  <td className="px-2 py-1 text-center">
                    {new Date(each.created_at).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-2 py-1 text-center ">
                    <button className="underline cursor-pointer hover:text-blue-500">
                      {each.applications_count}
                    </button>
                  </td>
                  <td className="px-2 py-1 ">
                    <div className="flex gap-3 justify-center">
                      <Link
                        to={`/job/${each.id}`}
                        className="hover:underline hover:text-blue-400"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => {
                          setIsEditingJob(true);
                          setSelectJob(each);
                        }}
                        className="hover:underline hover:text-blue-400"
                      >
                        Edit
                      </button>

                      {deleteJobMutation.isPending ? (
                        <Loader2 className="animate-spin h-5 w-5 text-gray-500" />
                      ) : (
                        <DeleteJobPostConfirmation
                          handleDelete={handleDelete.bind(null, each.id)}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex justify-center flex-col items-center mt-4">
            <h4 className="font-medium text-lg mb-2">
              You don't have any post yet
            </h4>
            <Button asChild>
              <Link to={"/createJob"}>Create New Post</Link>
            </Button>
          </div>
        )}
      </div>
      {isEditingJob && (
        <EditJobModal
          isVisible={isEditingJob}
          selectedJob={selectedJob}
          handleClose={setIsEditingJob.bind(false)}
        />
      )}
    </div>
  );
}
