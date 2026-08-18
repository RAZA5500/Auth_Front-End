import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, UserPlus, Eye, EyeOff, ShieldCheck, Check, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { signupUser, loginUser, setAuth } from "../utils/api.js";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const calculatePasswordStrength = (pwd) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 6) score += 25;
    if (pwd.length >= 10) score += 25;
    if (/[A-Z]/.test(pwd)) score += 25;
    if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score += 25;
    return score;
  };

  const strength = calculatePasswordStrength(form.password);

  const getStrengthMeta = (val) => {
    if (val <= 25) return { color: "#ef4444", text: "Weak" };
    if (val <= 50) return { color: "#f59e0b", text: "Fair" };
    if (val <= 75) return { color: "#3b82f6", text: "Good" };
    return { color: "#10b981", text: "Strong" };
  };

  const strengthMeta = getStrengthMeta(strength);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signupUser(form);
      const loginData = await loginUser({ email: form.email, password: form.password });
      setAuth(loginData.accessToken, loginData.user, loginData.refreshToken);
      toast.success("Account created successfully! Welcome aboard.");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Failed to create account");
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
            <UserPlus size={28} />
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join AuthFlow for next-gen authentication</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="field-label">
              <User size={15} className="text-indigo-400" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              className="field-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Alex Morgan"
              required
              autoComplete="name"
            />
          </div>

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
            <label className="field-label">
              <Lock size={15} className="text-indigo-400" />
              <span>Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="field-input pr-11"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Create a strong password"
                minLength={6}
                required
                autoComplete="new-password"
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

            {/* Real-time Password Strength Meter */}
            {form.password && (
              <div className="mt-2.5 animate-fade-in">
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="text-zinc-400">Password Strength:</span>
                  <span style={{ color: strengthMeta.color }}>{strengthMeta.text}</span>
                </div>
                <div className="password-strength">
                  <div
                    className="password-strength-bar"
                    style={{
                      width: `${strength}%`,
                      backgroundColor: strengthMeta.color,
                    }}
                  />
                </div>
                
                {/* Visual criteria checklist */}
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border ${form.password.length >= 6 ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" : "border-white/5 bg-slate-900/60 text-zinc-400"}`}>
                    {form.password.length >= 6 && <Check size={11} />} 6+ chars
                  </span>
                  <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border ${/[A-Z]/.test(form.password) ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" : "border-white/5 bg-slate-900/60 text-zinc-400"}`}>
                    {/[A-Z]/.test(form.password) && <Check size={11} />} Uppercase
                  </span>
                  <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border ${/[0-9]/.test(form.password) ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" : "border-white/5 bg-slate-900/60 text-zinc-400"}`}>
                    {/[0-9]/.test(form.password) && <Check size={11} />} Number
                  </span>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn-primary w-full mt-6"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="modal-spinner" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Create Free Account</span>
              </>
            )}
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
