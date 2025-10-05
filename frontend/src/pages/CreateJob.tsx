import { jobApi } from "@/api/jobApi";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import z from "zod";

export const JobPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  company_name: z
    .string()
    .min(3, "Company name must be at least 3 characters long"),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters long"),
  requirements: z
    .string()
    .min(5, "Requirements must be at least 5 characters long"),
  location: z.string().min(2, "Location must be at least 2 characters long"),
  category: z.string(),
});

export type JobCreateInput = z.infer<typeof JobPostSchema>;

export default function CreateJob() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const categories = useQuery({
    queryFn: jobApi.getCategory,
    queryKey: ["categories"],
  });

  const jobPostMutation = useMutation({
    mutationFn: jobApi.createPost,
    onMutate: () => toast.loading("Loading...", { id: "createJob" }),
    onSuccess: () => {
      navigate("/dashboard/employer");
      queryClient.invalidateQueries({ queryKey: ["getJobs"] });
      toast.success("Job created successfully.", {
        id: "createJob",
      });
    },
    onError: (error) => {
      console.log(error, "error--");

      toast.error(
        error.response?.data?.data ||
          "Failed to create new job. Something went wrong...",
        {
          id: "createJob",
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
      title: "",
      company_name: "",
      description: "",
      requirements: "",
      location: "",
      category: "",
    },
  });

  const onSubmit = (data: JobCreateInput) => {
    jobPostMutation.mutate(data);
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-xl mx-auto">
        <div className="mt-8 mb-12 p-6 border border-gray-200 rounded-md shadow-sm">
          <h4 className="mb-4 text-xl font-semibold">Create A New Job</h4>
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
              <p className="text-red-400 text-sm">{errors.location?.message}</p>
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
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
              )}
              <p className="text-red-400 text-sm">{errors.category?.message}</p>
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

            <Button
              type="submit"
              className="cursor-pointer"
              disabled={jobPostMutation.isPending}
            >
              {jobPostMutation.isPending ? "Creating..." : "Create Job"}
              {jobPostMutation.isPending && (
                <Loader2 className="animate-spin h-5 w-5 ml-2" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
