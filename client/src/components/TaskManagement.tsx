import { useQuery } from "@tanstack/react-query";
import { fetchAllTasks } from "../api/actionCenter";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import { useAppStore } from "../store/appStore";

export function TaskManagement() {
  const selectedStudentId = useAppStore((s) => s.selectedStudentId);
  const { data: allTasks, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["allTasks"],
    queryFn: fetchAllTasks,
  });

  if (isLoading) return <LoadingState />;

  if (isError) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : "Failed to load tasks."}
        onRetry={() => refetch()}
      />
    );
  }

  const tasks = allTasks?.filter(t => t.studentId === selectedStudentId) || [];

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const isPastDue = (dateStr: string) => new Date(dateStr) < todayStart;

  const todoTasks = tasks.filter((t) => t.status === "todo");
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress");
  const completedTasks = tasks.filter((t) => t.status === "completed");
  const completedTasksCount = completedTasks.length;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getInitials = (name: string) => {
    if (!name || name === "Unknown Student") return "?";
    const parts = name.split(" ");
    return (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
  };

  const renderTaskCard = (task: import("../types").Task) => (
    <div
      className={`kanban-card kanban-status-${task.status} ${
        isPastDue(task.dueDate) && task.status !== "completed" ? "kanban-overdue" : ""
      }`}
      key={task.id}
    >
      <div className="kanban-card-priority">
        <span className={`kanban-priority-badge ${task.priority}`}>{task.priority.toUpperCase()}</span>
        {isPastDue(task.dueDate) && task.status !== "completed" && (
          <span className="kanban-priority-badge urgent" style={{marginLeft: '6px'}}>OVERDUE</span>
        )}
      </div>
      <h4 className="kanban-card-title">{task.title}</h4>
      <div className="kanban-card-student">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        {task.studentName}
      </div>
      <div className="kanban-card-footer">
        <div className={`kanban-card-date ${isPastDue(task.dueDate) && task.status !== "completed" ? 'kanban-date-overdue' : ''}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          {task.status === "completed" ? "Completed" : formatDate(task.dueDate)}
        </div>
        <div className="kanban-student-avatar-small">
          {getInitials(task.studentName || '')}
        </div>
      </div>
    </div>
  );

  return (
    <div className="tab-container task-management">
      <div className="tab-header">
        <div className="header-text">
          <h2 className="tab-title">Task Management</h2>
          <p className="tab-subtitle">Organize and monitor student intervention progress.</p>
        </div>
        <div className="header-actions">
          <div className="view-toggle">
            <button className="view-toggle-btn active"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg> Kanban</button>
            <button className="view-toggle-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg> List</button>
          </div>
        </div>
      </div>

      <div className="filters-bar-simple">
        <div className="filter-group">
          <span className="filter-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg> Filters:</span>
          <select><option>All Priorities</option></select>
          <button className="btn-text">Clear all</button>
        </div>
        <div className="completed-count">
          <span className="status-dot"></span> {completedTasksCount} Tasks Completed
        </div>
      </div>

      <div className="kanban-board">
        <div className="kanban-column">
          <div className="kanban-column-header">
            <h3>To Do <span className="kanban-count">{todoTasks.length}</span></h3>
            <button className="icon-btn-small">...</button>
          </div>
          <div className="kanban-column-content">
            {todoTasks.length > 0 ? (
              todoTasks.map(renderTaskCard)
            ) : (
              <div className="kanban-empty-state">No tasks to do.</div>
            )}
          </div>
        </div>

        <div className="kanban-column">
          <div className="kanban-column-header">
            <h3>In Progress <span className="kanban-count">{inProgressTasks.length}</span></h3>
            <button className="icon-btn-small">...</button>
          </div>
          <div className="kanban-column-content">
            {inProgressTasks.length > 0 ? (
              inProgressTasks.map(renderTaskCard)
            ) : (
              <div className="kanban-empty-state">No tasks in progress.</div>
            )}
          </div>
        </div>

        <div className="kanban-column">
          <div className="kanban-column-header">
            <h3>Completed <span className="kanban-count">{completedTasks.length}</span></h3>
            <button className="icon-btn-small">...</button>
          </div>
          <div className="kanban-column-content">
            {completedTasks.length > 0 ? (
              completedTasks.map(renderTaskCard)
            ) : (
              <div className="kanban-empty-state">No completed tasks.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
