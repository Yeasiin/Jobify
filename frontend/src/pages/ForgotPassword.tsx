import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router";

export default function ForgotPassword() {
  return (
    <div className="container max-w-sm mx-auto">
      <div className="mt-24 mb-12">
        <h4 className="text-3xl font-bold mb-6">Forgot Password</h4>
        <div className="mb-4">
          <Label className="mb-2">Email</Label>
          <Input type="text" placeholder="Enter your email" />
        </div>

        <Button className="w-full bg-[#2A9156] hover:bg-[#227747]" size={"sm"}>
          Reset Password
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
