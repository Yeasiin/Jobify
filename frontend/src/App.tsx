import { Routes, Route } from "react-router";
import Login from "./pages/login";
import Registration from "./pages/registration";
import ForgotPassword from "./pages/forgotPassword";
import Home from "./pages/home";
import NotFound404 from "./pages/404";
import ProtectedRoute from "./components/ProctedRoute";
import AnonymousRoute from "./components/AnonymousRoute";

function App() {
  return (
    <Routes>
      {/* <Route index element={<Navigate to={"/"} replace />} /> */}
      <Route path="/" index element={<Home />} />
      <Route element={<AnonymousRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/forgot" element={<ForgotPassword />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<h2>Hello from here? </h2>} />
      </Route>
      <Route path="*" element={<NotFound404 />} />
    </Routes>
  );
}

export default App;
