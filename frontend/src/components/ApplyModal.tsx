import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { jobApi } from "@/api/jobApi";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type ApplyModalProps = {
  isVisible: boolean;
  handleClose: () => void;
};

const applySchema = z.object({
  resume: z
    .custom<FileList>()
    .transform((fileList) => fileList?.[0]) // take the first file
    .refine((file) => file instanceof File, {
      message: "Please upload a valid PDF file",
    })
    .refine((file) => file?.type === "application/pdf", {
      message: "Only PDF files are allowed",
    }),
  cover_letter: z
    .string()
    .min(10, "Cover letter must be at least 10 characters long")
    .max(2000, "Cover letter too long"),
  experience: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Experience must be a valid non-negative number",
    }),
  expected_salary: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Expected salary must be a positive number",
    }),
  link: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^https?:\/\/[^\s]+$/.test(val),
      "Please enter a valid URL"
    ),
  job_id: z.number(),
});
export type ApplyInputType = z.infer<typeof applySchema>;

export default function ApplyModal({
  isVisible,
  handleClose,
}: ApplyModalProps) {
  const queryClient = useQueryClient();
  const { jobId } = useParams();
  const jobIdNumber = jobId ? Number(jobId) : undefined;

  const applyMutation = useMutation({
    mutationFn: jobApi.applyToJob,
    onMutate: () => toast.loading("Loading...", { id: "applyJob" }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["getJob"] });
      toast.success("Job Applied Successfully.", {
        id: "applyJob",
      });
      handleClose();
    },
    onError: (error) => {
      const errorData = error.response?.data?.data;
      console.log(error.response);

      if (errorData) {
        const messages = Object.values(errorData)
          .flat() // in case some fields have multiple messages
          .filter((msg) => typeof msg === "string"); // only keep text messages

        messages.forEach((msg) =>
          toast.error(msg, {
            id: "applyJob",
          })
        ); // show each with toast
      } else {
        toast.error("Something went wrong. Please try again.", {
          id: "applyJob",
        });
      }
    },
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ApplyInputType>({
    resolver: zodResolver(applySchema),
    defaultValues: {
      cover_letter: "",
      experience: "",
      expected_salary: "",
      link: "",
      job_id: jobIdNumber,
    },
  });

  const onSubmit = (data: ApplyInputType) => {
    applyMutation.mutate(data);
  };

  return (
    <div>
      <Dialog open={isVisible} onOpenChange={handleClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent
            onOpenAutoFocus={(e) => e.preventDefault()}
            className="sm:max-w-[500px]  overflow-y-auto max-h-screen"
          >
            <DialogHeader>
              <DialogTitle>Apply</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4">
              {/*  */}
              <div className="mb-1">
                <Label className="mb-1.5">Resume</Label>
                <Input
                  type="file"
                  accept="application/pdf"
                  {...register("resume", {
                    required: "PDF file is required",
                  })}
                  placeholder="Year of experience"
                />
                <p className="text-red-400 text-sm">{errors.resume?.message}</p>
              </div>
              {/*  */}
              <div className="mb-1">
                <Label className="mb-1.5">Year of experience</Label>
                <Input
                  {...register("experience")}
                  type="number"
                  placeholder="Year of experience"
                />
                <p className="text-red-400 text-sm">
                  {errors.experience?.message}
                </p>
              </div>
              {/*  */}
              <div className="mb-1">
                <Label className="mb-1.5">Expected salary</Label>
                <Input
                  {...register("expected_salary")}
                  placeholder="Expected salary"
                />
                <p className="text-red-400 text-sm">
                  {errors.expected_salary?.message}
                </p>
              </div>
              {/*  */}
              <div className="mb-1">
                <Label className="mb-1.5">Cover Letter</Label>
                <Textarea
                  {...register("cover_letter")}
                  placeholder="Cover Letter"
                />
                <p className="text-red-400 text-sm">
                  {errors.cover_letter?.message}
                </p>
              </div>
              {/*  */}
              <div className="mb-1">
                <Label className="mb-1.5">Link</Label>
                <Input
                  {...register("link")}
                  placeholder="eg. https://github.com/<username>"
                />
                <p className="text-red-400 text-sm">{errors.link?.message}</p>
              </div>
              {/*  */}
              <input
                type="hidden"
                {...register("job_id")}
                value={jobIdNumber}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                onClick={handleSubmit(onSubmit)}
                className="cursor-pointer"
                type="submit"
                disabled={applyMutation.isPending}
              >
                {applyMutation.isPending ? "Applying..." : "Apply"}
                {applyMutation.isPending && (
                  <Loader2 className="animate-spin h-5 w-5 text-white" />
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
}
