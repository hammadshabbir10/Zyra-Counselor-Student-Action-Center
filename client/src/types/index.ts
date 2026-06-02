// ---------------------------------------------------------------------------
// Shared Types — My frontend interfaces.
// I kept these separate from the backend to avoid complex monorepo
// setups, but they mirror my server/src/types exactly to guarantee type safety.
// ---------------------------------------------------------------------------

export interface Student {
  id: string;
  name: string;
  email: string;
  grade: number;
  gpa: number;
  counselorId: string;
  enrollmentStatus: "active" | "at_risk" | "inactive";
}

export interface Task {
  id: string;
  studentId: string;
  studentName?: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = "todo" | "in_progress" | "completed";
export type TaskPriority = "urgent" | "high" | "medium" | "low";

export interface Message {
  id: string;
  studentId: string;
  studentName?: string;
  from: string;
  subject: string;
  preview: string;
  read: boolean;
  receivedAt: string;
}

export interface ActionCenterSummary {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  urgentTasks: number;
  unreadMessages: number;
  urgencyLevel: UrgencyLevel;
}

export type UrgencyLevel = "critical" | "high" | "moderate" | "low";

export interface ActionCenterResponse {
  student: Student;
  tasks: Task[];
  messages: Message[];
  summary: ActionCenterSummary;
}
