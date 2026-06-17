// src/pages/service-provider/ServiceProviderProfile.jsx
import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Save, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const FIELDS = [
  { key: "name",    label: "Full Name",    icon: User,   type: "text",  placeholder: "John Doe",         required: true },
  { key: "email",   label: "Email",        icon: Mail,   type: "email", placeholder: "john@example.com", required: true },
  { key: "phone",   label: "Phone Number", icon: Phone,  type: "tel",   placeholder: "+254 700 000 000" },
  { key: "address", label: "Address",      icon: MapPin, type: "text",  placeholder: "Nairobi, Kenya" },
];

export default function ServiceProviderProfile() {
  const { user } = useAuth();
  const [form, setForm]       = useState({ name: "", email: "", phone: "", address: "", bio: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast]     = useState(null); // { type: 'success'|'error', msg }

  useEffect(() => {
    if (user) setForm({
      name:    user.name    || "",
      email:   user.email   || "",
      phone:   user.phone   || "",
      address: user.address || "",
      bio:     user.bio     || "",
    });
  }, [user]);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("${import.meta.env.VITE_API_URL}/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });
      if (res.ok) showToast("success", "Profile updated successfully!");
      else        showToast("error",   "Failed to update profile. Please try again.");
    } catch {
      showToast("error", "Connection error. Please check your network.");
    } finally {
      setLoading(false);
    }
  };

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "SP";

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "—";

  return (
    <>
      <style>{`
        .spp-root { max-width: 640px; display: flex; flex-direction: column; gap: 24px; }

        .spp-header h2 {
          font-size: 28px; font-weight: 900; color: var(--text); margin-bottom: 4px;
        }
        .spp-header p { font-size: 13px; color: var(--text2); }

        /* Avatar card */
        .spp-avatar-card {
          background: var(--card-bg);
          border: 0.5px solid var(--card-border);
          border-radius: 18px; padding: 28px;
          display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
        }
        .spp-avatar {
          width: 72px; height: 72px; border-radius: 50%;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 26px; font-weight: 800;
          flex-shrink: 0; box-shadow: 0 8px 24px rgba(34,197,94,0.3);
        }
        .spp-user-name { font-size: 20px; font-weight: 700; color: var(--text); margin-bottom: 3px; }
        .spp-user-role {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.1em; color: #16a34a;
          background: rgba(34,197,94,0.1); padding: 3px 10px; border-radius: 100px;
          margin-bottom: 5px;
        }
        .spp-member-since { font-size: 11px; color: var(--text2); }

        /* Form card */
        .spp-form-card {
          background: var(--card-bg);
          border: 0.5px solid var(--card-border);
          border-radius: 18px; padding: 28px;
        }
        .spp-form-title { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 22px; }

        .spp-field { display: flex; flex-direction: column; gap: 7px; margin-bottom: 18px; }
        .spp-label {
          display: flex; align-items: center; gap: 7px;
          font-size: 12px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.07em; color: var(--text2);
        }
        .spp-input-wrap { position: relative; }
        .spp-input-ico {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          color: var(--text2); pointer-events: none;
        }
        .spp-input {
          width: 100%; padding: 12px 14px 12px 42px;
          border: 1.5px solid var(--border);
          border-radius: 11px; font-size: 14px;
          background: var(--surface2); color: var(--text);
          outline: none; transition: border-color 0.18s, background 0.18s;
          font-family: inherit;
        }
        .spp-input:focus { border-color: var(--accent); background: var(--surface); }
        .spp-input::placeholder { color: var(--text2); opacity: 0.6; }

        .spp-textarea {
          width: 100%; padding: 12px 14px;
          border: 1.5px solid var(--border);
          border-radius: 11px; font-size: 14px;
          background: var(--surface2); color: var(--text);
          outline: none; resize: vertical; min-height: 100px; line-height: 1.6;
          transition: border-color 0.18s, background 0.18s;
          font-family: inherit;
        }
        .spp-textarea:focus { border-color: var(--accent); background: var(--surface); }
        .spp-textarea::placeholder { color: var(--text2); opacity: 0.6; }

        .spp-submit {
          width: 100%; padding: 14px;
          background: var(--text); color: var(--bg);
          border: none; border-radius: 12px; cursor: pointer;
          font-size: 14px; font-weight: 700;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: opacity 0.18s, transform 0.15s;
          font-family: inherit;
        }
        .spp-submit:hover:not(:disabled) { opacity: 0.82; transform: translateY(-1px); }
        .spp-submit:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

        /* Toast */
        .spp-toast {
          position: fixed; bottom: 28px; right: 28px;
          display: flex; align-items: center; gap: 10px;
          padding: 14px 20px; border-radius: 14px;
          font-size: 13px; font-weight: 600;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18);
          animation: sppSlideUp 0.3s ease;
          z-index: 999;
        }
        .spp-toast.success { background: #16a34a; color: #fff; }
        .spp-toast.error   { background: #dc2626; color: #fff; }
        @keyframes sppSlideUp {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: none; opacity: 1; }
        }

        /* Support card */
        .spp-support {
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 14px; padding: 16px 20px;
          font-size: 13px; color: var(--text2); line-height: 1.55;
        }
        .spp-support a { color: var(--accent); font-weight: 600; text-decoration: none; }
        .spp-support a:hover { text-decoration: underline; }
      `}</style>

      <div className="spp-root">
        {/* Header */}
        <div className="spp-header">
          <h2>Profile Settings</h2>
          <p>Manage your account and public information</p>
        </div>

        {/* Avatar card */}
        <div className="spp-avatar-card">
          <div className="spp-avatar">{initials}</div>
          <div>
            <div className="spp-user-name">{user?.name || "Service Provider"}</div>
            <div className="spp-user-role">✦ Service Provider</div>
            <div className="spp-member-since">Member since {memberSince}</div>
          </div>
        </div>

        {/* Form */}
        <div className="spp-form-card">
          <div className="spp-form-title">Account Information</div>
          <form onSubmit={handleSubmit}>
            {FIELDS.map(field => {
              const Icon = field.icon;
              return (
                <div key={field.key} className="spp-field">
                  <label className="spp-label">
                    <Icon size={13} />
                    {field.label}
                    {field.required && <span style={{ color: "#dc2626", marginLeft: 2 }}>*</span>}
                  </label>
                  <div className="spp-input-wrap">
                    <Icon size={15} className="spp-input-ico" />
                    <input
                      className="spp-input"
                      type={field.type}
                      placeholder={field.placeholder}
                      value={form[field.key]}
                      onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                      required={field.required}
                    />
                  </div>
                </div>
              );
            })}

            <div className="spp-field" style={{ marginBottom: 24 }}>
              <label className="spp-label">Bio / About</label>
              <textarea
                className="spp-textarea"
                placeholder="Tell clients about your experience, skills, and the services you offer…"
                value={form.bio}
                onChange={e => setForm({ ...form, bio: e.target.value })}
                rows={4}
              />
            </div>

            <button type="submit" disabled={loading} className="spp-submit">
              <Save size={17} />
              {loading ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Support */}
        <div className="spp-support">
          Need help? Contact our support team at{" "}
          <a href="mailto:support@hostein.com">support@hostein.com</a>{" "}
          — we typically respond within 24 hours.
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`spp-toast ${toast.type}`}>
          {toast.type === "success"
            ? <CheckCircle size={17} />
            : <AlertCircle size={17} />}
          {toast.msg}
        </div>
      )}
    </>
  );
}