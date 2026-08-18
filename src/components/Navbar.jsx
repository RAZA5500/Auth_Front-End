import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Shield, Sparkles, LogOut, Palette, Check } from "lucide-react";
import { hasValidSession, clearAuth, logoutUser } from "../utils/api.js";

const THEMES = [
  { id: "theme-cosmic", name: "Cosmic Indigo", color: "#6366f1", dot: "bg-indigo-500" },
  { id: "theme-cyan", name: "Cyber Cyan", color: "#06b6d4", dot: "bg-cyan-400" },
  { id: "theme-rose", name: "Neon Rose", color: "#f43f5e", dot: "bg-rose-500" },
  { id: "theme-emerald", name: "Emerald Aurora", color: "#10b981", dot: "bg-emerald-400" },
];

const navLinkClass = ({ isActive }) =>
  isActive ? "nav-link nav-link-active" : "nav-link";

const navBtnClass = ({ isActive }) =>
  isActive ? "nav-btn nav-btn-active" : "nav-btn";

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = hasValidSession();
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem("authflow-theme") || "theme-cosmic";
  });
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  useEffect(() => {
    document.body.className = currentTheme;
    localStorage.setItem("authflow-theme", currentTheme);
  }, [currentTheme]);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // proceed with client-side logout
    } finally {
      clearAuth();
      navigate("/");
    }
  };

  return (
    <nav className="navbar fixed top-0 right-0 left-0 z-50">
      <div className="navbar-inner mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand">
          <div className="brand-icon-wrap">
            <Shield size={20} className="fill-white/10" />
          </div>
          <span>
            Auth<span className="brand-accent">Flow</span>
          </span>
        </Link>

        {/* Navigation Links & Actions */}
        <div className="flex items-center gap-3">
          
          {/* Theme Palette Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="theme-picker-btn"
              title="Change Color Theme"
              aria-label="Change Color Theme"
            >
              <Palette size={15} className="text-zinc-400" />
              <span
                className="theme-dot"
                style={{
                  backgroundColor: THEMES.find((t) => t.id === currentTheme)?.color || "#6366f1",
                  boxShadow: `0 0 10px ${THEMES.find((t) => t.id === currentTheme)?.color || "#6366f1"}`
                }}
              />
            </button>

            {themeDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setThemeDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-white/10 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-2xl z-50 animate-scale-in">
                  <div className="px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Select Theme
                  </div>
                  {THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => {
                        setCurrentTheme(theme.id);
                        setThemeDropdownOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                        currentTheme === theme.id
                          ? "bg-white/10 text-white"
                          : "text-zinc-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="h-3.5 w-3.5 rounded-full"
                          style={{ backgroundColor: theme.color, boxShadow: `0 0 8px ${theme.color}` }}
                        />
                        <span>{theme.name}</span>
                      </div>
                      {currentTheme === theme.id && <Check size={16} className="text-white" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>

          {isLoggedIn ? (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
              <button onClick={handleLogout} className="nav-btn">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <NavLink to="/signup" className={navBtnClass}>
                <Sparkles size={15} />
                <span>Get Started</span>
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
