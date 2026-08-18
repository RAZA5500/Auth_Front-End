import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar.jsx";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Dashboard from "./components/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { warmUpServer } from "./utils/api.js";

function App() {
  // Ping the backend on app load to wake up serverless function from cold start
  useEffect(() => {
    warmUpServer();
  }, []);

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "linear-gradient(135deg, rgba(22, 31, 66, 0.95), rgba(13, 19, 44, 0.98))",
            color: "#f8fafc",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "14px",
            fontWeight: "600",
            fontSize: "0.92rem",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6), 0 0 25px rgba(99, 102, 241, 0.25)",
            backdropFilter: "blur(16px)",
            padding: "12px 18px",
          },
          success: {
            iconTheme: { primary: "#10b981", secondary: "#0f172a" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#0f172a" },
          },
        }}
      />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
