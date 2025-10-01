import type { JobCreateInput } from "@/pages/CreateJob";
import { api, publicApi } from "./axios";

export const jobApi = {
    getCategory: () => publicApi.get("/jobs/categories").then(data => data.data),
    getPost: () => api.get("/jobs"),
    createPost: (data: JobCreateInput) => api.post("/jobs/", data)
}