import { useStudents } from "../hooks/useActionCenter";
import { useAppStore } from "../store/appStore";

const logoUrl = new URL("../public/Zyra_logo.png", import.meta.url).href;

export function TopNav() {
  const { data: students, isLoading } = useStudents();
  const selectedStudentId = useAppStore((s) => s.selectedStudentId);
  const setSelectedStudentId = useAppStore((s) => s.setSelectedStudentId);

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
