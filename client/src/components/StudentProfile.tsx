import type { Student, ActionCenterSummary } from "../types";

// ---------------------------------------------------------------------------
// StudentProfile — My header card component for the action center dashboard.
// I built this to instantly show the counselor the student's vital stats
// (grade, GPA, enrollment status) and a color-coded urgency badge, so they
// know exactly what kind of situation they're dealing with at a glance.
// ---------------------------------------------------------------------------
interface StudentProfileProps {
  student: Student;
  summary: ActionCenterSummary;
}

export function StudentProfile({ student, summary }: StudentProfileProps) {
  const initials = student.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="profile-avatar">
          <span className="avatar-initials">{initials}</span>
        </div>
        <div className="profile-info">
          <h2 className="profile-name">{student.name}</h2>
          <p className="profile-email">{student.email}</p>
        </div>
        <div className={`urgency-badge urgency-${summary.urgencyLevel}`}>
          {summary.urgencyLevel}
        </div>
      </div>

      <div className="profile-details">
        <div className="detail-item">
          <span className="detail-label">Grade</span>
          <span className="detail-value">{student.grade}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">GPA</span>
          <span className="detail-value">{student.gpa.toFixed(1)}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Status</span>
          <span
            className={`enrollment-badge enrollment-${student.enrollmentStatus}`}
          >
            {student.enrollmentStatus === "at_risk"
              ? "At Risk"
              : student.enrollmentStatus.charAt(0).toUpperCase() +
                student.enrollmentStatus.slice(1)}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Counselor</span>
          <span className="detail-value">{student.counselorId}</span>
        </div>
      </div>
    </div>
  );
}
