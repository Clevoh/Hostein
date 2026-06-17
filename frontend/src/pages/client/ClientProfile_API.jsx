import { useState, useEffect } from "react";
import {
  User, Mail, Phone, MapPin, Camera, Lock, Eye, EyeOff,
  CheckCircle, AlertCircle, Save, X, Calendar, Wrench,
} from "lucide-react";
import { getClientProfile, updateClientProfile, changePassword } from "../../services/clientService";
import { getBookingStats } from "../../services/bookingService";
import { getMyServices } from "../../services/serviceService";

export default function ClientProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPwForm, setShowPwForm] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const [profile, setProfile] = useState({ name: "", email: "", phone: "", address: "", avatar: null });
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [stats, setStats] = useState({ totalBookings: 0, activeServices: 0, memberSince: "Jan 2026" });

  useEffect(() => { loadProfile(); loadStats(); }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getClientProfile();
      setProfile({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        avatar: data.avatar ? `${import.meta.env.VITE_API_URL}${data.avatar}` : null,
      });
    } catch { setAlert({ type: "error", message: "Failed to load profile data" }); }
    finally { setLoading(false); }
  };

  const loadStats = async () => {
    try {
      const [bk, sv] = await Promise.all([getBookingStats(), getMyServices()]);
      setStats({
        totalBookings: bk.totalBookings || 0,
        activeServices: sv.filter((s) => s.status === "scheduled" || s.status === "in-progress").length,
        memberSince: "Jan 2026",
      });
    } catch {}
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const pwStrength = () => {
    const p = passwords.newPass;
    if (!p.length) return { value: 0, label: "", color: "" };
    if (p.length < 6) return { value: 25, label: "Weak", color: "bg-red-500" };
    if (p.match(/[A-Z]/) && p.match(/[0-9]/)) return { value: 75, label: "Strong", color: "bg-emerald-500" };
    return { value: 50, label: "Medium", color: "bg-yellow-500" };
  };

  const handleSaveProfile = async () => {
    try {
      const profileData = { name: profile.name, email: profile.email, phone: profile.phone, address: profile.address };
      if (avatarFile) profileData.avatar = avatarFile;
      await updateClientProfile(profileData);
      setIsEditing(false);
      setAvatarFile(null);
      showAlert("success", "Profile updated successfully!");
      await loadProfile();
    } catch (err) { showAlert("error", err.response?.data?.message || "Failed to update profile"); }
  };

  const handleUpdatePassword = async () => {
    if (!passwords.current || !passwords.newPass || !passwords.confirm) return showAlert("error", "All fields are required.");
    if (passwords.newPass !== passwords.confirm) return showAlert("error", "Passwords do not match.");
    if (passwords.newPass.length < 6) return showAlert("error", "Password must be at least 6 characters.");
    try {
      await changePassword({ currentPassword: passwords.current, newPassword: passwords.newPass });
      showAlert("success", "Password updated successfully!");
      setPasswords({ current: "", newPass: "", confirm: "" });
      setShowPwForm(false);
    } catch (err) { showAlert("error", err.response?.data?.message || "Failed to update password"); }
  };

  const strength = pwStrength();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-t-slate-700 animate-spin" style={{ borderColor: "var(--border)", borderTopColor: "var(--text)" }} />
          <p className="text-sm" style={{ color: "var(--text2)" }}>Loading profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-5 pb-8">
      {/* ── HEADER ── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>My Profile</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text2)" }}>Manage your account settings and preferences</p>
      </div>

      {/* ── ALERT ── */}
      {alert && (
        <div className={`flex items-start gap-3 p-4 rounded-2xl border text-sm ${
          alert.type === "success"
            ? "bg-emerald-50 border-emerald-100 text-emerald-700"
            : "bg-red-50 border-red-100 text-red-700"
        }`}>
          {alert.type === "success" ? <CheckCircle size={16} className="mt-0.5 flex-shrink-0" /> : <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />}
          <span className="flex-1">{alert.message}</span>
          <button onClick={() => setAlert(null)} className="hover:opacity-70 transition flex-shrink-0"><X size={16} /></button>
        </div>
      )}

      {/* ── PROFILE CARD ── */}
      <div className="rounded-2xl border shadow-sm overflow-hidden" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
        {/* Gradient banner */}
        <div className="h-28 bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-36 h-36 rounded-full bg-blue-500/20 blur-xl" />
        </div>

        <div className="px-5 md:px-6 pb-6">
          {/* Avatar + name row */}
          <div className="flex items-end gap-4 -mt-14 mb-6">
            <div className="relative group flex-shrink-0">
              <div className="w-28 h-28 rounded-2xl border-4 shadow-lg overflow-hidden" style={{ borderColor: "var(--surface)", background: "var(--bg)" }}>
                <img
                  src={profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || "U")}&background=1e293b&color=fff&size=112`}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition cursor-pointer">
                  <Camera size={20} className="text-white" />
                  <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files[0]; if (f) { setAvatarFile(f); setProfile({ ...profile, avatar: URL.createObjectURL(f) }); } }} className="hidden" />
                </label>
              )}
            </div>

            <div className="flex-1 min-w-0 pb-2">
              <h2 className="text-xl font-bold truncate" style={{ color: "var(--text)" }}>{profile.name || "User"}</h2>
              <p className="text-sm flex items-center gap-1 mt-0.5" style={{ color: "var(--text2)" }}><Mail size={13} /> {profile.email}</p>
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex-shrink-0 px-4 py-2 bg-slate-900 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Form fields */}
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { name: "name",    label: "Full Name",   icon: User,   type: "text" },
              { name: "email",   label: "Email",        icon: Mail,   type: "email" },
              { name: "phone",   label: "Phone",        icon: Phone,  type: "tel" },
              { name: "address", label: "Address",      icon: MapPin, type: "text" },
            ].map(({ name, label, icon: Icon, type }) => (
              <div key={name}>
                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text2)" }}>
                  <Icon size={12} /> {label}
                </label>
                <input
                  name={name}
                  type={type}
                  disabled={!isEditing}
                  value={profile[name]}
                  onChange={(e) => setProfile({ ...profile, [name]: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 transition"
                  style={{
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    color: isEditing ? "var(--text)" : "var(--text2)",
                  }}
                />
              </div>
            ))}
          </div>

          {isEditing && (
            <div className="flex gap-3 justify-end mt-5 pt-5" style={{ borderTop: "1px solid var(--border)" }}>
              <button
                onClick={() => { setIsEditing(false); setAvatarFile(null); loadProfile(); }}
                className="px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-80 transition"
                style={{ border: "1px solid var(--border)", color: "var(--text)", background: "var(--surface)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition flex items-center gap-2"
              >
                <Save size={15} /> Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── CHANGE PASSWORD ── */}
      <div className="rounded-2xl border shadow-sm overflow-hidden" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
        <button
          onClick={() => setShowPwForm(!showPwForm)}
          className="w-full flex items-center justify-between px-5 md:px-6 py-4 transition-colors hover:opacity-90"
          style={{ background: "var(--surface)" }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl" style={{ background: "var(--bg)" }}>
              <Lock size={17} style={{ color: "var(--text2)" }} />
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>Change Password</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text2)" }}>Update your password to keep your account secure</p>
            </div>
          </div>
          <span className={`text-2xl transition-transform`} style={{ color: "var(--text2)", transform: showPwForm ? "rotate(45deg)" : "rotate(0deg)" }}>+</span>
        </button>

        <div className={`transition-all duration-300 overflow-hidden ${showPwForm ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="px-5 md:px-6 pb-6 space-y-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
            {[
              { key: "current", label: "Current Password", placeholder: "Enter current password" },
              { key: "newPass", label: "New Password",     placeholder: "Enter new password" },
              { key: "confirm", label: "Confirm Password", placeholder: "Confirm new password" },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text2)" }}>{label}</label>
                <div className="relative">
                  <input
                    type={showPasswords ? "text" : "password"}
                    name={key}
                    placeholder={placeholder}
                    value={passwords[key]}
                    onChange={(e) => setPasswords({ ...passwords, [key]: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm pr-11 focus:outline-none focus:ring-2 transition"
                    style={{
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      color: "var(--text)",
                    }}
                  />
                  <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="absolute right-3 top-1/2 -translate-y-1/2 transition hover:opacity-80" style={{ color: "var(--text2)" }}>
                    {showPasswords ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>

                {key === "newPass" && passwords.newPass && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs" style={{ color: "var(--text2)" }}>Strength</span>
                      <span className={`text-xs font-semibold ${strength.value < 50 ? "text-red-500" : strength.value < 75 ? "text-yellow-500" : "text-emerald-600"}`}>
                        {strength.label}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "var(--bg)" }}>
                      <div className={`h-1.5 rounded-full transition-all duration-500 ${strength.color}`} style={{ width: `${strength.value}%` }} />
                    </div>
                  </div>
                )}

                {key === "confirm" && passwords.confirm && (
                  <div className={`flex items-center gap-1.5 mt-1.5 text-xs font-medium ${passwords.newPass === passwords.confirm ? "text-emerald-600" : "text-red-500"}`}>
                    {passwords.newPass === passwords.confirm ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                    {passwords.newPass === passwords.confirm ? "Passwords match" : "Passwords do not match"}
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={handleUpdatePassword}
              className="w-full px-4 py-2.5 bg-slate-900 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2"
            >
              <Lock size={15} /> Update Password
            </button>
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Bookings",  value: stats.totalBookings,  icon: Calendar, bg: "bg-blue-50",    color: "text-blue-600" },
          { label: "Active Services", value: stats.activeServices, icon: Wrench,   bg: "bg-violet-50",  color: "text-violet-600" },
          { label: "Member Since",    value: stats.memberSince,    icon: User,     bg: "bg-emerald-50", color: "text-emerald-600" },
        ].map(({ label, value, icon: Icon, bg, color }) => (
          <div key={label} className="rounded-2xl border p-4 shadow-sm" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium" style={{ color: "var(--text2)" }}>{label}</p>
              <div className={`p-1.5 ${bg} rounded-xl`}><Icon size={14} className={color} /></div>
            </div>
            <p className="text-xl font-bold" style={{ color: "var(--text)" }}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}