import type { ActionCenterSummary } from "../types";

// ---------------------------------------------------------------------------
// SummaryCards — My four quick-glance metric boxes.
// I placed these right under the profile header so the counselor immediately
// sees the raw numbers: total tasks, pending, overdue, and unread messages.
// It's all about minimizing the cognitive load.
// ---------------------------------------------------------------------------
interface SummaryCardsProps {
  summary: ActionCenterSummary;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    {
      label: "Total Tasks",
      value: summary.totalTasks,
      className: "summary-total",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      label: "Pending",
      value: summary.pendingTasks,
      className: "summary-pending",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10 6v4l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: "Overdue",
      value: summary.overdueTasks,
      className: "summary-overdue",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 3l7 12H3L10 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M10 8v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="10" cy="13.5" r="0.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      label: "Unread Messages",
      value: summary.unreadMessages,
      className: "summary-messages",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M2 6l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  return (
    <div className="summary-grid">
      {cards.map((card) => (
        <div key={card.label} className={`summary-card ${card.className}`}>
          <div className="summary-card-icon">{card.icon}</div>
          <div className="summary-card-content">
            <span className="summary-card-value">{card.value}</span>
            <span className="summary-card-label">{card.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
