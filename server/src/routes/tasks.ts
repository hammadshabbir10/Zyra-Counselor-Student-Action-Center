import { Router, Request, Response } from "express";
import { tasks } from "../data/mockData";
import { TaskStatus, TaskStatusUpdateRequest } from "../types";

const router = Router();

const VALID_STATUSES: TaskStatus[] = ["todo", "in_progress", "completed"];

// ---------------------------------------------------------------------------
// GET /
// Returns all tasks across all students with student names attached.
// ---------------------------------------------------------------------------
router.get("/", (_req: Request, res: Response): void => {
  const { students } = require("../data/mockData");
  const tasksWithNames = tasks.map((t) => {
    const student = students.find((s: any) => s.id === t.studentId);
    return {
      ...t,
      studentName: student ? student.name : "Unknown Student",
    };
  });
  res.json(tasksWithNames);
});

// ---------------------------------------------------------------------------
// PATCH /tasks/:taskId/status
// Updates the status of a specific task. Accepts { status } in the body.
// ---------------------------------------------------------------------------
router.patch("/:taskId/status", (req: Request, res: Response): void => {
  const { taskId } = req.params;
  const { status } = req.body as TaskStatusUpdateRequest;

  // Validate that status is provided
  if (!status) {
    res.status(400).json({
      error: "VALIDATION_ERROR",
      message: 'Request body must include a "status" field.',
      statusCode: 400,
    });
    return;
  }

  // Validate that status is one of the allowed values
  if (!VALID_STATUSES.includes(status)) {
    res.status(400).json({
      error: "VALIDATION_ERROR",
      message: `Invalid status "${status}". Must be one of: ${VALID_STATUSES.join(", ")}.`,
      statusCode: 400,
    });
    return;
  }

  // Find the task
  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) {
    res.status(404).json({
      error: "NOT_FOUND",
      message: `Task with id "${taskId}" not found.`,
      statusCode: 404,
    });
    return;
  }

  // Update in place (mock data — no database)
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    status,
    updatedAt: new Date().toISOString(),
  };

  res.json(tasks[taskIndex]);
});

export default router;
