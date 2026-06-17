import api from "./api";

// Get client profile
export const getClientProfile = async () => {
  const res = await api.get("/users/profile");
  return res.data;
};

// Update client profile
export const updateClientProfile = async (profileData) => {
  if (!profileData || typeof profileData !== 'object') {
    throw new Error('Invalid profile data');
  }

  const formData = new FormData();

  Object.keys(profileData).forEach((key) => {
    const value = profileData[key];
    if (key !== "avatar" && value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  // Append avatar if it's a file
  if (profileData.avatar && profileData.avatar instanceof File) {
    formData.append("avatar", profileData.avatar);
  }

  const res = await api.put("/users/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// Change password
export const changePassword = async (passwordData) => {
  if (!passwordData || typeof passwordData !== 'object') {
    throw new Error('Invalid password data');
  }

  if (!passwordData.currentPassword || !passwordData.newPassword) {
    throw new Error('Current password and new password are required');
  }

  const res = await api.put("/users/change-password", {
    currentPassword: passwordData.currentPassword,
    newPassword: passwordData.newPassword,
  });
  return res.data;
};

// Get client dashboard statistics
export const getClientStats = async () => {
  const res = await api.get("/client/stats");
  return res.data;
};

// Get recent activity
export const getRecentActivity = async () => {
  const res = await api.get("/client/activity");
  return res.data;
};

// Get recommended properties
export const getRecommendedProperties = async () => {
  const res = await api.get("/properties/recommended");
  return res.data;
};