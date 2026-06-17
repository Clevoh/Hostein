// Create this as: frontend/src/pages/NotificationTest.jsx
// Add to routes.jsx temporarily for testing

import { useNotifications } from "../context/NotificationContext";

export default function NotificationTest() {
  const { addNotification, notifications, unreadCount, isConnected, socket } = useNotifications();

  const testNotifications = [
    {
      title: "Test Message",
      message: "This is a test message notification",
      type: "message"
    },
    {
      title: "Success!",
      message: "This is a success notification",
      type: "success"
    },
    {
      title: "Warning",
      message: "This is a warning notification",
      type: "warning"
    },
    {
      title: "Error",
      message: "This is an error notification",
      type: "error"
    },
    {
      title: "Info",
      message: "This is an info notification",
      type: "info"
    }
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Notification System Test</h1>

      {/* Status */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="font-medium">
              {isConnected ? "✅ Connected" : "❌ Disconnected"}
            </span>
          </div>
          {socket && (
            <p className="text-sm text-gray-600">Socket ID: {socket.id}</p>
          )}
          <p className="text-sm text-gray-600">
            Total Notifications: {notifications.length}
          </p>
          <p className="text-sm text-gray-600">
            Unread: {unreadCount}
          </p>
        </div>
      </div>

      {/* Test Buttons */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Notifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {testNotifications.map((notif, index) => (
            <button
              key={index}
              onClick={() => addNotification(notif.title, notif.message, notif.type)}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-left"
            >
              <div className="font-medium">{notif.title}</div>
              <div className="text-sm text-blue-100">{notif.type}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>
        {notifications.length === 0 ? (
          <p className="text-gray-500">No notifications yet. Click a button above to test.</p>
        ) : (
          <div className="space-y-2">
            {notifications.slice(0, 5).map((notif) => (
              <div
                key={notif.id}
                className={`p-3 rounded-lg border ${
                  !notif.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{notif.title}</p>
                    <p className="text-sm text-gray-600">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {notif.type} • {notif.time}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    !notif.read ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {notif.read ? 'Read' : 'Unread'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Console Log Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
        <h3 className="font-semibold text-yellow-900 mb-2">📋 Debugging Tips:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-800">
          <li>Open browser console (F12)</li>
          <li>Look for Socket.io connection messages</li>
          <li>Click a test button above</li>
          <li>Check if notification appears in console</li>
          <li>Check if bell icon updates</li>
          <li>Click bell icon to see notifications</li>
        </ol>
      </div>
    </div>
  );
}
