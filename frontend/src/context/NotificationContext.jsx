import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([
    {
      id: Date.now(),
      title: "Welcome 🎉",
      message: "Your client dashboard is ready.",
      read: false,
      time: "Just now",
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (title, message) => {
    setNotifications(prev => [
      {
        id: Date.now(),
        title,
        message,
        read: false,
        time: "Just now",
      },
      ...prev,
    ]);
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  const clearAll = () => setNotifications([]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
