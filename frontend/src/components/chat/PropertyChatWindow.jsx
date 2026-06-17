// frontend/src/components/chat/PropertyChatWindow.jsx
import { useState, useEffect, useRef } from "react";
import {
  Send, Paperclip, MapPin, X, Download, ExternalLink,
  Loader2, Trash2, Check, CheckCheck,
} from "lucide-react";
import io from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL;

// ─── ID helpers ───────────────────────────────────────────────────────────────
// MongoDB ObjectIds arrive as: plain string, populated object {_id, name}, or
// Mongoose ObjectId. This helper always returns a comparable lowercase string.
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

export default function PropertyChatWindow({ booking, currentUserId, onClose }) {
  const [messages,      setMessages]      = useState([]);
  const [newMessage,    setNewMessage]    = useState("");
  const [loading,       setLoading]       = useState(true);
  const [sending,       setSending]       = useState(false);
  const [typing,        setTyping]        = useState(false);
  const [socket,        setSocket]        = useState(null);
  const [otherUserId,   setOtherUserId]   = useState(null);
  const [otherUserName, setOtherUserName] = useState("User");
  const [myName,        setMyName]        = useState("You");
  const [initError,     setInitError]     = useState(null);
  const [hoveredMsg,    setHoveredMsg]    = useState(null);
  const [deletingMsg,   setDeletingMsg]   = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef   = useRef(null);
  const typingTimer    = useRef(null);

  // ── Determine who is client vs host ──────────────────────────────────────
  useEffect(() => {
    if (!booking || !currentUserId) return;

    const clientStr  = toStr(booking.client);
    const hostStr    = toStr(booking.property?.host);
    const currentStr = toStr(currentUserId);

    console.log("🔍 Chat init →", { currentStr, clientStr, hostStr });

    if (!hostStr) {
      setInitError("Host information is missing. Please refresh and try again.");
      return;
    }

    if (currentStr === clientStr) {
      setOtherUserId(hostStr);
      setOtherUserName(booking.property?.host?.name || "Host");
      setMyName(booking.client?.name || "You");
      console.log("✅ Role: CLIENT");
    } else if (currentStr === hostStr) {
      setOtherUserId(clientStr);
      setOtherUserName(booking.client?.name || "Client");
      setMyName(booking.property?.host?.name || "You");
      console.log("✅ Role: HOST");
    } else {
      setInitError(
        `Could not match your account to this booking.\n` +
        `Your ID : ${currentStr}\nClient  : ${clientStr}\nHost    : ${hostStr}`
      );
    }
  }, [booking, currentUserId]);

  // ── Socket ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!otherUserId || !booking._id) return;

    const sock = io(API_URL, { transports: ["websocket", "polling"], reconnection: true });
    setSocket(sock);

    sock.on("connect", () => {
      sock.emit("register_user", currentUserId);
      sock.emit("join_booking",  booking._id);
      console.log("🔌 Socket connected, joined room:", booking._id);
    });

    // New message arrives — deduplicate by _id
    sock.on("new_message", (msg) => {
      console.log("📨 new_message:", {
        id:      msg._id,
        sender:  toStr(msg.sender),
        current: toStr(currentUserId),
        isMine:  toStr(msg.sender) === toStr(currentUserId),
        content: msg.content?.slice(0, 30),
      });
      setMessages((prev) => {
        if (prev.find((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
      scrollToBottom();
    });

    // Other user deleted a message — remove it from our list
    sock.on("message_deleted", ({ messageId }) => {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    });

    sock.on("user_typing",      () => setTyping(true));
    sock.on("user_stop_typing", () => setTyping(false));

    fetchMessages();

    return () => {
      sock.emit("leave_booking", booking._id);
      sock.close();
      clearTimeout(typingTimer.current);
    };
  }, [booking._id, otherUserId]);

  // ── Helpers ───────────────────────────────────────────────────────────────
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

      // Debug first message so we can verify isMine
      if (data[0]) {
        console.log("📌 First msg sender toStr:", toStr(data[0].sender));
        console.log("📌 currentUserId  toStr:", toStr(currentUserId));
        console.log("📌 isMine result:", toStr(data[0].sender) === toStr(currentUserId));
      }

      setMessages(data);
      scrollToBottom();
    } catch (err) {
      console.error("fetchMessages:", err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () =>
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 80);

  const handleTyping = () => {
    socket?.emit("typing", { bookingId: booking._id, userName: myName });
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(
      () => socket?.emit("stop_typing", { bookingId: booking._id }),
      2000
    );
  };

  // ── Send text ─────────────────────────────────────────────────────────────
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
        throw new Error(err.message || "Send failed");
      }
      socket?.emit("stop_typing", { bookingId: booking._id });
    } catch (err) {
      console.error("Send:", err);
      alert("Failed to send: " + err.message);
      setNewMessage(text);
    } finally {
      setSending(false);
    }
  };

  // ── Delete message ────────────────────────────────────────────────────────
  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("Delete this message?")) return;

    setDeletingMsg(messageId);
    try {
      const res = await fetch(`${API_URL}/api/messages/${messageId}`, {
        method:  "DELETE",
        headers: authHeader(),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Delete failed");
      }
      // Optimistic remove; socket "message_deleted" will handle the other side
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
      socket?.emit("message_deleted", { bookingId: booking._id, messageId });
    } catch (err) {
      console.error("Delete:", err);
      alert("Failed to delete: " + err.message);
    } finally {
      setDeletingMsg(null);
      setHoveredMsg(null);
    }
  };

  // ── Send file ─────────────────────────────────────────────────────────────
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !otherUserId) return;
    e.target.value = "";

    const form = new FormData();
    form.append("file",        file);
    form.append("bookingId",   booking._id);
    form.append("receiverId",  otherUserId);
    form.append("messageType", file.type.startsWith("image/") ? "image" : "file");

    try {
      const res = await fetch(`${API_URL}/api/messages/send-file`, {
        method: "POST", headers: authHeader(), body: form,
      });
      if (!res.ok) throw new Error("Upload failed");
    } catch (err) {
      alert("Upload failed: " + err.message);
    }
  };

  // ── Share location ────────────────────────────────────────────────────────
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
          if (!res.ok) throw new Error("Failed");
        } catch (err) {
          alert("Location error: " + err.message);
        }
      },
      () => alert("Could not get location. Please enable location services.")
    );
  };

  // ── Date helpers ──────────────────────────────────────────────────────────
  const formatTime = (d) =>
    new Date(d).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  const formatDateLabel = (d) => {
    const date = new Date(d);
    const now  = new Date();
    const yest = new Date(now); yest.setDate(yest.getDate() - 1);
    if (date.toDateString() === now.toDateString())  return "Today";
    if (date.toDateString() === yest.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-US", {
      month: "short", day: "numeric",
      ...(date.getFullYear() !== now.getFullYear() && { year: "numeric" }),
    });
  };

  const grouped = messages.reduce((acc, msg) => {
    const label = formatDateLabel(msg.createdAt);
    (acc[label] = acc[label] || []).push(msg);
    return acc;
  }, {});

  // ── Guards ────────────────────────────────────────────────────────────────
  if (initError) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
          <h3 className="font-bold text-red-600 mb-2">Cannot Open Chat</h3>
          <p className="text-gray-600 text-sm whitespace-pre-line mb-4">{initError}</p>
          <button onClick={onClose} className="w-full py-2 bg-gray-700 text-white rounded-lg">
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!otherUserId) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-3 shadow-xl">
          <Loader2 className="animate-spin text-blue-500" size={36} />
          <p className="text-gray-700 font-medium">Loading chat…</p>
        </div>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div
        className="w-full max-w-lg flex flex-col rounded-2xl overflow-hidden shadow-2xl"
        style={{ height: "min(92vh, 680px)" }}
      >
        {/* ── Header ── */}
        <div
          className="flex items-center gap-3 px-4 py-3 flex-shrink-0 text-white"
          style={{ background: "linear-gradient(135deg,#1565c0,#1976d2)" }}
        >
          <div className="w-10 h-10 rounded-full bg-white/25 flex items-center justify-center font-bold text-base uppercase flex-shrink-0">
            {otherUserName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm leading-tight truncate">{otherUserName}</p>
            <p className="text-[11px] text-blue-100 truncate">
              {booking.property?.title || "Property Booking"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Messages ── */}
        <div className="flex-1 overflow-y-auto px-3 py-3" style={{ background: "#e5ddd5" }}>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="animate-spin text-gray-500" size={32} />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <div className="w-14 h-14 rounded-full bg-white/70 flex items-center justify-center">
                <Send size={22} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-600">No messages yet</p>
              <p className="text-xs text-gray-400">Say hello!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {Object.entries(grouped).map(([label, msgs]) => (
                <div key={label}>
                  {/* Date pill */}
                  <div className="flex justify-center my-3">
                    <span className="bg-white/80 text-gray-500 text-[11px] font-medium px-3 py-0.5 rounded-full shadow-sm select-none">
                      {label}
                    </span>
                  </div>

                  {msgs.map((msg, i) => {
                    // ── THE KEY FIX: always compare via toStr() ──
                    const senderStr  = toStr(msg.sender);
                    const currentStr = toStr(currentUserId);
                    const isMine     = senderStr.length > 0 && senderStr === currentStr;

                    const prevSender   = toStr(msgs[i - 1]?.sender);
                    const nextSender   = toStr(msgs[i + 1]?.sender);
                    const isFirstInRun = prevSender !== senderStr;
                    const isLastInRun  = nextSender !== senderStr;

                    const isHovered  = hoveredMsg  === msg._id;
                    const isDeleting = deletingMsg === msg._id;

                    return (
                      <div
                        key={msg._id}
                        className={`flex items-end gap-1.5
                          ${isMine ? "justify-end" : "justify-start"}
                          ${isFirstInRun ? "mt-2" : "mt-[2px]"}`}
                        onMouseEnter={() => setHoveredMsg(msg._id)}
                        onMouseLeave={() => setHoveredMsg(null)}
                      >
                        {/* Left avatar — received messages */}
                        {!isMine && (
                          <div
                            className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center
                              justify-center text-white text-xs font-bold
                              ${isLastInRun ? "bg-blue-500" : "invisible"}`}
                          >
                            {otherUserName.charAt(0).toUpperCase()}
                          </div>
                        )}

                        {/* Trash icon — own messages on hover */}
                        {isMine && (
                          <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center mb-0.5">
                            {isDeleting ? (
                              <Loader2 size={13} className="animate-spin text-gray-400" />
                            ) : isHovered ? (
                              <button
                                onClick={() => handleDeleteMessage(msg._id)}
                                className="w-7 h-7 flex items-center justify-center rounded-full
                                  bg-white/80 hover:bg-red-100 text-gray-400 hover:text-red-600
                                  shadow-sm transition"
                                title="Delete message"
                              >
                                <Trash2 size={13} />
                              </button>
                            ) : null}
                          </div>
                        )}

                        {/* Bubble */}
                        <div className={`flex flex-col max-w-[72%] ${isMine ? "items-end" : "items-start"}`}>

                          {/* Sender name — received, first bubble in run */}
                          {!isMine && isFirstInRun && (
                            <span className="text-[11px] font-semibold text-blue-700 ml-1 mb-0.5 select-none">
                              {otherUserName}
                            </span>
                          )}

                          <div
                            className={`relative px-3 pt-2 pb-1.5 shadow-sm
                              ${isMine
                                ? `bg-[#dcf8c6] text-gray-900 rounded-2xl
                                   ${isFirstInRun ? "rounded-tr-sm" : ""}`
                                : `bg-white text-gray-900 rounded-2xl
                                   ${isFirstInRun ? "rounded-tl-sm" : ""}`
                              }`}
                          >
                            {/* TEXT */}
                            {msg.messageType === "text" && (
                              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words pr-10">
                                {msg.content}
                              </p>
                            )}

                            {/* IMAGE */}
                            {msg.messageType === "image" && (
                              <div className="mb-1">
                                <img
                                  src={`${API_URL}${msg.fileUrl}`}
                                  alt="shared"
                                  className="rounded-xl max-w-full h-auto cursor-pointer hover:opacity-90 transition"
                                  onClick={() => window.open(`${API_URL}${msg.fileUrl}`, "_blank")}
                                />
                                <a
                                  href={`${API_URL}${msg.fileUrl}`}
                                  download
                                  className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-700 mt-1"
                                >
                                  <Download size={11} /> Download
                                </a>
                              </div>
                            )}

                            {/* FILE */}
                            {msg.messageType === "file" && (
                              <div className="flex items-center gap-2 bg-black/5 rounded-xl px-2 py-1.5 mb-1">
                                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Paperclip size={14} className="text-white" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-medium truncate max-w-[130px]">{msg.fileName}</p>
                                  <a
                                    href={`${API_URL}${msg.fileUrl}`}
                                    download
                                    className="flex items-center gap-0.5 text-[11px] text-blue-500 hover:underline"
                                  >
                                    <Download size={10} /> Download
                                  </a>
                                </div>
                              </div>
                            )}

                            {/* LOCATION */}
                            {msg.messageType === "location" && (
                              <div className="mb-1">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <MapPin size={14} className="text-red-500 flex-shrink-0" />
                                  <span className="text-xs font-medium">Location shared</span>
                                </div>
                                <a
                                  href={`https://www.google.com/maps?q=${msg.location?.latitude},${msg.location?.longitude}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-[11px] text-blue-500 hover:underline"
                                >
                                  <ExternalLink size={11} /> Open in Google Maps
                                </a>
                              </div>
                            )}

                            {/* Timestamp + read tick */}
                            <div className="flex items-center justify-end gap-0.5 mt-0.5">
                              <span className="text-[10px] text-gray-400 leading-none select-none">
                                {formatTime(msg.createdAt)}
                              </span>
                              {isMine && (
                                msg.isRead
                                  ? <CheckCheck size={14} className="text-blue-400 flex-shrink-0 ml-0.5" />
                                  : <Check      size={14} className="text-gray-400 flex-shrink-0 ml-0.5" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right spacer — received messages (keeps alignment) */}
                        {!isMine && <div className="w-7 flex-shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <div className="flex items-end gap-1.5 justify-start mt-2">
                  <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {otherUserName.charAt(0).toUpperCase()}
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                    <div className="flex gap-1 items-center h-4">
                      {[0, 200, 400].map((d) => (
                        <span
                          key={d}
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${d}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* ── Input bar ── */}
        <div
          className="flex-shrink-0 px-2 py-2 flex items-center gap-1.5"
          style={{ background: "#f0f2f5" }}
        >
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
            className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-full transition"
            title="Attach file"
          >
            <Paperclip size={20} />
          </button>

          <button
            type="button"
            onClick={handleShareLocation}
            className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-full transition"
            title="Share location"
          >
            <MapPin size={20} />
          </button>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => { setNewMessage(e.target.value); handleTyping(); }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type a message"
            className="flex-1 bg-white rounded-full px-4 py-2.5 text-sm outline-none
              border border-transparent focus:border-blue-300 shadow-sm transition"
          />

          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700
              disabled:opacity-40 text-white rounded-full shadow transition flex-shrink-0"
          >
            {sending
              ? <Loader2 className="animate-spin" size={18} />
              : <Send size={18} />
            }
          </button>
        </div>
      </div>
    </div>
  );
}