import type { RegisterInput } from "@/pages/Registration";
import { publicApi } from "./axios";
import type { LoginInput } from "@/pages/Login";

export const authApi = {
    register: (data: RegisterInput) => publicApi.post('/auth/registration', data),
    login: (data: LoginInput) => publicApi.post('/auth/login', data)
}