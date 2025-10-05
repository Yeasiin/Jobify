import type { JobCreateInput } from "@/pages/CreateJob";
import { api, publicApi } from "./axios";

export const jobApi = {
    getCategory: () => publicApi.get("/jobs/categories").then(data => data.data),
    getOwnJobs: () => api.get("/jobs?mine=true&page_size=100").then(data => data.data),
    getJobs: ({ pageParam = 1, pageSize = 100, category }: { pageParam: number, pageSize: number; category?: string }) => api.get(`/jobs?${category ? `category=${encodeURIComponent(category)}&` : ""}page=${pageParam}&page_size=${pageSize}`).then(response => response.data),

    getJob: (jobId: number) => api.get(`/jobs/${jobId}`).then(data => data.data),
    createPost: (data: JobCreateInput) => api.post("/jobs/", data),
    updatePost: ({ jobId, data }: { jobId: number; data: JobCreateInput }) => api.patch(`/jobs/${jobId}/`, data),
    deletePost: (jobId: number) => api.delete(`/jobs/${jobId}/`)
}