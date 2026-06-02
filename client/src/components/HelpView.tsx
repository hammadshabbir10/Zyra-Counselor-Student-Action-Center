// ---------------------------------------------------------------------------
// HelpView — My documentation and guide center for the portal.
// I included this because enterprise software can be intimidating. This gives
// counselors a quick reference guide on what each feature does, plus a nice
// way to test the error boundary states.
// ---------------------------------------------------------------------------
export function HelpView() {
  return (
    <div className="tab-container help-view" style={{ animation: "fadeIn 0.4s ease" }}>
      <div className="tab-header" style={{ marginBottom: "28px" }}>
        <div className="header-text">
          <h2 className="tab-title">Help & Guide Center</h2>
          <p className="tab-subtitle">Explore the features and functional guide of the Counselor Portal.</p>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "24px",
        marginBottom: "32px"
      }}>
        {/* Card 1: Overview */}
        <div style={{
          background: "#ffffff",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.02), 0 1px 3px rgba(0,0,0,0.05)",
          border: "1px solid #e5e7eb"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              background: "#eef2ff",
              color: "#4f46e5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#111827", margin: 0 }}>Portal Overview</h3>
          </div>
          <p style={{ fontSize: "0.875rem", color: "#4b5563", lineHeight: "1.6", margin: 0 }}>
            The <strong>Zyra Counselor Portal</strong> is a comprehensive intervention tracking panel designed to consolidate student diagnostics, academic data, counseling logs, task boards, and messages. This ensures that you can identify student distress signals and manage intervention protocols seamlessly.
          </p>
        </div>

        {/* Card 2: Student Directory */}
        <div style={{
          background: "#ffffff",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.02), 0 1px 3px rgba(0,0,0,0.05)",
          border: "1px solid #e5e7eb"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              background: "#ecfeff",
              color: "#0891b2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#111827", margin: 0 }}>Students Directory</h3>
          </div>
          <p style={{ fontSize: "0.875rem", color: "#4b5563", lineHeight: "1.6", margin: 0 }}>
            Displays detailed student cards including enrollment statuses (<strong>At Risk</strong> vs. <strong>On Track</strong>) and academic performance metrics. A dynamic, custom-colored GPA spark-bar shows GPA progress relative to 4.0, allowing you to instantly assess academic standing at a glance.
          </p>
        </div>

        {/* Card 3: Kanban Tasks */}
        <div style={{
          background: "#ffffff",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.02), 0 1px 3px rgba(0,0,0,0.05)",
          border: "1px solid #e5e7eb"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              background: "#f0fdf4",
              color: "#16a34a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
            </div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#111827", margin: 0 }}>Kanban Tasks</h3>
          </div>
          <p style={{ fontSize: "0.875rem", color: "#4b5563", lineHeight: "1.6", margin: 0 }}>
            Organizes student interventions into a clean 3-stage flow: <strong>To Do</strong>, <strong>In Progress</strong>, and <strong>Completed</strong>. Delayed items are automatically flagged with a visual red <code>OVERDUE</code> tag directly on their task card to capture your attention, ensuring crucial support steps never slip by.
          </p>
        </div>

        {/* Card 4: Messages */}
        <div style={{
          background: "#ffffff",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.02), 0 1px 3px rgba(0,0,0,0.05)",
          border: "1px solid #e5e7eb"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              background: "#fff7ed",
              color: "#ea580c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#111827", margin: 0 }}>Communication Hub</h3>
          </div>
          <p style={{ fontSize: "0.875rem", color: "#4b5563", lineHeight: "1.6", margin: 0 }}>
            Maintains full direct chat records linked to support networks. You can view inbox logs specifically filtered by your active student, highlight unread threads with green indicator tags, and review full conversational histories from parents, teachers, and student support.
          </p>
        </div>
      </div>

      {/* Interactive Demonstration Guides */}
      <div style={{
        background: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)",
        borderRadius: "16px",
        padding: "28px",
        border: "1px solid #c7d2fe",
        marginBottom: "28px"
      }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1e1b4b", marginTop: 0, marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
          💡 Loading and Error Fallbacks Testing
        </h3>
        <p style={{ fontSize: "0.9rem", color: "#312e81", lineHeight: "1.6", marginBottom: "18px" }}>
          To demonstrate and verify the visual robustness of our connection fallbacks, we have embedded a test student in the global dropdown:
        </p>
        <div style={{
          background: "#ffffff",
          borderRadius: "8px",
          padding: "16px 20px",
          border: "1px solid #dee2e6"
        }}>
          <ol style={{ fontSize: "0.875rem", color: "#374151", margin: 0, paddingLeft: "20px", lineHeight: "1.7" }}>
            <li style={{ marginBottom: "8px" }}>
              Navigate to the <strong>Top Navbar</strong> dropdown at the top right of the dashboard.
            </li>
            <li style={{ marginBottom: "8px" }}>
              Select <strong>⚠️ [Test Error] Non-existent Student</strong>.
            </li>
            <li>
              The Dashboard will immediately show the premium loading skeleton state, followed by our custom <strong>Error Fallback Screen</strong> confirming the profile failed to load (404 Not Found), demonstrating full resilience to API issues.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
