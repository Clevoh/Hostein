// src/pages/client/ClientProfile.jsx
import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Save,
  X,
} from "lucide-react";
import {
  getClientProfile,
  updateClientProfile,
  changePassword,
} from "../../services/clientService";
import { getBookingStats } from "../../services/bookingService";
import { getMyServices } from "../../services/serviceService";

export default function ClientProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    avatar: null,
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const [stats, setStats] = useState({
    totalBookings: 0,
    activeServices: 0,
    memberSince: "Jan 2026",
  });

  useEffect(() => {
    loadProfile();
    loadStats();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getClientProfile();
      setProfile({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        avatar: data.avatar ? `http://localhost:5000${data.avatar}` : null,
      });
    } catch (error) {
      console.error("Failed to load profile:", error);
      setAlert({
        type: "error",
        message: "Failed to load profile data",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const [bookingStatsData, servicesData] = await Promise.all([
        getBookingStats(),
        getMyServices(),
      ]);

      setStats({
        totalBookings: bookingStatsData.totalBookings || 0,
        activeServices: servicesData.filter(
          (s) => s.status === "scheduled" || s.status === "in-progress"
        ).length,
        memberSince: "Jan 2026", // This should come from user.createdAt
      });
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setProfile({ ...profile, avatar: URL.createObjectURL(file) });
    }
  };

  const passwordStrength = () => {
    const p = passwords.newPass;
    if (p.length === 0) return { value: 0, label: "", color: "" };
    if (p.length < 6)
      return { value: 25, label: "Weak", color: "bg-red-500" };
    if (p.match(/[A-Z]/) && p.match(/[0-9]/))
      return { value: 75, label: "Strong", color: "bg-green-500" };
    if (p.match(/[A-Z]/) && p.match(/[0-9]/) && p.match(/[^A-Za-z0-9]/))
      return { value: 100, label: "Very Strong", color: "bg-green-600" };
    return { value: 50, label: "Medium", color: "bg-yellow-500" };
  };

  const handleUpdatePassword = async () => {
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      setAlert({
        type: "error",
        message: "All password fields are required.",
      });
      return;
    }

    if (passwords.newPass !== passwords.confirm) {
      setAlert({ type: "error", message: "Passwords do not match." });
      return;
    }

    if (passwords.newPass.length < 6) {
      setAlert({
        type: "error",
        message: "Password must be at least 6 characters.",
      });
      return;
    }

    try {
      await changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.newPass,
      });

      setAlert({ type: "success", message: "Password updated successfully!" });
      setPasswords({ current: "", newPass: "", confirm: "" });
      setShowPasswordForm(false);
    } catch (error) {
      setAlert({
        type: "error",
        message: error.response?.data?.message || "Failed to update password",
      });
    }

    setTimeout(() => setAlert(null), 3000);
  };

  const handleSaveProfile = async () => {
    try {
      const profileData = {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
      };

      // Add avatar file if changed
      if (avatarFile) {
        profileData.avatar = avatarFile;
      }

      await updateClientProfile(profileData);

      setIsEditing(false);
      setAvatarFile(null);
      setAlert({ type: "success", message: "Profile updated successfully!" });

      // Reload profile to get updated data
      await loadProfile();
    } catch (error) {
      setAlert({
        type: "error",
        message: error.response?.data?.message || "Failed to update profile",
      });
    }

    setTimeout(() => setAlert(null), 3000);
  };

  const strength = passwordStrength();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* ALERT */}
      {alert && (
        <div
          className={`p-4 rounded-lg border flex items-start gap-3 animate-fadeIn ${
            alert.type === "success"
              ? "bg-green-50 border-green-400 text-green-700"
              : "bg-red-50 border-red-400 text-red-700"
          }`}
        >
          {alert.type === "success" ? (
            <CheckCircle size={20} className="shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
          )}
          <span className="flex-1">{alert.message}</span>
          <button
            onClick={() => setAlert(null)}
            className="hover:opacity-70 transition"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* PROFILE CARD */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        {/* HEADER WITH GRADIENT */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-32"></div>

        <div className="px-6 pb-6">
          {/* AVATAR - Overlapping the gradient */}
          <div className="flex items-end gap-6 -mt-16 mb-6">
            <div className="relative group">
              <img
                src={profile.avatar || "https://via.placeholder.com/120"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              {isEditing && (
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="text-white" size={24} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="flex-1 pb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {profile.name || "User"}
              </h2>
              <p className="text-gray-600 flex items-center gap-1 mt-1">
                <Mail size={16} />
                {profile.email}
              </p>
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* PROFILE INFO */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User size={16} />
                Full Name
              </label>
              <input
                name="name"
                disabled={!isEditing}
                value={profile.name}
                onChange={handleProfileChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Mail size={16} />
                Email Address
              </label>
              <input
                name="email"
                type="email"
                disabled={!isEditing}
                value={profile.email}
                onChange={handleProfileChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Phone size={16} />
                Phone Number
              </label>
              <input
                name="phone"
                type="tel"
                disabled={!isEditing}
                value={profile.phone}
                onChange={handleProfileChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} />
                Address
              </label>
              <input
                name="address"
                disabled={!isEditing}
                value={profile.address}
                onChange={handleProfileChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 disabled:bg-gray-50 disabled:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>
          </div>

          {/* ACTION BUTTONS */}
          {isEditing && (
            <div className="flex gap-3 justify-end mt-6 pt-6 border-t">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setAvatarFile(null);
                  loadProfile(); // Reset changes
                }}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CHANGE PASSWORD SECTION */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <button
          onClick={() => setShowPasswordForm(!showPasswordForm)}
          className="w-full flex justify-between items-center p-6 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Lock className="text-blue-600" size={20} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Change Password</h3>
              <p className="text-sm text-gray-600">
                Update your password to keep your account secure
              </p>
            </div>
          </div>
          <div
            className={`text-2xl text-gray-400 transition-transform ${
              showPasswordForm ? "rotate-45" : ""
            }`}
          >
            +
          </div>
        </button>

        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            showPasswordForm ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-6 pt-0 space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords ? "text" : "password"}
                  name="current"
                  placeholder="Enter current password"
                  value={passwords.current}
                  onChange={handlePasswordChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPasswords ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords ? "text" : "password"}
                  name="newPass"
                  placeholder="Enter new password"
                  value={passwords.newPass}
                  onChange={handlePasswordChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPasswords ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* PASSWORD STRENGTH */}
              {passwords.newPass && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">
                      Password strength
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        strength.value < 50
                          ? "text-red-600"
                          : strength.value < 75
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {strength.label}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${strength.value}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Use at least 6 characters with uppercase, numbers, and
                    symbols
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords ? "text" : "password"}
                  name="confirm"
                  placeholder="Confirm new password"
                  value={passwords.confirm}
                  onChange={handlePasswordChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPasswords ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Password Match Indicator */}
            {passwords.confirm && (
              <div
                className={`flex items-center gap-2 text-sm ${
                  passwords.newPass === passwords.confirm
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {passwords.newPass === passwords.confirm ? (
                  <>
                    <CheckCircle size={16} />
                    Passwords match
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} />
                    Passwords do not match
                  </>
                )}
              </div>
            )}

            <button
              onClick={handleUpdatePassword}
              className="w-full px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Lock size={18} />
              Update Password
            </button>
          </div>
        </div>
      </div>

      {/* ACCOUNT STATISTICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.totalBookings}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <CheckCircle className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Services</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.activeServices}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {stats.memberSince}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <User className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
