import { useState } from "react";
import type { Task, TaskStatus } from "../types";
import { useUpdateTaskStatus } from "../hooks/useActionCenter";

// ---------------------------------------------------------------------------
// TaskCard — My individual task component.
// I built this with an inline status dropdown so counselors don't have to
// open a separate modal just to mark something complete. It hooks directly
// into my React Query mutation to instantly save the status. I also added
// a check to automatically highlight overdue tasks in red.
// ---------------------------------------------------------------------------
interface TaskCardProps {
  task: Task;
  studentId: string;
}

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export function TaskCard({ task, studentId }: TaskCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const mutation = useUpdateTaskStatus(studentId);

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const isOverdue =
    task.status !== "completed" && new Date(task.dueDate) < todayStart;

  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (newStatus === task.status) return;
    setIsUpdating(true);
    try {
      await mutation.mutateAsync({ taskId: task.id, status: newStatus });
    } finally {
      setIsUpdating(false);
    }
  };

  const formattedDueDate = new Date(task.dueDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className={`task-card task-status-${task.status} ${isOverdue ? "task-overdue" : ""} ${
        task.status === "completed" ? "task-completed" : ""
      }`}
    >
      <div className="task-card-header">
        <div className="task-title-row">
          <h4 className="task-title">{task.title}</h4>
          <span className={`priority-badge priority-${task.priority}`}>
            {task.priority}
          </span>
        </div>
        <p className="task-description">{task.description}</p>
      </div>

      <div className="task-card-footer">
        <div className="task-meta">
          <span className={`task-due ${isOverdue ? "due-overdue" : ""}`}>
            {isOverdue ? "Overdue" : "Due"}: {formattedDueDate}
          </span>
        </div>

        <div className="task-status-control">
          <label htmlFor={`status-${task.id}`} className="sr-only">
            Update status for {task.title}
          </label>
          <select
            id={`status-${task.id}`}
            className={`status-select status-${task.status}`}
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
            disabled={isUpdating}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {isUpdating && <span className="status-spinner" />}
        </div>
      </div>
    </div>
  );
}
