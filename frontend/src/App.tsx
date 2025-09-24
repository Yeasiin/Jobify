import { Routes, Route } from "react-router";
import Login from "./pages/login";
import Registration from "./pages/registration";
import ForgotPassword from "./pages/forgotPassword";
import Home from "./pages/home";

function App() {
  return (
    <Routes>
      {/* <Route index element={<Navigate to={"/"} replace />} /> */}
      <Route path="/" index element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/forgot" element={<ForgotPassword />} />
    </Routes>
  );
}

export default App;
