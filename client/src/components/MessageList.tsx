import type { Message } from "../types";
import { useAppStore } from "../store/appStore";

// ---------------------------------------------------------------------------
// MessageList — My mini-inbox component for the dashboard.
// Instead of showing all messages, I limit this to the top 3 most recent,
// prioritizing unread messages first. It gives the counselor just enough
// context without cluttering the screen.
// ---------------------------------------------------------------------------
interface MessageListProps {
  messages: Message[];
  unreadCount: number;
}

export function MessageList({ messages, unreadCount }: MessageListProps) {
  const setActiveTab = useAppStore((s) => s.setActiveTab);

  // Sort: unread first, then most recent
  const sortedMessages = [...messages].sort((a, b) => {
    if (a.read !== b.read) return a.read ? 1 : -1;
    return (
      new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
    );
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
  };

  return (
    <div className="message-section">
      <div className="message-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className="section-title">
          Messages
        </h3>
        {unreadCount > 0 && (
          <span className="unread-badge" style={{ background: '#9f1239', color: 'white', borderRadius: '12px', padding: '2px 8px', fontSize: '0.625rem' }}>
            {unreadCount} NEW
          </span>
        )}
      </div>

      <div className="message-list">
        {sortedMessages.slice(0, 3).map((msg) => (
          <div
            key={msg.id}
            className={`message-card ${!msg.read ? "message-unread" : ""}`}
            style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', background: '#f8fafc', borderRadius: '12px', marginBottom: '8px', borderLeft: !msg.read ? '3px solid #312e81' : 'none' }}
          >
            <div className="message-top-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#e0e7ff', color: '#312e81', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  {getInitials(msg.from)}
                </div>
                <span className="message-from" style={{ color: '#1e3a8a' }}>{msg.from}</span>
              </div>
              <span className="message-date">{formatDate(msg.receivedAt)}</span>
            </div>
            <p className="message-subject" style={{ color: '#1e3a8a', fontWeight: 600 }}>{msg.subject}</p>
            <p className="message-preview">{msg.preview}</p>
          </div>
        ))}
      </div>
      <div style={{ padding: '16px', textAlign: 'center', borderTop: '1px solid #e2e8f0' }}>
        <button 
          className="btn-text" 
          onClick={() => setActiveTab("messages")}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600, color: '#312e81' }}
        >
          View All Messages 
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
        </button>
      </div>
    </div>
  );
}
