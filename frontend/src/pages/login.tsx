import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router";

export default function Login() {
  return (
    <div className="container max-w-sm mx-auto">
      <div className="mt-24 mb-12">
        <h4 className="text-3xl font-bold mb-6">Login</h4>
        <div className="mb-4">
          <Label className="mb-2">Email</Label>
          <Input type="text" placeholder="Enter your email" />
        </div>

        <div className="mb-5">
          <Label className="mb-2">Password</Label>
          <Input type="password" placeholder="Enter password" />
          <p className="text-xs text-right text-[#2A9156]">
            <Link to={"/forgot"}>Forgot Password?</Link>
          </p>
        </div>
        <Button className="w-full" size={"sm"}>
          Login
        </Button>
        <p className="mt-3 text-sm">
          Don't have an account?{" "}
          <Link className="text-[#2A9156]" to={"/registration"}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
