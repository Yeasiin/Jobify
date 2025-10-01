import { jobApi } from "@/api/jobApi";
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
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

const JobPostSchema = z.object({
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
  const categories = useQuery({
    queryFn: jobApi.getCategory,
    queryKey: ["categories"],
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

  return (
    <div>
      <div className="max-w-xl mx-auto">
        <div className="mt-8">
          <h4 className="mb-4 text-xl font-semibold">Create A New Job</h4>
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
          </div>

          <div className="mb-4">
            <Label className="mb-1.5">Category</Label>
            {console.log(categories, "---")}
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
                      {categories.data?.map((category: any) => (
                        <SelectItem
                          key={category.id}
                          value={String(category.id)}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
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

          <Button>Submit </Button>
        </div>
      </div>
    </div>
  );
}
