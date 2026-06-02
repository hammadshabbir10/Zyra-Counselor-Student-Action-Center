import express from "express";
import cors from "cors";
import { requestIdMiddleware } from "./middleware/requestId";
import { requestLogger } from "./middleware/requestLogger";
import studentRoutes from "./routes/students";
import taskRoutes from "./routes/tasks";
import messageRoutes from "./routes/messages";

const app = express();
const PORT = process.env.PORT || 4000;

// ---------------------------------------------------------------------------
// Middleware (order matters)
// 1. Request ID — assigns a UUID to every request before anything else
// 2. Request Logger — logs every request with its ID on response finish
// 3. CORS + JSON body parsing
// ---------------------------------------------------------------------------
app.use(requestIdMiddleware);
app.use(requestLogger);
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
// Global Error Handler — includes requestId for traceability
// ---------------------------------------------------------------------------
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(
      `[Server Error] [rid:${req.requestId || "unknown"}]`,
      err.message
    );
    res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred.",
      requestId: req.requestId || "unknown",
      statusCode: 500,
    });
  }
);

// ---------------------------------------------------------------------------
// Start server only when this file is run directly (not imported by tests)
// ---------------------------------------------------------------------------
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(
      `[server] Action Center API running on http://localhost:${PORT}`
    );
  });
}

export default app;
