import { useAppStore } from "../store/appStore";

// ---------------------------------------------------------------------------
// LandingPage — My marketing-style homepage that greets the counselor before
// they enter the full dashboard. I designed it to match the same dark navy
// color palette as my TopNav (#111827) and sidebar, so the transition into
// the app feels seamless.
//
// Sections:
//   1. Hero — headline, subtitle, and a CTA button that opens the dashboard
//   2. Features — three cards highlighting the main capabilities
//   3. Steps — a simple 3-step workflow overview
//   4. Footer — minimal branding footer
//
// Clicking "Open Action Center" sets currentPage to "app" in my Zustand
// store, which instantly renders the full sidebar+topnav+dashboard layout.
// ---------------------------------------------------------------------------

const logoUrl = new URL("../public/Zyra_logo.png", import.meta.url).href;

export function LandingPage() {
  const setCurrentPage = useAppStore((s) => s.setCurrentPage);

  const handleOpenApp = () => {
    setCurrentPage("app");
  };

  return (
    <div className="landing-page">
      {/* ── Navbar ── */}
      <nav className="landing-nav">
        <div className="landing-nav-brand">
          <img src={logoUrl} alt="Zyra" className="landing-nav-logo" />
          <span className="landing-nav-text">Zyra</span>
        </div>
        <div className="landing-nav-links">
          <a href="#features" className="landing-link">Features</a>
          <a href="#how-it-works" className="landing-link">How It Works</a>
          <button className="landing-cta-btn-small" onClick={handleOpenApp}>
            Launch App
          </button>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <span className="landing-hero-tag">For School Counselors</span>
          <h1 className="landing-hero-title">
            Every student's priorities,{" "}
            <span className="landing-hero-highlight">in one place.</span>
          </h1>
          <p className="landing-hero-subtitle">
            Zyra Action Center gives counselors an instant snapshot of each
            student's tasks, messages, and urgency level — so nothing falls
            through the cracks.
          </p>
          <div className="landing-hero-actions">
            <button className="landing-cta-btn" onClick={handleOpenApp}>
              Open Action Center
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>

        {/* Preview card — a mini mockup of the dashboard */}
        <div className="landing-hero-preview">
          <div className="preview-card">
            <div className="preview-header">
              <div className="preview-dot red" />
              <div className="preview-dot yellow" />
              <div className="preview-dot green" />
            </div>
            <div className="preview-body">
              <div className="preview-profile-row">
                <div className="preview-avatar">MP</div>
                <div>
                  <div className="preview-name">Maya Patel</div>
                  <div className="preview-meta">Grade 11 · GPA 3.2</div>
                </div>
                <span className="preview-urgency-badge">At Risk</span>
              </div>
              <div className="preview-stats-row">
                <div className="preview-stat">
                  <span className="preview-stat-value">5</span>
                  <span className="preview-stat-label">Tasks</span>
                </div>
                <div className="preview-stat">
                  <span className="preview-stat-value">2</span>
                  <span className="preview-stat-label">Urgent</span>
                </div>
                <div className="preview-stat">
                  <span className="preview-stat-value">3</span>
                  <span className="preview-stat-label">Unread</span>
                </div>
              </div>
              <div className="preview-task-list">
                <div className="preview-task">
                  <div className="preview-task-check" />
                  <span>Submit FAFSA application</span>
                  <span className="preview-badge urgent">Urgent</span>
                </div>
                <div className="preview-task">
                  <div className="preview-task-check" />
                  <span>Meet with math tutor</span>
                  <span className="preview-badge high">High</span>
                </div>
                <div className="preview-task done">
                  <div className="preview-task-check checked" />
                  <span>Parent-counselor meeting</span>
                  <span className="preview-badge done-badge">Done</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="landing-features" id="features">
        <div className="landing-section-header">
          <span className="landing-section-tag">What It Does</span>
          <h2 className="landing-section-title">
            Built around how counselors actually work
          </h2>
        </div>
        <div className="landing-features-grid">
          <div className="landing-feature-card">
            <div className="feature-icon-box blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3>Student urgency scoring</h3>
            <p>
              Automatically ranks students by priority based on overdue tasks
              and risk status.
            </p>
          </div>

          <div className="landing-feature-card">
            <div className="feature-icon-box indigo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <h3>Unified task and message view</h3>
            <p>
              Open tasks, unread messages, and deadlines for every student in
              one clean panel.
            </p>
          </div>

          <div className="landing-feature-card">
            <div className="feature-icon-box emerald">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3>One-click status updates</h3>
            <p>
              Update task status inline without leaving the dashboard. Changes
              sync instantly.
            </p>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="landing-steps" id="how-it-works">
        <div className="landing-section-header">
          <span className="landing-section-tag">How It Works</span>
          <h2 className="landing-section-title">
            Three steps to full visibility
          </h2>
        </div>
        <div className="landing-steps-grid">
          <div className="landing-step-card">
            <span className="step-number">01</span>
            <h3>Select a student</h3>
            <p>Pick from your counselor roster. All your students, one sidebar.</p>
          </div>
          <div className="landing-step-card">
            <span className="step-number">02</span>
            <h3>Review at a glance</h3>
            <p>See tasks, messages, urgency score, and enrollment status instantly.</p>
          </div>
          <div className="landing-step-card">
            <span className="step-number">03</span>
            <h3>Take action</h3>
            <p>Update tasks, follow up on messages, and track student progress over time.</p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-footer-brand">
            <img src={logoUrl} alt="Zyra" className="landing-footer-logo" />
            <div>
              <strong>Zyra Action Center</strong>
              <span>Built for counselors who care.</span>
            </div>
          </div>
          <div className="landing-footer-links">
            <span>Privacy</span>
            <span>·</span>
            <span>Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
