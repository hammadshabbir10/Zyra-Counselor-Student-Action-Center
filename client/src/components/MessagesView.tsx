import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllMessages } from "../api/actionCenter";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import { useAppStore } from "../store/appStore";

export function MessagesView() {
  const selectedStudentId = useAppStore((s) => s.selectedStudentId);
  const { data: allMessages, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["allMessages"],
    queryFn: fetchAllMessages,
  });

  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

  useEffect(() => {
    // Reset selection when student changes
    setSelectedMessageId(null);
  }, [selectedStudentId]);

  if (isLoading) return <LoadingState />;

  if (isError) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : "Failed to load messages."}
        onRetry={() => refetch()}
      />
    );
  }

  const messages = allMessages?.filter(m => m.studentId === selectedStudentId) || [];

  if (!messages || messages.length === 0) return <div className="empty-state">No messages available for this student.</div>;

  const selectedMessage = messages.find(m => m.id === selectedMessageId) || messages[0];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };
  
  const formatFullDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
  };

  return (
    <div className="tab-container messages-view">
      <div className="tab-header" style={{ marginBottom: '24px' }}>
        <div className="header-text">
          <h2 className="tab-title">Messages Inbox</h2>
          <p className="tab-subtitle">Direct communication history and student support threads.</p>
        </div>
      </div>
      <div className="messages-layout">
        <div className="messages-sidebar">
          <div className="messages-sidebar-header" style={{ paddingBottom: '12px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', margin: 0 }}>Inbox</h3>
          </div>
          <div className="messages-list">
            {messages.map((msg) => {
              return (
                <div 
                  key={msg.id} 
                  className={`message-list-item ${selectedMessage.id === msg.id ? 'active' : ''} ${!msg.read ? 'unread' : ''}`}
                  onClick={() => setSelectedMessageId(msg.id)}
                >
                  <div className="message-list-header">
                    <span className="message-sender">{msg.from}</span>
                    <span className="message-time">{formatDate(msg.receivedAt)}</span>
                  </div>
                  <div className="message-subject-line">{msg.subject}</div>
                  <div className="message-tags">
                    {!msg.read && <span className="tag-new">New</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="messages-content">
          <div className="messages-content-header">
            <div className="message-sender-info">
              <div className="sender-avatar">
                {getInitials(selectedMessage.from)}
              </div>
              <div>
                <div className="sender-name">{selectedMessage.from}</div>
                <div className="sender-meta">{selectedMessage.subject}</div>
              </div>
            </div>
            <div className="message-actions">
              <button className="btn-outline">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: 4}}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                {selectedMessage.studentName?.split(' ')[0]}'s Profile
              </button>
            </div>
          </div>
          
          <div className="messages-thread">
            <div className="thread-date-divider"><span>TODAY</span></div>
            
            <div className="chat-bubble chat-incoming">
              {selectedMessage.preview}
            </div>
            <div className="chat-time-incoming">{formatFullDate(selectedMessage.receivedAt)}</div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
