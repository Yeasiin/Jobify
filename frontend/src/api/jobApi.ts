import type { JobCreateInput } from "@/pages/CreateJob";
import { api, publicApi } from "./axios";

export const jobApi = {
    getCategory: () => publicApi.get("/jobs/categories").then(data => data.data),
    getJobs: () => api.get("/jobs?page_size=100").then(data => data.data),
    getJob: (jobId: number) => api.get(`/jobs/${jobId}`).then(data => data.data),
    createPost: (data: JobCreateInput) => api.post("/jobs/", data),
    updatePost: ({ jobId, data }: { jobId: number; data: JobCreateInput }) => api.patch(`/jobs/${jobId}/`, data),
    deletePost: (jobId: number) => api.delete(`/jobs/${jobId}/`)
}