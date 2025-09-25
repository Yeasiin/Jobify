import { Button } from "./ui/button";

export default function CTASection() {
  return (
    <div className="py-12 bg-[#e7f6ff]">
      <div className="container mx-auto">
        <div className="bg-white rounded-2xl px-5 py-8">
          <div className="flex justify-between items-center">
            <div className="">
              <h4 className="text-xl font-bold">
                Ready to connect with top talent?
              </h4>
              <p>
                Join thousands of employers and candidates using CareersHub
                today.
              </p>
            </div>
            <div className="flex gap-4">
              <Button>
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
                    d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                  />
                </svg>
                Create your free account
              </Button>
              <Button variant={"secondary"}>Explore Jobs</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
