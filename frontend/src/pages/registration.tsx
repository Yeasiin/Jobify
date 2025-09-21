import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router";

export default function Registration() {
  return (
    <div className="container max-w-sm mx-auto">
      <div className="mt-12 mb-12">
        <h4 className="text-3xl font-bold mb-6">Registration</h4>
        <div className="mb-4">
          <Label className="mb-2">First Name</Label>
          <Input type="text" placeholder="Enter first name" />
        </div>
        <div className="mb-4">
          <Label className="mb-2">Last Name</Label>
          <Input type="text" placeholder="Enter last name" />
        </div>

        <div className="mb-4">
          <Label className="mb-2">Email</Label>
          <Input type="text" placeholder="Enter your email" />
        </div>
        <div className="mb-4">
          <Label className="mb-2">Account Type</Label>
          <Input type="text" placeholder="Enter your email" />
        </div>

        <div className="mb-5">
          <Label className="mb-2">Password</Label>
          <Input type="password" placeholder="Enter password" />
        </div>
        <div className="mb-5">
          <Label className="mb-2">Confirm Password</Label>
          <Input type="password" placeholder="Confirm password" />
        </div>
        <Button className="w-full bg-[#2A9156] hover:bg-[#227747]" size={"sm"}>
          Login
        </Button>
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
