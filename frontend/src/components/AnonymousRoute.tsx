import { useAuthStore } from "@/store/useAuthStore";
import { Navigate, Outlet, useLocation } from "react-router";

type AnonymousRouteProps = {
  redirectPath?: string;
};
export default function AnonymousRoute({
  redirectPath = "/",
}: AnonymousRouteProps) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  return isAuthenticated ? (
    <Navigate to={redirectPath} replace state={{ from: location }} />
  ) : (
    <Outlet />
  );
}
