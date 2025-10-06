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
import { useMutation } from "@tanstack/react-query";
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
  cover_later: z
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
  job: z.number().optional(),
});
export type ApplyInputType = z.infer<typeof applySchema>;

export default function ApplyModal({
  isVisible,
  handleClose,
}: ApplyModalProps) {
  // const queryClient = useQueryClient();
  const { jobId } = useParams();
  const jobIdNumber = jobId ? Number(jobId) : undefined;

  const applyMutation = useMutation({
    mutationFn: jobApi.applyToJob,
    onMutate: () => toast.loading("Loading...", { id: "applyJob" }),
    onSuccess: (res) => {
      console.log(res, "-res-");
      toast.success("Job Applied Successfully.", {
        id: "applyJob",
      });
      handleClose();
    },
    onError: (error) => {
      console.log(error, "---error");
      toast.error(
        error.response?.data?.data ||
          "Failed to apply job. Something went wrong...",
        {
          id: "applyJob",
        }
      );
    },
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ApplyInputType>({
    resolver: zodResolver(applySchema),
    defaultValues: {
      cover_later: "",
      experience: "",
      expected_salary: "",
      link: "",
      job: jobIdNumber,
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
              <form method="POST" onSubmit={handleSubmit(onSubmit)}>
                {/*  */}
                <div className="mb-4">
                  <Label className="mb-1.5">Resume</Label>
                  <Input
                    type="file"
                    accept="application/pdf"
                    {...register("resume", {
                      required: "PDF file is required",
                    })}
                    placeholder="Year of experience"
                  />
                  <p className="text-red-400 text-sm">
                    {errors.resume?.message}
                  </p>
                </div>
                {/*  */}
                <div className="mb-4">
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
                <div className="mb-4">
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
                <div className="mb-4">
                  <Label className="mb-1.5">Cover later</Label>
                  <Textarea
                    {...register("cover_later")}
                    placeholder="Cover later"
                  />
                  <p className="text-red-400 text-sm">
                    {errors.cover_later?.message}
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
