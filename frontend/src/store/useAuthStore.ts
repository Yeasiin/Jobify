import { create } from "zustand"
import { produce } from "immer"
import { jwtDecode } from "jwt-decode"

type DecodedToken = {
    exp: number
    [key: string]: any
}

type UserType = {
    pk: number;
    email: string;
    first_name: string;
    last_name: string;
    user_type: "Job Seeker" | "Employer";
}

type AuthStoreState = {
    isAuthenticated: boolean;
    token: undefined | string;
    user: undefined | UserType
}
type LoginArg = { access: string; refresh: string; user: UserType }


type AuthStoreActions = {
    login: (data: LoginArg) => void
    logout: () => void
}

type AuthStore = AuthStoreState & AuthStoreActions

export function fetchInfo(): {
    isAuthenticated: boolean;
    token: undefined | string;
    user: undefined | UserType
} {
    const token = localStorage.getItem("auth-token") || ""

    try {
        const decoded = jwtDecode<DecodedToken>(token)
        if (decoded.exp * 1000 < Date.now()) {
            // expired
            localStorage.removeItem("auth-token")
            localStorage.removeItem("user-info")
            return { isAuthenticated: false, token: undefined, user: undefined }
        }
        const userInfo = JSON.parse(localStorage.getItem("user-info") || "")
        return { isAuthenticated: true, token, user: userInfo }
    } catch (err) {
        // invalid token
        localStorage.removeItem("auth-token")
        localStorage.removeItem("user-info")
        return { isAuthenticated: false, token: undefined, user: undefined }
    }
}

export const useAuthStore = create<AuthStore>()((set) => {
    const initial = fetchInfo()
    return {
        token: initial.token,
        user: initial.user,
        isAuthenticated: initial.isAuthenticated,
        login: (data: LoginArg) => {
            localStorage.setItem("auth-token", data.access)
            localStorage.setItem("user-info", JSON.stringify(data.user))
            set({
                token: data.access,
                isAuthenticated: true,
                user: data.user
            })
        },
        logout: () => {
            localStorage.removeItem("auth-token")
            localStorage.removeItem("user-info")
            set({
                isAuthenticated: false,
                token: undefined,
                user: undefined
            })
        }
    }
})