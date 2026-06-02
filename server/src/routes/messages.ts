import { Router, Request, Response } from "express";
import { messages, students } from "../data/mockData";

const router = Router();

// ---------------------------------------------------------------------------
// GET /
// Returns all messages across all students with student names attached.
// ---------------------------------------------------------------------------
router.get("/", (_req: Request, res: Response): void => {
  const messagesWithNames = messages.map((m) => {
    const student = students.find((s) => s.id === m.studentId);
    return {
      ...m,
      studentName: student ? student.name : "Unknown Student",
    };
  });
  res.json(messagesWithNames);
});

export default router;
