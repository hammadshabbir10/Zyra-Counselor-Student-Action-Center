import { Router, Request, Response } from "express";
import { students, tasks, messages } from "../data/mockData";
import {
  ActionCenterResponse,
  ActionCenterSummary,
  UrgencyLevel,
} from "../types";

const router = Router();

// ---------------------------------------------------------------------------
// GET /students/:id/action-center
// Returns a consolidated view of a student's profile, tasks, messages,
// and a computed summary including urgency level.
// ---------------------------------------------------------------------------
router.get("/:id/action-center", (req: Request, res: Response): void => {
  const { id } = req.params;

  // 2-second delay for real students to show a smooth loading transition.
  // stu_999 (David Kim) returns immediately to show fast error feedback.
  const delayMs = id === "stu_999" ? 0 : 2000;

  setTimeout(() => {
    const student = students.find((s) => s.id === id);
    if (!student) {
      res.status(404).json({
        error: "NOT_FOUND",
        message: `Student with id "${id}" not found.`,
        statusCode: 404,
      });
      return;
    }

    const studentTasks = tasks.filter((t) => t.studentId === id);
    const studentMessages = messages.filter((m) => m.studentId === id);

    const now = new Date();

    const completedTasks = studentTasks.filter(
      (t) => t.status === "completed"
    ).length;

    const pendingTasks = studentTasks.filter(
      (t) => t.status !== "completed"
    ).length;

    const overdueTasks = studentTasks.filter(
      (t) => t.status !== "completed" && new Date(t.dueDate) < now
    ).length;

    const urgentTasks = studentTasks.filter(
      (t) => t.status !== "completed" && t.priority === "urgent"
    ).length;

    const unreadMessages = studentMessages.filter((m) => !m.read).length;

    const urgencyLevel = computeUrgencyLevel({
      overdueTasks,
      urgentTasks,
      enrollmentStatus: student.enrollmentStatus,
      unreadMessages,
    });

    const summary: ActionCenterSummary = {
      totalTasks: studentTasks.length,
      completedTasks,
      pendingTasks,
      overdueTasks,
      urgentTasks,
      unreadMessages,
      urgencyLevel,
    };

    const response: ActionCenterResponse = {
      student,
      tasks: studentTasks,
      messages: studentMessages,
      summary,
    };

    res.json(response);
  }, delayMs);
});

// ---------------------------------------------------------------------------
// GET /students
// Returns the list of all students (used by the student selector).
// ---------------------------------------------------------------------------
router.get("/", (_req: Request, res: Response): void => {
  res.json(students);
});

// ---------------------------------------------------------------------------
// Urgency Computation
// Combines overdue count, urgent-priority tasks, enrollment risk, and
// unread messages into a single urgency level for the counselor.
// ---------------------------------------------------------------------------
function computeUrgencyLevel(params: {
  overdueTasks: number;
  urgentTasks: number;
  enrollmentStatus: string;
  unreadMessages: number;
}): UrgencyLevel {
  const { overdueTasks, urgentTasks, enrollmentStatus, unreadMessages } =
    params;

  // Critical: multiple overdue tasks or at-risk student with urgent items
  if (overdueTasks >= 2 || (enrollmentStatus === "at_risk" && urgentTasks >= 2)) {
    return "critical";
  }

  // High: any overdue task, or at-risk student with pending urgent work
  if (overdueTasks >= 1 || (enrollmentStatus === "at_risk" && urgentTasks >= 1)) {
    return "high";
  }

  // Moderate: urgent tasks exist or multiple unread messages
  if (urgentTasks >= 1 || unreadMessages >= 3) {
    return "moderate";
  }

  return "low";
}

export default router;
