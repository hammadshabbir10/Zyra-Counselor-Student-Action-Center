import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

// ---------------------------------------------------------------------------
// Request ID Middleware
// Generates a unique UUID for every incoming request and attaches it to both
// the request object and the response header for end-to-end traceability.
// If the client sends an X-Request-Id header, it is reused (useful for
// distributed tracing across microservices).
// ---------------------------------------------------------------------------

declare global {
  namespace Express {
    interface Request {
      requestId: string;
    }
  }
}

export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const id =
    (req.headers["x-request-id"] as string) || randomUUID();

  req.requestId = id;
  res.setHeader("X-Request-Id", id);

  next();
}
