import type { Student } from "../types";
import { useStudents } from "../hooks/useActionCenter";
import { useAppStore } from "../store/appStore";

// ---------------------------------------------------------------------------
// StudentSelector — dropdown to switch between students
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
