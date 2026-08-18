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
  // Ping the backend on app load to wake up the Vercel serverless function
  // from cold start — so it's ready by the time the user submits a form.
  useEffect(() => {
    warmUpServer();
  }, []);

  return (
    <>
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: 'linear-gradient(135deg, #1c1630, #141024)',
            color: '#f5f0ff',
            border: '1px solid rgba(139, 92, 246, 0.35)',
            borderRadius: '12px',
            fontWeight: '600',
            boxShadow: '0 12px 40px rgba(139, 92, 246, 0.2)',
          },
          success: {
            iconTheme: { primary: '#a78bfa', secondary: '#141024' },
          },
          error: {
            iconTheme: { primary: '#f87171', secondary: '#141024' },
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
