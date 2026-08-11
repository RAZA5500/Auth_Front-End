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
  Link as LinkIcon,
  Camera,
  Info,
  Clock,
  Heart,
  Globe,
  Eye,
  EyeOff
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

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    bio: "",
    gender: "",
    location: "",
    website: "",
    avatar: ""
  });
  
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

  // ── Auto-logout when token expires ──────────────────────────────────
  useEffect(() => {
    // Register handler so any 401 from apiFetch triggers this
    setTokenExpiredHandler(() => {
      toast.error("Session expired. Please log in again.");
      setTimeout(() => navigate("/login"), 1500);
    });

    // Also set a client-side timer that fires exactly when the JWT expires
    const token = getToken();
    if (token) {
      const payload = decodeToken(token);
      if (payload?.exp) {
        const msUntilExpiry = payload.exp * 1000 - Date.now();
        if (msUntilExpiry > 0) {
          const timer = setTimeout(() => {
            clearAuth();
            toast.error("Session expired. Please log in again.");
            setTimeout(() => navigate("/login"), 1500);
          }, msUntilExpiry);
          return () => clearTimeout(timer);
        } else {
          // Token already expired before component mounted
          clearAuth();
          navigate("/login");
        }
      }
    }
  }, [navigate]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getDashboard();
        setProfile({
          name: data.profile.name || "",
          email: data.profile.email || "",
          phone: data.profile.phone || "",
          dob: data.profile.dob ? new Date(data.profile.dob).toISOString().split('T')[0] : "",
          bio: data.profile.bio || "",
          gender: data.profile.gender || "",
          location: data.profile.location || "",
          website: data.profile.website || "",
          avatar: data.profile.avatar || "",
        });
        setStats(data.stats);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setModals((prev) => ({ ...prev, save: true }));
  };

  const confirmProfileSubmit = async () => {
    setIsSaving(true);
    try {
      const data = await updateProfile(profile);
      setAuth(localStorage.getItem("token"), data.user);
      toast.success("Profile updated successfully");
      setModals((prev) => ({ ...prev, save: false }));
    } catch (err) {
      toast.error(err.message);
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
        newPassword: passwords.newPassword
      });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password changed successfully");
    } catch (err) {
      toast.error(err.message);
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
      // Client-side logout still proceeds if server call fails
    } finally {
      clearAuth();
      toast.success("Logged out successfully! 👋");
      setTimeout(() => navigate("/login"), 1000);
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
      toast.success("Account deleted permanently. Goodbye! 👋");
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
        return toast.error("Image size should be less than 5MB");
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const getPasswordStrength = () => {
    const pwd = passwords.newPassword;
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 6) strength += 25;
    if (pwd.length >= 10) strength += 25;
    if (/[A-Z]/.test(pwd)) strength += 25;
    if (/[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) strength += 25;
    return strength;
  };
  
  const getStrengthColor = (val) => {
    if (val <= 25) return "#ef4444";
    if (val <= 50) return "#f59e0b";
    if (val <= 75) return "#3b82f6";
    return "#22c55e";
  };

  if (loading) {
    return (
      <div className="dashboard-page flex min-h-screen items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  const age = calculateAge(profile.dob);
  const strengthValue = getPasswordStrength();

  return (
    <div className="dashboard-page min-h-screen px-4 py-24">
      <div className="mx-auto max-w-5xl">
        
        {/* Profile Hero Section */}
        <div className="panel mb-8 flex flex-col items-center sm:flex-row sm:items-start gap-6 animate-fade-down">
          <div className="profile-avatar-wrapper flex-shrink-0" onClick={() => fileInputRef.current?.click()}>
            {profile.avatar ? (
              <img src={profile.avatar} alt="Profile" />
            ) : (
              <User size={48} className="text-zinc-600" />
            )}
            <div className="profile-avatar-overlay">
              <Camera size={24} className="mb-1" />
              <span>Change</span>
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleImageUpload}
          />
          
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">{profile.name || "User Name"}</h1>
              <span className="badge hidden sm:inline-flex">{stats?.accountStatus || "active"} user</span>
            </div>
            <p className="text-zinc-400 mb-4">{profile.email}</p>
            
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-zinc-500">
              {profile.location && (
                <span className="flex items-center gap-1"><MapPin size={14} /> {profile.location}</span>
              )}
              {stats?.memberSince && (
                <span className="flex items-center gap-1"><Calendar size={14} /> Joined {new Date(stats.memberSince).toLocaleDateString()}</span>
              )}
              {age !== null && (
                <span className="flex items-center gap-1"><Clock size={14} /> {age} years old</span>
              )}
            </div>
          </div>
          
          <button onClick={handleLogout} className="btn-outline flex items-center gap-2 self-center sm:self-start">
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="tabs animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <button 
            className={`tab ${activeTab === 'profile' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={16} className="inline mr-2" />
            Profile Info
          </button>
          <button 
            className={`tab ${activeTab === 'security' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <Shield size={16} className="inline mr-2" />
            Security
          </button>
          <button 
            className={`tab ${activeTab === 'account' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            <Info size={16} className="inline mr-2" />
            Account Details
          </button>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="panel">
              <h2 className="panel-title mb-6">Personal Information</h2>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="field-label"><User size={16} /> Full Name</label>
                  <input
                    type="text"
                    className="field-input"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <label className="field-label"><Mail size={16} /> Email Address</label>
                  <input
                    type="email"
                    className="field-input"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="field-label"><Phone size={16} /> Phone Number</label>
                  <input
                    type="tel"
                    className="field-input"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div>
                  <label className="field-label"><Calendar size={16} /> Date of Birth</label>
                  <input
                    type="date"
                    className="field-input text-zinc-300 [&::-webkit-calendar-picker-indicator]:invert"
                    value={profile.dob}
                    onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                  />
                </div>

                <div>
                  <label className="field-label"><Heart size={16} /> Gender</label>
                  <select 
                    className="field-input appearance-none bg-zinc-900 text-zinc-200 [&>option]:bg-zinc-900 [&>option]:text-zinc-200"
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
                  <label className="field-label"><MapPin size={16} /> Location</label>
                  <input
                    type="text"
                    className="field-input"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="field-label"><Globe size={16} /> Website URL</label>
                <input
                  type="url"
                  className="field-input"
                  value={profile.website}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div className="mt-6">
                <label className="field-label"><Info size={16} /> Bio</label>
                <textarea
                  className="field-input min-h-[100px] resize-y"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell us a little bit about yourself..."
                />
              </div>

              <div className="mt-8 flex justify-end">
                <button type="submit" disabled={isSaving} className="btn-primary flex items-center gap-2">
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="grid gap-6 md:grid-cols-2">
              <form onSubmit={handlePasswordSubmit} className="panel">
                <h2 className="panel-title">Change Password</h2>
                
                <div className="space-y-5">
                  <div>
                    <label className="field-label"><Lock size={16} /> Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        className="field-input pr-10"
                        value={passwords.currentPassword}
                        onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
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
                    <label className="field-label"><Lock size={16} /> New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        className="field-input pr-10"
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
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
                    <div className="password-strength">
                      <div 
                        className="password-strength-bar" 
                        style={{ width: `${strengthValue}%`, backgroundColor: getStrengthColor(strengthValue) }} 
                      />
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">Must be at least 6 characters long.</p>
                  </div>
                  
                  <div>
                    <label className="field-label"><Lock size={16} /> Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="field-input pr-10"
                        value={passwords.confirmPassword}
                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
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

                <button type="submit" disabled={isSaving} className="btn-primary mt-6 flex items-center gap-2">
                  <Shield size={18} />
                  {isSaving ? "Updating..." : "Update Password"}
                </button>
              </form>

              <div className="panel flex flex-col justify-center text-center items-center">
                <Shield size={48} className="text-emerald-500 mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-white mb-2">Secure Your Account</h3>
                <p className="text-zinc-400 text-sm mb-6 max-w-sm">
                  We recommend using a strong password that you're not using elsewhere. 
                  A good password contains a mix of letters, numbers, and symbols.
                </p>
                <div className="w-full bg-zinc-900/50 rounded-lg p-4 text-left border border-zinc-800">
                  <p className="text-sm text-zinc-300 font-medium mb-2">Password Requirements:</p>
                  <ul className="text-xs text-zinc-500 space-y-1 list-disc pl-4">
                    <li>Minimum 6 characters long</li>
                    <li>Avoid common words or patterns</li>
                    <li>Consider using a password manager</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ACCOUNT TAB */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <div className="panel">
                <h2 className="panel-title">Account Details</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
                    <p className="text-xs text-zinc-500 mb-1">Account ID</p>
                    <p className="font-mono text-sm text-zinc-300 break-all">{stats?.id || "N/A"}</p>
                  </div>
                  <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
                    <p className="text-xs text-zinc-500 mb-1">Status</p>
                    <p className="text-sm text-emerald-400 capitalize">{stats?.accountStatus || "Active"}</p>
                  </div>
                  <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
                    <p className="text-xs text-zinc-500 mb-1">Member Since</p>
                    <p className="text-sm text-zinc-300">
                      {stats?.memberSince ? new Date(stats.memberSince).toLocaleDateString(undefined, {
                        year: 'numeric', month: 'long', day: 'numeric'
                      }) : "N/A"}
                    </p>
                  </div>
                  <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
                    <p className="text-xs text-zinc-500 mb-1">Email Verified</p>
                    <p className="text-sm text-zinc-300">Yes</p>
                  </div>
                </div>
              </div>

              <div className="panel danger-zone">
                <h2 className="panel-title">Danger Zone</h2>
                <p className="text-zinc-400 text-sm mb-6 max-w-2xl">
                  Once you delete your account, there is no going back. Please be certain.
                  All your data, profile information, and activity will be permanently removed.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button onClick={handleLogout} className="btn-outline flex items-center gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500">
                    <LogOut size={18} />
                    Sign Out of All Devices
                  </button>
                  <button onClick={handleDeleteAccount} className="btn-danger flex items-center gap-2">
                    Delete Account
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
        onClose={() => !isSaving && setModals(prev => ({ ...prev, save: false }))}
        onConfirm={confirmProfileSubmit}
        title="Save Changes"
        message="Are you sure you want to save these changes to your profile?"
        confirmText="Save Changes"
        cancelText="Discard Changes"
        isLoading={isSaving}
      />

      <ConfirmationModal
        isOpen={modals.logout}
        onClose={() => setModals(prev => ({ ...prev, logout: false }))}
        onConfirm={confirmLogout}
        title="Sign Out"
        message="Are you sure you want to sign out of your account?"
        confirmText="Sign Out"
      />

      <ConfirmationModal
        isOpen={modals.delete}
        onClose={() => !isSaving && setModals(prev => ({ ...prev, delete: false }))}
        onConfirm={confirmDeleteAccount}
        title="Delete Account"
        message="Are you absolutely sure you want to delete your account? This action cannot be undone and all your data will be permanently removed."
        confirmText="Delete Account"
        isDanger={true}
        isLoading={isSaving}
      />
    </div>
  );
};

export default Dashboard;
