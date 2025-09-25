import type { RegisterInput } from "@/pages/registration";
import { publicApi } from "./axios";

export const authApi = {
    register: (data: RegisterInput) => publicApi.post('/auth/registration', data)
}