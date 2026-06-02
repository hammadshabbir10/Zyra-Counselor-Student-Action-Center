import request from "supertest";
import app from "../index";

// ---------------------------------------------------------------------------
// Integration Tests — Counselor Student Action Center API
//
// These tests verify the core API endpoints behave correctly, including:
// - Successful data retrieval with correct response shapes
// - Error handling for missing resources
// - Input validation for task status updates
// - Request ID header presence on every response
// ---------------------------------------------------------------------------

describe("GET /students/:id/action-center", () => {
  it("should return full action center data for a valid student (stu_001)", async () => {
    const res = await request(app)
      .get("/students/stu_001/action-center")
      .expect(200);

    // Verify response shape
    expect(res.body).toHaveProperty("student");
    expect(res.body).toHaveProperty("tasks");
    expect(res.body).toHaveProperty("messages");
    expect(res.body).toHaveProperty("summary");

    // Verify student data
    expect(res.body.student.id).toBe("stu_001");
    expect(res.body.student).toHaveProperty("name");
    expect(res.body.student).toHaveProperty("email");
    expect(res.body.student).toHaveProperty("grade");
    expect(res.body.student).toHaveProperty("gpa");
    expect(res.body.student).toHaveProperty("enrollmentStatus");

    // Verify tasks array — each task should belong to stu_001
    expect(Array.isArray(res.body.tasks)).toBe(true);
    res.body.tasks.forEach((task: any) => {
      expect(task.studentId).toBe("stu_001");
      expect(task).toHaveProperty("id");
      expect(task).toHaveProperty("title");
      expect(task).toHaveProperty("status");
      expect(task).toHaveProperty("priority");
      expect(task).toHaveProperty("dueDate");
    });

    // Verify messages array — each message should belong to stu_001
    expect(Array.isArray(res.body.messages)).toBe(true);
    res.body.messages.forEach((msg: any) => {
      expect(msg.studentId).toBe("stu_001");
      expect(msg).toHaveProperty("id");
      expect(msg).toHaveProperty("from");
      expect(msg).toHaveProperty("subject");
      expect(msg).toHaveProperty("read");
    });

    // Verify summary shape and computed fields
    const summary = res.body.summary;
    expect(summary).toHaveProperty("totalTasks");
    expect(summary).toHaveProperty("completedTasks");
    expect(summary).toHaveProperty("pendingTasks");
    expect(summary).toHaveProperty("overdueTasks");
    expect(summary).toHaveProperty("urgentTasks");
    expect(summary).toHaveProperty("unreadMessages");
    expect(summary).toHaveProperty("urgencyLevel");
    expect(["critical", "high", "moderate", "low"]).toContain(
      summary.urgencyLevel
    );

    // totalTasks should equal completed + pending
    expect(summary.totalTasks).toBe(
      summary.completedTasks + summary.pendingTasks
    );
  });

  it("should return 404 for a non-existent student", async () => {
    const res = await request(app)
      .get("/students/stu_nonexistent/action-center")
      .expect(404);

    expect(res.body.error).toBe("NOT_FOUND");
    expect(res.body.statusCode).toBe(404);
    expect(res.body.message).toContain("stu_nonexistent");
  });

  it("should include X-Request-Id header in every response", async () => {
    const res = await request(app)
      .get("/students/stu_001/action-center")
      .expect(200);

    expect(res.headers["x-request-id"]).toBeDefined();
    expect(typeof res.headers["x-request-id"]).toBe("string");
    expect(res.headers["x-request-id"].length).toBeGreaterThan(0);
  });

  it("should echo back a client-provided X-Request-Id", async () => {
    const customId = "test-trace-id-12345";
    const res = await request(app)
      .get("/students/stu_001/action-center")
      .set("X-Request-Id", customId)
      .expect(200);

    expect(res.headers["x-request-id"]).toBe(customId);
  });
});

describe("PATCH /tasks/:taskId/status", () => {
  it("should update a task status to 'in_progress'", async () => {
    const res = await request(app)
      .patch("/tasks/tsk_001/status")
      .send({ status: "in_progress" })
      .expect(200);

    expect(res.body.id).toBe("tsk_001");
    expect(res.body.status).toBe("in_progress");
    expect(res.body).toHaveProperty("updatedAt");
  });

  it("should update a task status to 'completed'", async () => {
    const res = await request(app)
      .patch("/tasks/tsk_001/status")
      .send({ status: "completed" })
      .expect(200);

    expect(res.body.id).toBe("tsk_001");
    expect(res.body.status).toBe("completed");
  });

  it("should update a task status to 'todo'", async () => {
    const res = await request(app)
      .patch("/tasks/tsk_001/status")
      .send({ status: "todo" })
      .expect(200);

    expect(res.body.id).toBe("tsk_001");
    expect(res.body.status).toBe("todo");
  });

  it("should return 400 for an invalid status value", async () => {
    const res = await request(app)
      .patch("/tasks/tsk_001/status")
      .send({ status: "invalid_status" })
      .expect(400);

    expect(res.body.error).toBe("VALIDATION_ERROR");
    expect(res.body.message).toContain("invalid_status");
  });

  it("should return 400 when status field is missing", async () => {
    const res = await request(app)
      .patch("/tasks/tsk_001/status")
      .send({})
      .expect(400);

    expect(res.body.error).toBe("VALIDATION_ERROR");
  });

  it("should return 404 for a non-existent task", async () => {
    const res = await request(app)
      .patch("/tasks/tsk_nonexistent/status")
      .send({ status: "completed" })
      .expect(404);

    expect(res.body.error).toBe("NOT_FOUND");
    expect(res.body.message).toContain("tsk_nonexistent");
  });

  it("should include X-Request-Id header on PATCH responses", async () => {
    const res = await request(app)
      .patch("/tasks/tsk_001/status")
      .send({ status: "todo" })
      .expect(200);

    expect(res.headers["x-request-id"]).toBeDefined();
  });
});

describe("GET /students", () => {
  it("should return an array of all students", async () => {
    const res = await request(app).get("/students").expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    // Verify student shape
    const student = res.body[0];
    expect(student).toHaveProperty("id");
    expect(student).toHaveProperty("name");
    expect(student).toHaveProperty("email");
    expect(student).toHaveProperty("grade");
    expect(student).toHaveProperty("gpa");
    expect(student).toHaveProperty("counselorId");
    expect(student).toHaveProperty("enrollmentStatus");
  });
});

describe("GET /health", () => {
  it("should return ok status", async () => {
    const res = await request(app).get("/health").expect(200);

    expect(res.body.status).toBe("ok");
    expect(res.body).toHaveProperty("timestamp");
  });
});
