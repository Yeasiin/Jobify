import { useAuthStore } from "@/store/useAuthStore";
import { Navigate, Outlet, useLocation } from "react-router";

type ProtectedRouteProps = {
  redirectPath?: string;
};
export default function ProtectedRoute({
  redirectPath = "/login",
}: ProtectedRouteProps) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={redirectPath} replace state={{ from: location }} />
  );
}
