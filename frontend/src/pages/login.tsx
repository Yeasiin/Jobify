import { authApi } from "@/api/authApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import z from "zod";

const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email")
    .transform((s) => s.toLowerCase().trim()),
  password: z.string(),
});

export type LoginInput = z.infer<typeof loginSchema>;

export default function Login() {
  const { login } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onMutate: () => toast.loading("Loading...", { id: "login" }),
    onSuccess: (data) => {
      login(data.data);
      navigate(from, { replace: true });
      toast.success("Login successful. Redirecting...", {
        id: "login",
      });
    },
    onError: (error) => {
      console.log(error, "error--");
      toast.error("Failed to logged in. Something went wrong...", {
        id: "login",
      });
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,

    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginInput) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="container max-w-sm mx-auto">
      <div className="mt-24 mb-12">
        <h4 className="text-3xl font-bold mb-6">Login</h4>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <Label className="mb-2">Email</Label>
            <Input
              {...register("email")}
              type="text"
              placeholder="Enter your email"
            />

            <p className="text-red-400 text-sm">
              {errors.email?.message}
              {loginMutation.error?.response?.data?.data?.email?.join("\n")}
            </p>
          </div>

          <div className="mb-5">
            <Label className="mb-2">Password</Label>
            <div className="relative">
              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-0 bottom-0 flex items-center cursor-pointer"
              >
                {showPassword ? (
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
              {errors.email?.message}
              {loginMutation.error?.response?.data?.data?.password?.join("\n")}
            </p>
            <p className="text-xs text-right text-[#2A9156]">
              <Link to={"/forgot"}>Forgot Password?</Link>
            </p>
          </div>
          <Button
            type="submit"
            className="w-full"
            size={"sm"}
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Logging..." : "Login"}
          </Button>
        </form>
        <p className="mt-3 text-sm">
          Don't have an account?{" "}
          <Link
            state={location.state}
            className="text-[#2A9156]"
            to={"/registration"}
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
