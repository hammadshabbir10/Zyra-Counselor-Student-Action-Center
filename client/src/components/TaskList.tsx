import { useState } from "react";
import type { Task } from "../types";
import { TaskCard } from "./TaskCard";

// ---------------------------------------------------------------------------
// TaskList — My list view for organizing a student's tasks.
// I added a simple tabbed filter so counselors can quickly sort by status,
// and I wrote a custom sort function that ensures urgent tasks always float
// to the top, followed by chronological due dates.
// ---------------------------------------------------------------------------
interface TaskListProps {
  tasks: Task[];
  studentId: string;
}

type FilterOption = "all" | "todo" | "in_progress" | "completed";

const FILTER_OPTIONS: { value: FilterOption; label: string }[] = [
  { value: "all", label: "All" },
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export function TaskList({ tasks, studentId }: TaskListProps) {
  const [filter, setFilter] = useState<FilterOption>("all");

  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  // Sort: urgent first, then by due date ascending
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (pDiff !== 0) return pDiff;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <div className="task-list-section">
      <div className="task-list-header">
        <h3 className="section-title">
          Tasks
          <span className="task-count">{filteredTasks.length}</span>
        </h3>
        <div className="filter-tabs" role="tablist" aria-label="Filter tasks">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              role="tab"
              aria-selected={filter === opt.value}
              className={`filter-tab ${filter === opt.value ? "filter-active" : ""}`}
              onClick={() => setFilter(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="task-list">
        {sortedTasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks match the selected filter.</p>
          </div>
        ) : (
          sortedTasks.map((task) => (
            <TaskCard key={task.id} task={task} studentId={studentId} />
          ))
        )}
      </div>
    </div>
  );
}
