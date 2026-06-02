import { Request, Response, NextFunction } from "express";

// ---------------------------------------------------------------------------
// Request Logger Middleware
// Logs structured JSON for every completed HTTP request. Captures method,
// URL, status code, response time in milliseconds, and the request ID
// assigned by the requestId middleware.
//
// Output format (one JSON line per request):
//   { timestamp, method, url, statusCode, durationMs, requestId }
//
// In production, pipe stdout to a log aggregator (e.g., Datadog, ELK).
// ---------------------------------------------------------------------------

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const start = Date.now();

  res.on("finish", () => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - start,
      requestId: req.requestId || "unknown",
    };

    // Color-code by status for dev readability
    const statusColor =
      res.statusCode >= 500
        ? "\x1b[31m" // red
        : res.statusCode >= 400
          ? "\x1b[33m" // yellow
          : "\x1b[32m"; // green

    const reset = "\x1b[0m";

    console.log(
      `${statusColor}[${logEntry.method}]${reset} ${logEntry.url} → ${statusColor}${logEntry.statusCode}${reset} (${logEntry.durationMs}ms) [rid:${logEntry.requestId}]`
    );

    // Also emit structured JSON for machine consumption
    if (process.env.NODE_ENV === "production") {
      process.stdout.write(JSON.stringify(logEntry) + "\n");
    }
  });

  next();
}
