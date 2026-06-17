// frontend/src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api"; //  USE CENTRALIZED API (IMPORTANT)

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  //  Load user from localStorage on app start
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error loading auth:", error);

      //  Clean corrupted storage
      ["user", "token", "role", "userId", "userName"].forEach((k) =>
        localStorage.removeItem(k)
      );
    } finally {
      setLoading(false);
    }
  }, []);

  //  LOGIN FUNCTION (FIXED)
  const login = async (email, password) => {
    if (!email?.trim() || !password?.trim()) {
      throw new Error("Email and password are required");
    }

    try {
      // USE api (not axios) so interceptor works
      const res = await api.post("/auth/login", {
        email: email.trim(),
        password: password.trim(),
      });

      const { token, user: userData } = res.data;

      //Save everything consistently
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("role", userData.role);
      localStorage.setItem("userId", userData.id);
      localStorage.setItem("userName", userData.name);

      // Optional assignment info
      if (userData.hasAssignment) {
        localStorage.setItem("hasAssignment", "true");
        localStorage.setItem(
          "assignmentData",
          JSON.stringify(userData.assignment)
        );
      }

      setUser(userData);
      setIsAuthenticated(true);

      //  Notify other contexts (important for your app)
      window.dispatchEvent(new Event("auth:login"));

      return { success: true, user: userData };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // REGISTER FUNCTION (FIXED)
  const register = async (name, email, password, role, phone) => {
    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        role,
        phone,
      });

      const { token, user: userData } = res.data;

      // Store user after registration
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("role", userData.role);
      localStorage.setItem("userId", userData.id);
      localStorage.setItem("userName", userData.name);

      setUser(userData);
      setIsAuthenticated(true);

      window.dispatchEvent(new Event("auth:login"));

      return { success: true, user: userData };
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  //  LOGOUT FUNCTION
  const logout = () => {
    [
      "user",
      "token",
      "role",
      "userId",
      "userName",
      "hasAssignment",
      "assignmentData",
    ].forEach((k) => localStorage.removeItem(k));

    setUser(null);
    setIsAuthenticated(false);

    window.dispatchEvent(new Event("auth:logout"));

    // Redirect
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};