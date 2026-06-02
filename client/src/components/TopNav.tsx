import { useStudents } from "../hooks/useActionCenter";
import { useAppStore } from "../store/appStore";

// ---------------------------------------------------------------------------
// TopNav — My top navigation bar that sits across the entire dashboard.
// It contains the Zyra brand logo, a "Back to Home" arrow that returns the
// counselor to the landing page, the student dropdown selector, and a small
// avatar circle showing the selected student's initials.
//
// I pull the students list from my React Query hook so the dropdown
// populates as soon as the API responds. The selected student ID is
// managed in my Zustand store so every component stays in sync.
// ---------------------------------------------------------------------------

const logoUrl = new URL("../public/Zyra_logo.png", import.meta.url).href;

export function TopNav() {
  const { data: students, isLoading } = useStudents();
  const selectedStudentId = useAppStore((s) => s.selectedStudentId);
  const setSelectedStudentId = useAppStore((s) => s.setSelectedStudentId);
  const setCurrentPage = useAppStore((s) => s.setCurrentPage);

  // Build initials from the selected student's name for the avatar circle
  const selectedStudent = students?.find((student) => student.id === selectedStudentId);
  let initials = "--";
  if (selectedStudentId === "stu_999") {
    initials = "DK";
  } else if (selectedStudent?.name) {
    initials = selectedStudent.name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  return (
    <header className="top-nav">
      <div className="nav-left">
        {/* Back arrow — takes the counselor back to the landing page */}
        <button
          className="nav-back-btn"
          onClick={() => setCurrentPage("landing")}
          title="Back to Home"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>

        <div className="nav-brand">
          <img src={logoUrl} alt="Zyra" className="nav-logo" />
          <span className="nav-brand-text">Zyra</span>
        </div>
      </div>

      <div className="nav-right">
        <label htmlFor="nav-student-select" className="sr-only">
          Select student
        </label>
        <select
          id="nav-student-select"
          className="student-nav-select"
          value={selectedStudentId}
          onChange={(e) => setSelectedStudentId(e.target.value)}
          disabled={isLoading}
        >
          {isLoading && <option>Loading students...</option>}
          {!isLoading && (!students || students.length === 0) && (
            <option>No students available</option>
          )}
          {students?.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name} - Grade {student.grade}
            </option>
          ))}
          <option value="stu_999">David Kim - Grade 11</option>
        </select>
        <div className="profile-avatar-small">{initials}</div>
      </div>
    </header>
  );
}
