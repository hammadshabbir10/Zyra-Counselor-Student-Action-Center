import type { Student } from "../types";
import { useStudents } from "../hooks/useActionCenter";
import { useAppStore } from "../store/appStore";

// ---------------------------------------------------------------------------
// StudentSelector — My dropdown component for switching between students.
// I use this if I need an explicit selector outside the TopNav. It pulls
// the roster directly from the API and updates the global Zustand store
// so the entire dashboard reacts instantly when a new student is picked.
// ---------------------------------------------------------------------------
export function StudentSelector() {
  const { data: students, isLoading } = useStudents();
  const selectedStudentId = useAppStore((s) => s.selectedStudentId);
  const setSelectedStudentId = useAppStore((s) => s.setSelectedStudentId);

  if (isLoading) {
    return <div className="selector-skeleton" />;
  }

  return (
    <div className="student-selector">
      <label htmlFor="student-select" className="selector-label">
        Select Student
      </label>
      <select
        id="student-select"
        className="selector-dropdown"
        value={selectedStudentId}
        onChange={(e) => setSelectedStudentId(e.target.value)}
      >
        {students?.map((student: Student) => (
          <option key={student.id} value={student.id}>
            {student.name} — Grade {student.grade}
          </option>
        ))}
        <option value="stu_999">
          David Kim — Grade 11
        </option>
      </select>
    </div>
  );
}
