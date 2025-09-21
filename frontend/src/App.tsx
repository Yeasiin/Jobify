import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/login";
import Registration from "./pages/registration";
import ForgotPassword from "./pages/forgotPassword";

function App() {
  return (
    <Routes>
      <Route index element={<Navigate to={"/login"} replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/forgot" element={<ForgotPassword />} />
    </Routes>
  );
}

export default App;
