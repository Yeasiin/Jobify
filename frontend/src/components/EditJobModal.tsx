import { jobApi } from "@/api/jobApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { JobPostSchema, type JobCreateInput } from "@/pages/CreateJob";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { JobType } from "@/pages/EmployerDashboard";
import { toast } from "sonner";

type EditJobModalProps = {
  isVisible: boolean;
  selectedJob: JobType | undefined;
  handleClose: Dispatch<SetStateAction<boolean>>;
};

export function EditJobModal({
  isVisible,
  selectedJob,
  handleClose,
}: EditJobModalProps) {
  const queryClient = useQueryClient();
  const categories = useQuery({
    queryFn: jobApi.getCategory,
    queryKey: ["categories"],
  });

  const updateJob = useMutation({
    mutationFn: jobApi.updatePost,
    onMutate: () => toast.loading("Loading...", { id: "updateJob" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getOwnJobs"] });
      toast.success("Job Information updated successfully.", {
        id: "updateJob",
      });
      handleClose(false);
    },
    onError: (error) => {
      console.log(error, "error--");
      toast.error(
        error.response?.data?.data ||
          "Failed to update job. Something went wrong...",
        {
          id: "updateJob",
        }
      );
    },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<JobCreateInput>({
    resolver: zodResolver(JobPostSchema),
    defaultValues: {
      title: selectedJob?.title,
      company_name: selectedJob?.company_name,
      description: selectedJob?.description,
      requirements: selectedJob?.requirements,
      location: selectedJob?.location,
      category: selectedJob?.category,
    },
  });

  const onSubmit = (data: JobCreateInput) => {
    if (selectedJob) updateJob.mutate({ jobId: selectedJob.id, data });
  };

  return (
    <Dialog open={isVisible} onOpenChange={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="sm:max-w-[500px]  overflow-y-auto max-h-screen"
        >
          <DialogHeader>
            <DialogTitle>Edit Job</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <form method="POST" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <Label className="mb-1.5">Job Title</Label>
                <Input {...register("title")} placeholder="Enter job title" />
                <p className="text-red-400 text-sm">{errors.title?.message}</p>
              </div>

              <div className="mb-4">
                <Label className="mb-1.5">Company Name</Label>
                <Input
                  {...register("company_name")}
                  placeholder="Enter Company Name"
                />
                <p className="text-red-400 text-sm">
                  {errors.company_name?.message}
                </p>
              </div>

              <div className="mb-4">
                <Label className="mb-1.5">Location</Label>
                <Input {...register("location")} placeholder="Enter Location" />
                <p className="text-red-400 text-sm">
                  {errors.location?.message}
                </p>
              </div>

              <div className="mb-4">
                <Label className="mb-1.5">Category</Label>

                {categories.isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Loading categories...
                    </span>
                  </div>
                ) : (
                  <Controller
                    control={control}
                    name="category"
                    render={({ field }) => (
                      <Select
                        onValueChange={(val) => field.onChange(val)}
                        value={field.value || ""}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.data?.map(
                            (category: { id: number; name: string }) => (
                              <SelectItem
                                key={category.id}
                                value={category.name}
                              >
                                {category.name}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                )}
                <p className="text-red-400 text-sm">
                  {errors.category?.message}
                </p>
              </div>

              <div className="mb-4">
                <Label className="mb-1.5">Description</Label>
                <Textarea
                  {...register("description")}
                  placeholder="Enter Description"
                />
                <p className="text-red-400 text-sm">
                  {errors.description?.message}
                </p>
              </div>

              <div className="mb-4">
                <Label className="mb-1.5">Requirements</Label>
                <Textarea
                  {...register("requirements")}
                  placeholder="Enter Requirements"
                />
                <p className="text-red-400 text-sm">
                  {errors.requirements?.message}
                </p>
              </div>
            </form>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleSubmit(onSubmit)}
              className="cursor-pointer"
              type="submit"
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
