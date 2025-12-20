import React, { useState } from "react";

export default function ClientProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const [alert, setAlert] = useState(null);

  const [profile, setProfile] = useState({
    name: "Clevo Lih",
    email: "clevolih@gmail.com",
    phone: "+123 456 789",
    avatar: null,
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, avatar: URL.createObjectURL(file) });
    }
  };

  /* PASSWORD STRENGTH */
  const passwordStrength = () => {
    const p = passwords.newPass;
    if (p.length === 0) return 0;
    if (p.length < 6) return 25;
    if (p.match(/[A-Z]/) && p.match(/[0-9]/)) return 75;
    if (p.match(/[A-Z]/) && p.match(/[0-9]/) && p.match(/[^A-Za-z0-9]/)) return 100;
    return 50;
  };

  const handleUpdatePassword = () => {
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      setAlert({ type: "error", message: "All password fields are required." });
      return;
    }

    if (passwords.newPass !== passwords.confirm) {
      setAlert({ type: "error", message: "Passwords do not match." });
      return;
    }

    setAlert({ type: "success", message: "Password updated successfully!" });
    setPasswords({ current: "", newPass: "", confirm: "" });
    setShowPasswordForm(false);
  };

  return (
    <div className="max-w-3xl space-y-8">

      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

      {/* ALERT */}
      {alert && (
        <div
          className={`p-4 rounded border ${
            alert.type === "success"
              ? "bg-green-50 border-green-400 text-green-700"
              : "bg-red-50 border-red-400 text-red-700"
          }`}
        >
          {alert.message}
        </div>
      )}

      {/* PROFILE CARD */}
      <div className="bg-white border rounded-lg p-6 space-y-6">

        {/* AVATAR */}
        <div className="flex items-center gap-6">
          <img
            src={profile.avatar || "https://via.placeholder.com/80"}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border"
          />

          <label className="cursor-pointer text-blue-600 font-medium">
            Upload Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
        </div>

        {/* PROFILE INFO */}
        <div className="grid gap-4">
          {["name", "email", "phone"].map((field) => (
            <div key={field}>
              <label className="text-sm text-gray-600 capitalize">{field}</label>
              <input
                name={field}
                disabled={!isEditing}
                value={profile[field]}
                onChange={handleProfileChange}
                className="w-full border rounded px-3 py-2 disabled:bg-gray-100"
              />
            </div>
          ))}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-3 justify-end">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setAlert({ type: "success", message: "Profile updated successfully!" });
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Profile
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* CHANGE PASSWORD DROPDOWN */}
      <div className="bg-white border rounded-lg p-6">

        <button
          onClick={() => setShowPasswordForm(!showPasswordForm)}
          className="w-full flex justify-between items-center font-semibold text-gray-900"
        >
          <span>Change Password</span>
          <span className="text-xl">{showPasswordForm ? "−" : "+"}</span>
        </button>

        <div
          className={`transition-all duration-300 overflow-hidden ${
            showPasswordForm ? "max-h-[500px] mt-6" : "max-h-0"
          }`}
        >
          <div className="space-y-4">

            {["current", "newPass", "confirm"].map((field) => (
              <div key={field} className="relative">
                <input
                  type={showPasswords ? "text" : "password"}
                  name={field}
                  placeholder={
                    field === "current"
                      ? "Current Password"
                      : field === "newPass"
                      ? "New Password"
                      : "Confirm New Password"
                  }
                  value={passwords[field]}
                  onChange={handlePasswordChange}
                  className="w-full border rounded px-3 py-2 pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="absolute right-3 top-2.5 text-gray-500 text-sm"
                >
                  {showPasswords ? "🙈" : "👁️"}
                </button>
              </div>
            ))}

            {/* PASSWORD STRENGTH */}
            <div>
              <div className="h-2 w-full bg-gray-200 rounded">
                <div
                  className={`h-2 rounded ${
                    passwordStrength() < 50
                      ? "bg-red-500"
                      : passwordStrength() < 75
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${passwordStrength()}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">Password strength</p>
            </div>

            <button
              onClick={handleUpdatePassword}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
