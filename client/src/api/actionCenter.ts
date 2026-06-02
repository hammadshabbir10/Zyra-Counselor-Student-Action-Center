import type {
  ActionCenterResponse,
  Student,
  Task,
  TaskStatus,
} from "../types";

const API_BASE = "/api";

// ---------------------------------------------------------------------------
// Action Center API Client — My fetch wrappers for backend communication.
// I kept these as raw fetch calls rather than pulling in Axios to keep the
// bundle size down. These perfectly map to the Express endpoints I built.
// ---------------------------------------------------------------------------
export async function fetchStudents(): Promise<Student[]> {
  const res = await fetch(`${API_BASE}/students`);
  if (!res.ok) {
    throw new Error(`Failed to fetch students (${res.status})`);
  }
  return res.json();
}

// ---------------------------------------------------------------------------
// GET /students/:id/action-center — full action center payload
// ---------------------------------------------------------------------------
export async function fetchActionCenter(
  studentId: string
): Promise<ActionCenterResponse> {
  const res = await fetch(`${API_BASE}/students/${studentId}/action-center`);
  if (!res.ok) {
    throw new Error(`Failed to fetch action center for ${studentId} (${res.status})`);
  }
  return res.json();
}

// ---------------------------------------------------------------------------
// PATCH /tasks/:taskId/status — update a task's status
// ---------------------------------------------------------------------------
export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus
): Promise<Task> {
  const res = await fetch(`${API_BASE}/tasks/${taskId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    throw new Error(`Failed to update task ${taskId} (${res.status})`);
  }
  return res.json();
}

// ---------------------------------------------------------------------------
// GET /tasks — fetch all tasks across students
// ---------------------------------------------------------------------------
export async function fetchAllTasks(): Promise<Task[]> {
  const res = await fetch(`${API_BASE}/tasks`);
  if (!res.ok) {
    throw new Error(`Failed to fetch tasks (${res.status})`);
  }
  return res.json();
}

// ---------------------------------------------------------------------------
// GET /messages — fetch all messages across students
// ---------------------------------------------------------------------------
export async function fetchAllMessages(): Promise<import("../types").Message[]> {
  const res = await fetch(`${API_BASE}/messages`);
  if (!res.ok) {
    throw new Error(`Failed to fetch messages (${res.status})`);
  }
  return res.json();
}
