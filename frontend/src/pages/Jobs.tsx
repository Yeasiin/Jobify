import { jobApi } from "@/api/jobApi";
import Navbar from "@/components/Navbar";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import type { JobType } from "./EmployerDashboard";
import { Link } from "react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function Jobs() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useQuery({
    queryFn: jobApi.getCategory,
    queryKey: ["categories"],
  });

  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["getInfiniteJobs", selectedCategory],
    queryFn: ({ pageParam = 1 }) =>
      jobApi.getJobs({
        pageParam,
        pageSize: 2,
        category: selectedCategory || "",
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        const url = new URL(lastPage.next);
        return Number(url.searchParams.get("page"));
      }
      return undefined;
    },
    select: (data) => ({
      ...data,
      pages: data.pages.flatMap((page) => page.data),
    }),
  });

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value === "All Jobs" ? null : value);
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-xl mx-auto pb-10 pt-6">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="animate-spin h-7 w-7 text-gray-500" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-xl font-bold ">Jobs</h1>

              {categories.isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Loading categories...
                  </span>
                </div>
              ) : (
                <Select onValueChange={handleCategoryChange}>
                  <SelectTrigger className="">
                    <SelectValue placeholder="All Jobs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Jobs">All Jobs</SelectItem>
                    {categories?.data?.map(
                      (category: { id: number; name: string }) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="">
              {data?.pages.length === 0 && (
                <h4>
                  Currently No Job Available{" "}
                  {selectedCategory && `For ${selectedCategory}`}{" "}
                </h4>
              )}
              {data?.pages?.map((jobInfo) => (
                <JobCard key={jobInfo.id} data={jobInfo} />
              ))}
              {hasNextPage && (
                <button
                  className="border w-full rounded text-sm py-1.5 bg-gray-100 font-medium cursor-pointer"
                  disabled={isLoading}
                  onClick={() => fetchNextPage()}
                >
                  {isLoading ? (
                    <div className="flex justify-center">
                      <Loader2 className="animate-spin h-4 w-4 text-gray-500" />
                    </div>
                  ) : (
                    "Load More"
                  )}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function JobCard({ data }: { data: JobType }) {
  return (
    <Link to={`/job/${data.id}`}>
      <div className="p-4 border border-gray-200 rounded-md shadow-sm mb-2.5">
        <div className="mb-2 flex justify-between items-center">
          <h2 className="text-lg font-semibold ">{data.title}</h2>
        </div>
        <p className="text-gray-600 mb-1">
          <span className="font-medium">Company</span>: {data.company_name}
        </p>
        <p className="text-gray-600 mb-1">
          <span className="font-medium">Location</span>:{data.location}
        </p>
        <p className="text-gray-600 mb-1">
          <span className="font-medium">Category</span>: {data.category}
        </p>
        <p className="text-gray-600 mb-1 text-sm">
          <span className="font-medium">Posted At</span>:{" "}
          {new Date(data.created_at).toLocaleDateString("en-GB")}
        </p>

        <p className="text-gray-700 line-clamp-2">
          <span className="font-medium">Description</span>: {data.description}
        </p>
      </div>
    </Link>
  );
}
