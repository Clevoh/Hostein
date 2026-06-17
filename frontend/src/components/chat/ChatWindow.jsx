// frontend/src/components/chat/ChatWindow.jsx
import { useState, useEffect, useRef } from "react";
import {
  Send, Paperclip, MapPin,
  X, Download, ExternalLink, Loader2,
} from "lucide-react";
import io from "socket.io-client";

// FIX: was pointing at the Vite dev server (5173) — must be the Express backend
const API_URL = import.meta.env.VITE_API_URL;

// ─── ID helpers (same as PropertyChatWindow) ──────────────────────────────────
function toStr(val) {
  if (!val) return "";
  if (typeof val === "string") return val.trim().toLowerCase();
  if (typeof val === "object" && val._id)
    return val._id.toString().trim().toLowerCase();
  return val.toString().trim().toLowerCase();
}

function sameId(a, b) {
  const sa = toStr(a);
  const sb = toStr(b);
  return sa.length > 0 && sb.length > 0 && sa === sb;
}

export default function ChatWindow({ booking, currentUserId, onClose }) {
  const [messages,         setMessages]         = useState([]);
  const [newMessage,       setNewMessage]       = useState("");
  const [loading,          setLoading]          = useState(true);
  const [sending,          setSending]          = useState(false);
  const [typing,           setTyping]           = useState(false);
  const [socket,           setSocket]           = useState(null);
  const [otherUserId,      setOtherUserId]      = useState(null);
  const [otherUserName,    setOtherUserName]    = useState("User");
  const [currentUserName,  setCurrentUserName]  = useState("You");

  const messagesEndRef = useRef(null);
  const fileInputRef   = useRef(null);
  const typingTimer    = useRef(null);

  // ── Determine other user from booking ─────────────────────────────────────
  useEffect(() => {
    if (!booking || !currentUserId) return;

    console.log("📋 Full Booking:", booking);
    console.log("👤 Current User ID:", currentUserId);

    const currentStr = toStr(currentUserId);

    // Case 1: provider / client are populated objects
    if (booking.provider?._id && booking.client?._id) {
      const isClient   = sameId(booking.client._id, currentUserId);
      const otherId    = isClient ? toStr(booking.provider._id) : toStr(booking.client._id);
      const otherName  = isClient ? (booking.provider.name || "Provider") : (booking.client.name || "Client");
      const myName     = isClient ? (booking.client.name   || "You")      : (booking.provider.name || "You");

      console.log("✅ Case 1 roles:", { isClient, myName, otherId, otherName });
      setOtherUserId(otherId);
      setOtherUserName(otherName);
      setCurrentUserName(myName);
      return;
    }

    // Case 2: provider / client are plain ID strings
    if (booking.provider && booking.client) {
      const providerId = toStr(booking.provider);
      const clientId   = toStr(booking.client);
      const isClient   = currentStr === clientId;
      const otherId    = isClient ? providerId : clientId;

      console.log("✅ Case 2 IDs:", { providerId, clientId, currentStr, isClient });
      setOtherUserId(otherId);
      setOtherUserName(isClient ? "Provider" : "Client");
      setCurrentUserName(isClient ? "You" : "Provider");
      return;
    }

    // Case 3: alternative field names
    if (booking.providerId && booking.clientId) {
      const isClient = currentStr === toStr(booking.clientId);
      const otherId  = isClient ? toStr(booking.providerId) : toStr(booking.clientId);

      setOtherUserId(otherId);
      setOtherUserName(isClient ? "Provider" : "Client");
      setCurrentUserName(isClient ? "You" : "Provider");
      return;
    }

    console.error("❌ Could not determine users from booking:", booking);
  }, [booking, currentUserId]);

  // ── Socket ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!otherUserId || !booking._id) return;

    const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("register_user", currentUserId);
      newSocket.emit("join_booking",  booking._id);
      console.log("🔌 ChatWindow socket connected, room:", booking._id);
    });

    // Deduplicate by _id to avoid double-render on echo
    newSocket.on("new_message", (message) => {
      console.log("📨 New message:", message);
      setMessages((prev) => {
        if (prev.find((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
      scrollToBottom();
    });

    newSocket.on("user_typing",      () => setTyping(true));
    newSocket.on("user_stop_typing", () => setTyping(false));

    fetchMessages();

    return () => {
      newSocket.emit("leave_booking", booking._id);
      newSocket.close();
      clearTimeout(typingTimer.current);
    };
  }, [booking._id, otherUserId]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/api/messages/booking/${booking._id}`, {
        headers: authHeader(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      console.log("📬 Fetched messages:", data.length);
      setMessages(data);
      scrollToBottom();
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleTyping = () => {
    socket?.emit("typing", { bookingId: booking._id, userName: currentUserName });
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(
      () => socket?.emit("stop_typing", { bookingId: booking._id }),
      2000
    );
  };

  // ── Send text ──────────────────────────────────────────────────────────────
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    const text = newMessage.trim();
    if (!text || sending || !otherUserId) return;

    setSending(true);
    setNewMessage("");

    try {
      const res = await fetch(`${API_URL}/api/messages/send`, {
        method:  "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body:    JSON.stringify({
          bookingId:  booking._id,
          receiverId: otherUserId,
          content:    text,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to send message");
      }
      socket?.emit("stop_typing", { bookingId: booking._id });
    } catch (error) {
      console.error("Send message error:", error);
      alert("Failed to send message: " + error.message);
      setNewMessage(text);
    } finally {
      setSending(false);
    }
  };

  // ── Send file ──────────────────────────────────────────────────────────────
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !otherUserId) return;
    e.target.value = "";

    const formData = new FormData();
    formData.append("file",        file);
    formData.append("bookingId",   booking._id);
    formData.append("receiverId",  otherUserId);
    formData.append("messageType", file.type.startsWith("image/") ? "image" : "file");

    try {
      const res = await fetch(`${API_URL}/api/messages/send-file`, {
        method: "POST", headers: authHeader(), body: formData,
      });
      if (!res.ok) throw new Error("Failed to upload file");
    } catch (error) {
      console.error("File upload error:", error);
      alert("Failed to upload file: " + error.message);
    }
  };

  // ── Share location ─────────────────────────────────────────────────────────
  const handleShareLocation = () => {
    if (!navigator.geolocation || !otherUserId) return;
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(`${API_URL}/api/messages/send-location`, {
            method:  "POST",
            headers: { "Content-Type": "application/json", ...authHeader() },
            body:    JSON.stringify({
              bookingId:  booking._id,
              receiverId: otherUserId,
              latitude:   coords.latitude,
              longitude:  coords.longitude,
              address:    "Current Location",
            }),
          });
          if (!res.ok) throw new Error("Failed to share location");
        } catch (error) {
          console.error("Share location error:", error);
          alert("Failed to share location: " + error.message);
        }
      },
      () => alert("Could not get your location. Please enable location services.")
    );
  };

  // ── Date helpers ───────────────────────────────────────────────────────────
  const formatTime = (date) =>
    new Date(date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  const formatDate = (date) => {
    const d    = new Date(date);
    const now  = new Date();
    const yest = new Date(now);
    yest.setDate(yest.getDate() - 1);
    if (d.toDateString() === now.toDateString())  return "Today";
    if (d.toDateString() === yest.toDateString()) return "Yesterday";
    return d.toLocaleDateString("en-US", {
      month: "short",
      day:   "numeric",
      ...(d.getFullYear() !== now.getFullYear() && { year: "numeric" }),
    });
  };

  const groupedMessages = messages.reduce((groups, msg) => {
    const date = formatDate(msg.createdAt);
    (groups[date] = groups[date] || []).push(msg);
    return groups;
  }, {});

  // ── Guards ─────────────────────────────────────────────────────────────────
  if (!otherUserId && booking && currentUserId) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md flex flex-col items-center">
          <Loader2 className="animate-spin mb-4" size={32} />
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!otherUserId) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md">
          <h3 className="text-lg font-bold mb-2 text-red-600">Cannot Open Chat</h3>
          <p className="text-gray-600 mb-4">Unable to determine the other user in this conversation.</p>
          <button onClick={onClose} className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            Close
          </button>
        </div>
      </div>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl h-[600px] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg">
              {otherUserName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-base">{otherUserName}</h3>
              <p className="text-xs text-white/80">{booking.serviceType}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto p-4 bg-gray-50"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4d4d4' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="animate-spin text-green-600" size={32} />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Send className="text-green-600" size={32} />
              </div>
              <p className="text-gray-500 text-sm">No messages yet</p>
              <p className="text-gray-400 text-xs mt-1">Start the conversation!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(groupedMessages).map(([date, msgs]) => (
                <div key={date}>
                  {/* Date divider */}
                  <div className="flex items-center justify-center my-4">
                    <div className="bg-white px-3 py-1 rounded-full shadow-sm">
                      <p className="text-xs text-gray-500 font-medium">{date}</p>
                    </div>
                  </div>

                  {msgs.map((msg) => {
                    // FIX: use toStr() so populated objects compare correctly
                    const isMine     = sameId(msg.sender, currentUserId);
                    const senderName = isMine ? currentUserName : otherUserName;

                    return (
                      <div key={msg._id} className={`flex ${isMine ? "justify-end" : "justify-start"} mb-2`}>
                        <div className="max-w-[75%]">
                          {/* Sender name */}
                          <p className={`text-xs font-medium mb-1 px-2 ${
                            isMine ? "text-right text-green-700" : "text-left text-gray-600"
                          }`}>
                            {senderName}
                          </p>

                          {/* Bubble */}
                          <div className={`rounded-lg px-3 py-2 shadow-sm ${
                            isMine
                              ? "bg-green-500 text-white rounded-tr-none"
                              : "bg-white text-gray-800 rounded-tl-none"
                          }`}>
                            {msg.messageType === "text" && (
                              <p className="text-sm leading-relaxed break-words">{msg.content}</p>
                            )}

                            {msg.messageType === "image" && (
                              <div>
                                <img
                                  src={`${API_URL}${msg.fileUrl}`}
                                  alt="Shared"
                                  className="rounded-lg max-w-full h-auto mb-2 cursor-pointer hover:opacity-90 transition"
                                  onClick={() => window.open(`${API_URL}${msg.fileUrl}`, "_blank")}
                                />
                                <a
                                  href={`${API_URL}${msg.fileUrl}`}
                                  download
                                  className={`text-xs flex items-center gap-1 hover:underline ${
                                    isMine ? "text-white/90" : "text-gray-600"
                                  }`}
                                >
                                  <Download size={12} /> Download
                                </a>
                              </div>
                            )}

                            {msg.messageType === "file" && (
                              <div className="flex items-center gap-2">
                                <div className={`p-2 rounded ${isMine ? "bg-white/20" : "bg-gray-100"}`}>
                                  <Paperclip size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium truncate">{msg.fileName}</p>
                                  <a
                                    href={`${API_URL}${msg.fileUrl}`}
                                    download
                                    className={`text-xs hover:underline flex items-center gap-1 mt-1 ${
                                      isMine ? "text-white/90" : "text-gray-600"
                                    }`}
                                  >
                                    <Download size={10} /> Download
                                  </a>
                                </div>
                              </div>
                            )}

                            {msg.messageType === "location" && (
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <MapPin size={16} />
                                  <p className="text-xs font-medium">Location Shared</p>
                                </div>
                                <a
                                  href={`https://www.google.com/maps?q=${msg.location.latitude},${msg.location.longitude}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`text-xs hover:underline flex items-center gap-1 ${
                                    isMine ? "text-white/90" : "text-blue-600"
                                  }`}
                                >
                                  <ExternalLink size={12} /> Open in Google Maps
                                </a>
                              </div>
                            )}

                            {/* Timestamp */}
                            <p className={`text-[10px] mt-1 text-right ${
                              isMine ? "text-white/70" : "text-gray-400"
                            }`}>
                              {formatTime(msg.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <div className="flex justify-start mb-2">
                  <div className="max-w-[75%]">
                    <p className="text-xs font-medium mb-1 px-2 text-left text-gray-600">
                      {otherUserName}
                    </p>
                    <div className="bg-white rounded-lg rounded-tl-none px-4 py-3 shadow-sm">
                      <div className="flex gap-1">
                        {[0, 150, 300].map((d) => (
                          <span
                            key={d}
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: `${d}ms` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-white rounded-b-2xl">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 hover:bg-gray-100 rounded-full transition text-gray-600"
              title="Attach file"
            >
              <Paperclip size={20} />
            </button>
            <button
              type="button"
              onClick={handleShareLocation}
              className="p-2.5 hover:bg-gray-100 rounded-full transition text-gray-600"
              title="Share location"
            >
              <MapPin size={20} />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => { setNewMessage(e.target.value); handleTyping(); }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
              }}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-full outline-none focus:border-green-500 transition"
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending}
              className="p-2.5 bg-green-600 hover:bg-green-700 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {sending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}