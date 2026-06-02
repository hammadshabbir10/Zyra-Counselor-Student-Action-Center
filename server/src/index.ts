import express from "express";
import cors from "cors";
import studentRoutes from "./routes/students";
import taskRoutes from "./routes/tasks";
import messageRoutes from "./routes/messages";

const app = express();
const PORT = process.env.PORT || 4000;

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.use("/students", studentRoutes);
app.use("/tasks", taskRoutes);
app.use("/messages", messageRoutes);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ---------------------------------------------------------------------------
// Global error handler
// ---------------------------------------------------------------------------
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("[Server Error]", err.message);
    res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred.",
      statusCode: 500,
    });
  }
);

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`[server] Action Center API running on http://localhost:${PORT}`);
});

export default app;
