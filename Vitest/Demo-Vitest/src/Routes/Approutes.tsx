import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Home />} />
      {/* Redirect any other path to login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
