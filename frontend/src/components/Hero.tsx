import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function Hero() {
  return (
    <div className="">
      <div className="container mx-auto">
        <div className="flex items-center mt-4">
          <div className="flex-1">
            <h2 className="font-bold text-3xl">
              Hire Faster. Land better jobs.
            </h2>
            <p className="mt-1 mb-4 max-w-[60ch]">
              Connect with top talent and discover opportunities that match your
              goals—all in one place.
            </p>
            <div className="flex gap-4">
              <Button asChild>
                <Link to="/createJob">
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
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  Post a Job
                </Link>
              </Button>
              <Button asChild variant={"secondary"}>
                <Link to={"/jobs"}>
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
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                  Browse Jobs
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex-1">
            <img className="rounded" src="/image-1.jpg" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}
