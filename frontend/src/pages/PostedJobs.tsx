import Navbar from "@/components/Navbar";

export default function PostedJobs() {
  return (
    <div>
      <Navbar />
      <div className="max-w-xl mx-auto py-10">
        <h1 className="text-xl font-bold mb-2">Posted Jobs</h1>

        <div className="">
          <JobCard />
          <JobCard />
          <JobCard />
        </div>
      </div>
    </div>
  );
}

function JobCard() {
  return (
    <div className="p-4 border border-gray-200 rounded-md shadow-sm mb-2.5">
      <div className="mb-2 flex justify-between items-center">
        <h2 className="text-lg font-semibold ">Software Engineer</h2>
        <div className="flex gap-4">
          <button className="">❌</button>
          <button className="">📝</button>
          <button className="">👁</button>
        </div>
      </div>
      <p className="text-gray-600 mb-1">Company: TechCorp</p>
      <p className="text-gray-600 mb-1">Location: New York, NY</p>
      <p className="text-gray-600 mb-1">Category: Engineering</p>
      <p className="text-gray-700">
        We are looking for a skilled Software Engineer to join our dynamic
        team...
      </p>
    </div>
  );
}
