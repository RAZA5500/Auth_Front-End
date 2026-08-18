import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Calendar,
  Shield,
  LogOut,
  Save,
  Lock,
  Phone,
  MapPin,
  Camera,
  Info,
  Clock,
  Heart,
  Globe,
  Eye,
  EyeOff,
  Sparkles,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getDashboard,
  updateProfile,
  changePassword,
  logoutUser,
  deleteUserAccount,
  clearAuth,
  setAuth,
  setTokenExpiredHandler,
  decodeToken,
  getToken,
  getRefreshToken,
  refreshAccessToken,
} from "../utils/api.js";
import ConfirmationModal from "./ConfirmationModal.jsx";

const calculateAge = (dob) => {
  if (!dob) return null;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const formatDob = (dob) => {
  if (!dob) return "";
  return new Date(dob).toISOString().split("T")[0];
};

const buildProfileState = (profileData) => ({
  name: profileData.name || "",
  email: profileData.email || "",
  phone: profileData.phone || "",
  dob: formatDob(profileData.dob),
  bio: profileData.bio || "",
  gender: profileData.gender || "",
  location: profileData.location || "",
  website: profileData.website || "",
  avatar: profileData.avatar || "",
});

const PROFILE_FIELDS = [
  "name",
  "email",
  "phone",
  "dob",
  "bio",
  "gender",
  "location",
  "website",
  "avatar",
];

const hasProfileChanges = (current, original) =>
  PROFILE_FIELDS.some((field) => current[field] !== original[field]);

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [copiedId, setCopiedId] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    bio: "",
    gender: "",
    location: "",
    website: "",
    avatar: "",
  });
  const [savedProfile, setSavedProfile] = useState(null);

  const [stats, setStats] = useState(null);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [modals, setModals] = useState({
    delete: false,
    logout: false,
    save: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fileInputRef = useRef(null);

  // Proactive token refresh schedule
  useEffect(() => {
    setTokenExpiredHandler(() => {
      toast.error("Session expired. Please log in again.");
      setTimeout(() => navigate("/login"), 1500);
    });

    let expiryTimer;

    const scheduleRefresh = () => {
      const token = getToken();
      if (!token) return;

      const payload = decodeToken(token);
      if (!payload?.exp) return;

      const msUntilExpiry = payload.exp * 1000 - Date.now();
      const refreshIn = Math.max(msUntilExpiry - 60_000, 0);

      expiryTimer = setTimeout(async () => {
        if (!getRefreshToken()) {
          clearAuth();
          toast.error("Session expired. Please log in again.");
          navigate("/login");
          return;
        }

        try {
          await refreshAccessToken();
          scheduleRefresh();
        } catch {
          clearAuth();
          toast.error("Session expired. Please log in again.");
          navigate("/login");
        }
      }, refreshIn);
    };

    scheduleRefresh();

    return () => {
      if (expiryTimer) clearTimeout(expiryTimer);
    };
  }, [navigate]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getDashboard();
        const profileState = buildProfileState(data.profile);
        setProfile(profileState);
        setSavedProfile(profileState);
        setStats(data.stats);
      } catch (err) {
        toast.error(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleProfileSubmit = (e) => {
    e.preventDefault();

    if (!savedProfile || !hasProfileChanges(profile, savedProfile)) {
      toast.error("No changes to save");
      return;
    }

    setModals((prev) => ({ ...prev, save: true }));
  };

  const confirmProfileSubmit = async () => {
    if (!savedProfile || !hasProfileChanges(profile, savedProfile)) {
      setModals((prev) => ({ ...prev, save: false }));
      toast.error("No changes to save");
      return;
    }

    setIsSaving(true);
    try {
      const data = await updateProfile(profile);
      setAuth(getToken(), data.user, getRefreshToken());
      const updatedProfile = buildProfileState(data.user);
      setProfile(updatedProfile);
      setSavedProfile(updatedProfile);
      toast.success("Profile updated successfully! ✨");
      setModals((prev) => ({ ...prev, save: false }));
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("New passwords do not match");
    }

    setIsSaving(true);
    try {
      await changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password changed securely! 🔒");
    } catch (err) {
      toast.error(err.message || "Failed to change password");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    setModals((prev) => ({ ...prev, logout: true }));
  };

  const confirmLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // Client-side logout still proceeds
    } finally {
      clearAuth();
      toast.success("Signed out successfully! 👋");
      setTimeout(() => navigate("/login"), 800);
    }
  };

  const handleDeleteAccount = () => {
    setModals((prev) => ({ ...prev, delete: true }));
  };

  const confirmDeleteAccount = async () => {
    setIsSaving(true);
    try {
      await deleteUserAccount();
      clearAuth();
      toast.success("Account permanently removed. Goodbye!");
      setTimeout(() => navigate("/signup"), 1000);
    } catch (err) {
      toast.error(err.message || "Failed to delete account");
      setIsSaving(false);
      setModals((prev) => ({ ...prev, delete: false }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return toast.error("Image size must be under 5MB");
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyId = () => {
    if (stats?.id) {
      navigator.clipboard.writeText(stats.id);
      setCopiedId(true);
      toast.success("Account ID copied to clipboard!");
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const getPasswordStrength = () => {
    const pwd = passwords.newPassword;
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 6) strength += 25;
    if (pwd.length >= 10) strength += 25;
    if (/[A-Z]/.test(pwd)) strength += 25;
    if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) strength += 25;
    return strength;
  };

  const getStrengthColor = (val) => {
    if (val <= 25) return "#ef4444";
    if (val <= 50) return "#f59e0b";
    if (val <= 75) return "#3b82f6";
    return "#10b981";
  };

  if (loading) {
    return (
      <div className="dashboard-page flex min-h-screen items-center justify-center">
        <div className="landing-bg page-bg">
          <div className="glow-orb glow-orb-1" />
          <div className="glow-orb glow-orb-2" />
        </div>
        <div className="flex flex-col items-center gap-4 z-10">
          <div className="loading-spinner" />
          <span className="font-semibold text-zinc-400">Loading Secure Workspace...</span>
        </div>
      </div>
    );
  }

  const age = calculateAge(profile.dob);
  const strengthValue = getPasswordStrength();
  const profileChanged = savedProfile ? hasProfileChanges(profile, savedProfile) : false;

  return (
    <div className="dashboard-page">
      {/* Background Ambience */}
      <div className="landing-bg page-bg">
        <div className="grid-overlay" />
        <div className="glow-orb glow-orb-1" />
        <div className="glow-orb glow-orb-2" />
        <div className="glow-orb glow-orb-3" />
      </div>

      <div className="mx-auto max-w-5xl relative z-10">
        
        {/* Profile Hero Banner */}
        <div className="panel mb-8 flex flex-col items-center sm:flex-row sm:items-center justify-between gap-6 animate-fade-down">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div
              className="profile-avatar-wrapper shrink-0"
              onClick={() => fileInputRef.current?.click()}
              title="Click to update photo"
            >
              {profile.avatar ? (
                <img src={profile.avatar} alt="Profile" />
              ) : (
                <User size={52} className="text-zinc-400" />
              )}
              <div className="profile-avatar-overlay">
                <Camera size={22} className="mb-1 text-white" />
                <span>Upload</span>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />

            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-1.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {profile.name || "User Profile"}
                </h1>
                <span className="badge badge-success">
                  <Sparkles size={12} /> PRO VERIFIED
                </span>
              </div>
              <p className="text-zinc-400 text-sm font-medium mb-3">{profile.email}</p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-zinc-400 font-medium">
                {profile.location && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/5">
                    <MapPin size={13} className="text-indigo-400" /> {profile.location}
                  </span>
                )}
                {stats?.memberSince && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/5">
                    <Calendar size={13} className="text-cyan-400" /> Joined {new Date(stats.memberSince).toLocaleDateString()}
                  </span>
                )}
                {age !== null && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/5">
                    <Clock size={13} className="text-rose-400" /> {age} yrs
                  </span>
                )}
              </div>
            </div>
          </div>

          <button onClick={handleLogout} className="btn-outline flex items-center gap-2 self-center sm:self-auto shrink-0">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* 4 Top Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-up" style={{ animationDelay: "0.08s" }}>
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <span className="stat-label">Security Health</span>
              <div className="stat-icon-wrap text-emerald-400">
                <Shield size={18} />
              </div>
            </div>
            <div className="stat-value text-emerald-400">98% Solid</div>
            <div className="text-[11px] text-zinc-500 mt-1">Dual-JWT Encrypted</div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <span className="stat-label">Session Status</span>
              <div className="stat-icon-wrap text-cyan-400">
                <KeyRound size={18} />
              </div>
            </div>
            <div className="stat-value text-cyan-400">Active</div>
            <div className="text-[11px] text-zinc-500 mt-1">Auto-refresh ready</div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <span className="stat-label">Account Level</span>
              <div className="stat-icon-wrap text-indigo-400">
                <User size={18} />
              </div>
            </div>
            <div className="stat-value text-indigo-400">Standard</div>
            <div className="text-[11px] text-zinc-500 mt-1">Full profile access</div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <span className="stat-label">Encryption</span>
              <div className="stat-icon-wrap text-purple-400">
                <Lock size={18} />
              </div>
            </div>
            <div className="stat-value text-purple-400">256-Bit</div>
            <div className="text-[11px] text-zinc-500 mt-1">Bcrypt password salt</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="tabs animate-fade-up" style={{ animationDelay: "0.15s" }}>
          <button
            className={`tab ${activeTab === "profile" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <User size={16} className="inline mr-2 text-indigo-400" />
            Profile Information
          </button>
          <button
            className={`tab ${activeTab === "security" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            <Shield size={16} className="inline mr-2 text-cyan-400" />
            Security &amp; Password
          </button>
          <button
            className={`tab ${activeTab === "account" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("account")}
          >
            <Info size={16} className="inline mr-2 text-rose-400" />
            Account Management
          </button>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-up" style={{ animationDelay: "0.22s" }}>
          
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <form onSubmit={handleProfileSubmit} className="panel">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="panel-title mb-1">Personal Information</h2>
                  <p className="text-zinc-400 text-xs">Manage your personal credentials and public profile</p>
                </div>
                {profileChanged && (
                  <span className="badge border-amber-500/40 bg-amber-500/10 text-amber-300">
                    Unsaved Changes
                  </span>
                )}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="field-label">
                    <User size={15} className="text-indigo-400" />
                    <span>Full Name</span>
                  </label>
                  <input
                    type="text"
                    className="field-input"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Enter your name"
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
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="field-label">
                    <Phone size={15} className="text-indigo-400" />
                    <span>Phone Number</span>
                  </label>
                  <input
                    type="tel"
                    className="field-input"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div>
                  <label className="field-label">
                    <Calendar size={15} className="text-indigo-400" />
                    <span>Date of Birth</span>
                  </label>
                  <input
                    type="date"
                    className="field-input text-zinc-300 [&::-webkit-calendar-picker-indicator]:invert cursor-pointer"
                    value={profile.dob}
                    onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                  />
                </div>

                <div>
                  <label className="field-label">
                    <Heart size={15} className="text-indigo-400" />
                    <span>Gender</span>
                  </label>
                  <select
                    className="field-input appearance-none bg-slate-900 text-zinc-200 cursor-pointer"
                    value={profile.gender}
                    onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="field-label">
                    <MapPin size={15} className="text-indigo-400" />
                    <span>Location</span>
                  </label>
                  <input
                    type="text"
                    className="field-input"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    placeholder="San Francisco, CA"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="field-label">
                  <Globe size={15} className="text-indigo-400" />
                  <span>Website URL</span>
                </label>
                <input
                  type="url"
                  className="field-input"
                  value={profile.website}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div className="mt-6">
                <label className="field-label">
                  <Info size={15} className="text-indigo-400" />
                  <span>Bio</span>
                </label>
                <textarea
                  className="field-input min-h-[110px] resize-y"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell us a little bit about yourself, your role, or what you are building..."
                />
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving || !profileChanged}
                  className="btn-primary flex items-center gap-2"
                >
                  <Save size={18} />
                  <span>{isSaving ? "Saving Changes..." : "Save Profile Changes"}</span>
                </button>
              </div>
            </form>
          )}

          {/* SECURITY TAB */}
          {activeTab === "security" && (
            <div className="grid gap-6 md:grid-cols-2">
              <form onSubmit={handlePasswordSubmit} className="panel">
                <h2 className="panel-title mb-2">Change Password</h2>
                <p className="text-zinc-400 text-xs mb-6">Update your account credentials with salted hashing</p>

                <div className="space-y-4">
                  <div>
                    <label className="field-label">
                      <Lock size={15} className="text-cyan-400" />
                      <span>Current Password</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        className="field-input pr-11"
                        value={passwords.currentPassword}
                        onChange={(e) =>
                          setPasswords({ ...passwords, currentPassword: e.target.value })
                        }
                        placeholder="Enter current password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="field-label">
                      <Lock size={15} className="text-cyan-400" />
                      <span>New Password</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        className="field-input pr-11"
                        value={passwords.newPassword}
                        onChange={(e) =>
                          setPasswords({ ...passwords, newPassword: e.target.value })
                        }
                        placeholder="Enter new password"
                        minLength={6}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {passwords.newPassword && (
                      <div className="mt-2">
                        <div className="password-strength">
                          <div
                            className="password-strength-bar"
                            style={{
                              width: `${strengthValue}%`,
                              backgroundColor: getStrengthColor(strengthValue),
                            }}
                          />
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-1">Must be at least 6 characters long.</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="field-label">
                      <Lock size={15} className="text-cyan-400" />
                      <span>Confirm New Password</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="field-input pr-11"
                        value={passwords.confirmPassword}
                        onChange={(e) =>
                          setPasswords({ ...passwords, confirmPassword: e.target.value })
                        }
                        placeholder="Confirm new password"
                        minLength={6}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-primary mt-6 flex items-center gap-2"
                >
                  <Shield size={18} />
                  <span>{isSaving ? "Securing Password..." : "Update Password"}</span>
                </button>
              </form>

              {/* Security Recommendations Card */}
              <div className="panel flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="stat-icon-wrap text-emerald-400 bg-emerald-500/10">
                      <Shield size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Security Checklist</h3>
                      <p className="text-xs text-zinc-400">Best practices for account safety</p>
                    </div>
                  </div>

                  <div className="space-y-3 mt-4">
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/5">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-semibold text-white">Rotating Access Tokens</div>
                        <div className="text-[11px] text-zinc-400">Tokens refresh seamlessly without exposing credentials.</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/5">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-semibold text-white">Bcrypt 10-Salt Hash</div>
                        <div className="text-[11px] text-zinc-400">Passwords are cryptographically hashed before database storage.</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/5">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-semibold text-white">Protected API Routes</div>
                        <div className="text-[11px] text-zinc-400">Unauthenticated access attempts are blocked automatically.</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 text-xs text-zinc-500">
                  Last verified: Just now &bull; Encryption status: Active
                </div>
              </div>
            </div>
          )}

          {/* ACCOUNT TAB */}
          {activeTab === "account" && (
            <div className="space-y-6">
              <div className="panel">
                <h2 className="panel-title mb-2">Account Metadata</h2>
                <p className="text-zinc-400 text-xs mb-6">Technical specifications and system identifiers</p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Internal Account ID</p>
                      <p className="font-mono text-sm text-zinc-300 break-all">{stats?.id || "N/A"}</p>
                    </div>
                    <button
                      onClick={handleCopyId}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                      title="Copy Account ID"
                    >
                      {copiedId ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                    </button>
                  </div>

                  <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-zinc-500 mb-1">Account Standing</p>
                    <p className="text-sm font-semibold text-emerald-400 capitalize">
                      {stats?.accountStatus || "Active"} &bull; Verified
                    </p>
                  </div>

                  <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-zinc-500 mb-1">Registration Date</p>
                    <p className="text-sm text-zinc-300">
                      {stats?.memberSince
                        ? new Date(stats.memberSince).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"}
                    </p>
                  </div>

                  <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-zinc-500 mb-1">Session Protocol</p>
                    <p className="text-sm font-mono text-cyan-400">JWT / Bearer Token</p>
                  </div>
                </div>
              </div>

              {/* Danger Zone Panel */}
              <div className="panel danger-zone">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle size={22} className="text-red-400" />
                  <h2 className="panel-title mb-0">Danger Zone</h2>
                </div>
                <p className="text-zinc-400 text-sm mb-6 max-w-2xl leading-relaxed">
                  Permanent actions regarding your account. Deleting your account will purge all personal data,
                  profile information, and encrypted tokens immediately. This cannot be undone.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handleLogout}
                    className="btn-outline border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500"
                  >
                    <LogOut size={16} />
                    <span>Sign Out of Session</span>
                  </button>
                  <button onClick={handleDeleteAccount} className="btn-danger">
                    <span>Delete Account Permanently</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={modals.save}
        onClose={() => !isSaving && setModals((prev) => ({ ...prev, save: false }))}
        onConfirm={confirmProfileSubmit}
        title="Confirm Profile Updates"
        message="Are you sure you want to commit these updates to your user profile?"
        confirmText="Save Changes"
        cancelText="Cancel"
        isLoading={isSaving}
      />

      <ConfirmationModal
        isOpen={modals.logout}
        onClose={() => setModals((prev) => ({ ...prev, logout: false }))}
        onConfirm={confirmLogout}
        title="Sign Out of Session"
        message="Are you sure you want to end your active authenticated session?"
        confirmText="Sign Out"
      />

      <ConfirmationModal
        isOpen={modals.delete}
        onClose={() => !isSaving && setModals((prev) => ({ ...prev, delete: false }))}
        onConfirm={confirmDeleteAccount}
        title="Permanently Delete Account"
        message="Are you completely certain? This action will permanently erase your user profile and all associated data."
        confirmText="Delete My Account"
        isDanger={true}
        isLoading={isSaving}
      />
    </div>
  );
};

export default Dashboard;
