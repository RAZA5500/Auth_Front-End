import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, Eye, EyeOff, Shield, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { loginUser, setAuth } from "../utils/api.js";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginUser(form);
      setAuth(data.accessToken, data.user, data.refreshToken);
      toast.success("Welcome back! Signed in successfully.");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Background Ambience */}
      <div className="landing-bg page-bg">
        <div className="grid-overlay" />
        <div className="glow-orb glow-orb-1" />
        <div className="glow-orb glow-orb-2" />
        <div className="glow-orb glow-orb-3" />
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-badge">
            <Shield size={28} />
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your AuthFlow dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="field-label">
              <Mail size={15} className="text-indigo-400" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              className="field-input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="name@company.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="field-label mb-0">
                <Lock size={15} className="text-indigo-400" />
                <span>Password</span>
              </label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="field-input pr-11"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors p-1 rounded-md"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full mt-6"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="modal-spinner" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <LogIn size={18} />
                <span>Sign In to Account</span>
              </>
            )}
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account yet?{" "}
          <Link to="/signup" className="auth-link">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
