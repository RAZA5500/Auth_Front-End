import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { signupUser, loginUser, setAuth } from "../utils/api.js";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signupUser(form);
      const loginData = await loginUser({ email: form.email, password: form.password });
      setAuth(loginData.token, loginData.user);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page flex min-h-screen items-center justify-center px-4 py-24">
      <div className="auth-card animate-fade-up">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join AuthFlow today</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="field-label">
              <User size={16} />
              Name
            </label>
            <input
              type="text"
              className="field-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="field-label">
              <Mail size={16} />
              Email
            </label>
            <input
              type="email"
              className="field-input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="field-label">
              <Lock size={16} />
              Password
            </label>
            <input
              type="password"
              className="field-input"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Create a password"
              minLength={6}
              required
            />
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            <UserPlus size={18} />
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
