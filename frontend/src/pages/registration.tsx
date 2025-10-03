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
import { Link, useLocation, useNavigate } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { authApi } from "@/api/authApi";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

const UserTypeEnum = z.enum(["Employer", "Job Seeker"]);

const registerSchema = z
  .object({
    first_name: z
      .string()
      .min(1, "First name is required")
      .max(100, "First name is too long")
      .transform((s) => s.trim()),
    last_name: z
      .string()
      .min(1, "Last name is required")
      .max(100, "Last name is too long")
      .transform((s) => s.trim()),
    email: z
      .string()
      .email("Please enter a valid email")
      .transform((s) => s.toLowerCase().trim()),
    user_type: UserTypeEnum,
    password1: z.string().min(8, "Password must be at least 8 characters"),
    password2: z.string().min(8, "Please confirm your password"),
  })
  .superRefine((data, ctx) => {
    if (data.password1 !== data.password2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["password2"],
      });
    }
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export default function Registration() {
  const location = useLocation();
  const from = location.state?.from?.pathname;
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const registrationMutation = useMutation({
    mutationFn: authApi.register,
    onMutate: () => toast.loading("Loading...", { id: "register" }),
    onSuccess: (data) => {
      // registration done now login from the returned data
      login(data.data);

      if (from && from !== "/login" && from !== "/registration") {
        navigate(from, { replace: true });
      } else {
        setTimeout(() => {
          if (data.data.user_type === "Job Seeker") {
            navigate("/dashboard/jobseeker", { replace: true });
          } else {
            navigate("/dashboard/employer", { replace: true });
          }
        }, 0);
      }

      toast.success("Account created successfully. Redirecting...", {
        id: "register",
      });
    },
    onError: (error) => {
      console.log(error, "error--");
      toast.error("Failed to create account. Something went wrong...", {
        id: "register",
      });
    },
  });

  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      user_type: "Job Seeker",
      password1: "",
      password2: "",
    },
  });

  const onSubmit = (data: RegisterInput) => {
    registrationMutation.mutate(data);
  };

  return (
    <div className="container max-w-sm mx-auto">
      <div className="mt-12 mb-12">
        <h4 className="text-3xl font-bold mb-6">Registration</h4>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <Label className="mb-2">First Name</Label>
            <Input
              {...register("first_name")}
              type="text"
              placeholder="Enter first name"
            />
            <p className="text-red-400 text-sm">
              {errors.first_name?.message}
              {registrationMutation.error?.response?.data?.data?.first_name?.join(
                "\n"
              )}
            </p>
          </div>
          <div className="mb-4">
            <Label className="mb-2">Last Name</Label>
            <Input
              {...register("last_name")}
              type="text"
              placeholder="Enter last name"
            />
            <p className="text-red-400 text-sm">
              {errors.last_name?.message}
              {registrationMutation.error?.response?.data?.data?.last_name?.join(
                "\n"
              )}
            </p>
          </div>

          <div className="mb-4">
            <Label className="mb-2">Email</Label>
            <Input
              {...register("email")}
              type="text"
              placeholder="Enter your email"
            />
            <p className="text-red-400 text-sm">
              {errors.email?.message}
              {registrationMutation.error?.response?.data?.data?.email?.join(
                "\n"
              )}
            </p>
          </div>
          <div className="mb-4 w-full">
            <Label className="mb-2">Account Type</Label>

            <Controller
              control={control}
              name="user_type"
              render={({ field: { onChange, value } }) => (
                <Select
                  onValueChange={onChange}
                  value={value}
                  defaultValue={value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Account Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Employer">Employer</SelectItem>
                    <SelectItem value="Job Seeker">Job Seeker</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <p className="text-red-400 text-sm">
              {errors.user_type?.message}
              {registrationMutation.error?.response?.data?.data?.user_type?.join(
                "\n"
              )}
            </p>
          </div>

          <div className="mb-5">
            <Label className="mb-2">Password</Label>
            <div className="relative">
              <Input
                {...register("password1")}
                type={showPassword1 ? "text" : "password"}
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword1((prev) => !prev)}
                className="absolute right-3 top-0 bottom-0 flex items-center cursor-pointer"
              >
                {showPassword1 ? (
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
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                ) : (
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
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                )}
              </button>
            </div>

            <p className="text-red-400 text-sm">
              {errors.password1?.message}
              {registrationMutation.error?.response?.data?.data?.password1?.join(
                "\n"
              )}
            </p>
          </div>
          <div className="mb-5">
            <Label className="mb-2">Confirm Password</Label>
            <div className="relative">
              <Input
                {...register("password2")}
                type={showPassword2 ? "text" : "password"}
                placeholder="Confirm password"
              />
              <button
                type="button"
                onClick={() => setShowPassword2((prev) => !prev)}
                className="absolute right-3 top-0 bottom-0 flex items-center cursor-pointer"
              >
                {showPassword2 ? (
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
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                ) : (
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
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-red-400 text-sm">
              {errors.password2?.message}
              {registrationMutation.error?.response?.data?.data?.password2?.join(
                "\n"
              )}
            </p>
          </div>
          <Button
            type="submit"
            className="w-full"
            size={"sm"}
            disabled={registrationMutation.isPending}
          >
            {registrationMutation.isPending ? "Registering..." : "Register"}
          </Button>
        </form>
        <p className="mt-3 text-sm">
          Already have an account?{" "}
          <Link className="text-[#2A9156]" to={"/login"}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
