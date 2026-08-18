import { Link, NavLink, useNavigate } from "react-router-dom";
import { hasValidSession, clearAuth, logoutUser } from "../utils/api.js";

const navLinkClass = ({ isActive }) =>
  isActive ? "nav-link nav-link-active" : "nav-link";

const navBtnClass = ({ isActive }) =>
  isActive ? "nav-btn nav-btn-active" : "nav-btn";

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = hasValidSession();

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
      <div className="navbar-inner mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="navbar-brand">
          Auth<span className="text-emerald-400">Flow</span>
        </Link>

        <div className="flex items-center gap-2">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>

          {isLoggedIn ? (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
              <button onClick={handleLogout} className="nav-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <NavLink to="/signup" className={navBtnClass}>
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
