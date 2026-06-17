// frontend/src/context/NotificationContext.jsx
// FIX: eliminated registration race condition.
// The socket emits register_user immediately using the cached localStorage.userId
// (fast path), then re-registers once the /profile fetch resolves (accurate path).
// This ensures the user is registered before any booking notification fires.

import { createContext, useContext, useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [socket,        setSocket]        = useState(null);
  const [isConnected,   setIsConnected]   = useState(false);

  // Ref so the socket listener always calls the latest addNotification
  // without needing to re-register the event on every render.
  const addNotificationRef = useRef(null);

  // ── Browser notification permission ──────────────────────────────────────
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // ── Single socket for the whole app ──────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("⚠️ No token — skipping socket");
      return;
    }

    const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
      transports:           ["websocket", "polling"],
      reconnection:         true,
      reconnectionDelay:    1000,
      reconnectionAttempts: 10,
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
      setIsConnected(true);

      // ── Fast-path registration ───────────────────────────────────────────
      // Register immediately with the cached userId so we're subscribed
      // before any async work completes.
      const cachedUserId = localStorage.getItem("userId");
      if (cachedUserId) {
        console.log("👤 Fast-register with cached userId:", cachedUserId);
        newSocket.emit("register_user", cachedUserId);
      }

      // ── Accurate-path registration ───────────────────────────────────────
      // Fetch the real _id from the server and re-register.
      // Also writes userId to localStorage so fast-path works next time.
      fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error(`Profile fetch failed: ${res.status}`);
          return res.json();
        })
        .then((user) => {
          const uid = user._id.toString();
          localStorage.setItem("userId", uid);
          console.log("👤 Accurate-register with server userId:", uid);
          newSocket.emit("register_user", uid);
        })
        .catch((err) => {
          console.error("❌ Profile fetch error:", err.message);
        });
    });

    newSocket.on("connect_error", (err) => {
      console.error("❌ Socket connect error:", err.message);
      setIsConnected(false);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("🔌 Socket disconnected:", reason);
      setIsConnected(false);
    });

    newSocket.on("registration_confirmed", (data) => {
      console.log("✅ Server confirmed registration:", data);
    });

    // ── Incoming notification ────────────────────────────────────────────────
    // Uses a ref so this handler is registered only once but always calls
    // the latest addNotification without stale closure issues.
    newSocket.on("notification", (notification) => {
      console.log("📢 Notification received:", notification);
      addNotificationRef.current?.(
        notification.title,
        notification.message,
        notification.type,
        notification.bookingId
      );
    });

    setSocket(newSocket);

    return () => {
      console.log("🔌 Cleaning up socket");
      newSocket.close();
    };
  }, []); // run once on mount

  // ── addNotification ───────────────────────────────────────────────────────
  const addNotification = (title, message, type = "info", bookingId = null) => {
    const notification = {
      id:        Date.now(),
      title,
      message,
      type,       // info | success | warning | error | booking | message
      read:      false,
      timestamp: new Date(),
      bookingId,
    };

    setNotifications((prev) => [notification, ...prev]);

    if (Notification.permission === "granted") {
      try {
        new Notification(title, {
          body: message,
          icon: "/logo.png",
          tag:  notification.id.toString(),
        });
      } catch (e) {
        console.error("Browser notification error:", e);
      }
    }
  };

  // Keep ref in sync with the latest closure on every render
  addNotificationRef.current = addNotification;

  // ── Derived state + actions ───────────────────────────────────────────────
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const markAllAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const clearAll = () => setNotifications([]);

  const deleteNotification = (id) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
        deleteNotification,
        socket,
        isConnected,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
};