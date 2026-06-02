# Counselor Student Action Center

A full-stack mini feature built for the Zyra platform assessment. This tool gives counselors a single-page dashboard to review a student's profile, manage tasks, read messages, and assess urgency at a glance.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Contract](#api-contract)
- [Architecture Notes](#architecture-notes)

---

## Overview

The **Counselor Student Action Center** consolidates a student's key data into one view:

- **Student Profile** -- name, grade, GPA, enrollment status, and a computed urgency badge.
- **Task List** -- all tasks assigned to the student, filterable by status, sortable by priority and due date, with inline status updates.
- **Messages** -- recent messages with an unread count and visual indicators.
- **Summary Metrics** -- total tasks, pending, overdue, and unread message counts at a glance.

---

## Tech Stack

| Layer           | Technology                          |
| --------------- | ----------------------------------- |
| Frontend        | React 19, TypeScript, Vite          |
| Server State    | TanStack React Query v5             |
| Client State    | Zustand v5                          |
| Backend         | Node.js, Express, TypeScript        |
| Data            | In-memory mock data (no database)   |

---

## Project Structure

```
Zyra_Assessment/
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── api/               # HTTP client functions
│   │   ├── components/        # UI components
│   │   ├── hooks/             # React Query hooks
│   │   ├── store/             # Zustand client state
│   │   ├── types/             # TypeScript interfaces
│   │   ├── App.tsx            # Root component
│   │   ├── main.tsx           # Entry point
│   │   └── index.css          # Design system and styles
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
├── server/                    # Express backend
│   ├── src/
│   │   ├── data/              # Mock data (students, tasks, messages)
│   │   ├── routes/            # Express route handlers
│   │   ├── types/             # Shared TypeScript types
│   │   └── index.ts           # Server entry point
│   ├── tsconfig.json
│   └── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### 1. Clone the repository

```bash
git clone https://github.com/hammadshabbir10/Zyra-Counselor-Student-Action-Center.git
cd Zyra-Counselor-Student-Action-Center
```

### 2. Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Start the backend

```bash
cd server
npm run dev
```

The API server starts on `http://localhost:4000`.

### 4. Start the frontend

In a separate terminal:

```bash
cd client
npm run dev
```

The app opens at `http://localhost:5173`. The Vite dev server proxies `/api` requests to the backend automatically.

---

## API Contract

### GET /students

Returns all students.

**Response:** `200 OK`

```json
[
  {
    "id": "stu_001",
    "name": "Maya Patel",
    "email": "maya.patel@school.edu",
    "grade": 11,
    "gpa": 3.2,
    "counselorId": "csl_001",
    "enrollmentStatus": "at_risk"
  }
]
```

---

### GET /students/:id/action-center

Returns the consolidated action center payload for a single student.

**Path Parameters:**

| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| id        | string | Student ID  |

**Response:** `200 OK`

```json
{
  "student": { ... },
  "tasks": [ ... ],
  "messages": [ ... ],
  "summary": {
    "totalTasks": 5,
    "completedTasks": 1,
    "pendingTasks": 4,
    "overdueTasks": 2,
    "urgentTasks": 2,
    "unreadMessages": 2,
    "urgencyLevel": "critical"
  }
}
```

**Error Response:** `404 Not Found`

```json
{
  "error": "NOT_FOUND",
  "message": "Student with id \"stu_999\" not found.",
  "statusCode": 404
}
```

---

### PATCH /tasks/:taskId/status

Updates the status of a task.

**Path Parameters:**

| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| taskId    | string | Task ID     |

**Request Body:**

```json
{
  "status": "in_progress"
}
```

Valid values: `todo`, `in_progress`, `completed`

**Response:** `200 OK` -- returns the updated task object.

**Error Responses:**

- `400 Bad Request` -- missing or invalid status
- `404 Not Found` -- task not found

---

## Architecture Notes

### Design Decisions

**1. Separation of Concerns**

The project is split into `client/` and `server/` directories with independent `package.json` files and TypeScript configurations. This mirrors a real monorepo setup without the tooling overhead, making it straightforward to run and review.

**2. Server State with TanStack React Query**

All server-fetched data flows through React Query. The action center query uses a `["action-center", studentId]` key, which means switching students automatically triggers a new fetch or cache hit. After a task status update, `invalidateQueries` forces a refetch so the summary metrics, urgency level, and task list stay consistent without manual state reconciliation.

**3. Client State with Zustand**

The only piece of purely client-side state is the currently selected student ID. Zustand is used here because it is lightweight, has no boilerplate, and avoids prop drilling through the component tree. This keeps a clear boundary: Zustand owns UI state, React Query owns server state.

**4. Urgency Level Computation**

The urgency level is computed server-side in the `GET /students/:id/action-center` handler. It factors in:

- Number of overdue tasks (past due date, not completed)
- Number of urgent-priority tasks still pending
- Student enrollment status (at-risk amplifies urgency)
- Volume of unread messages

This logic lives on the server so that any client consuming the API gets a consistent urgency assessment.

**5. API Proxy via Vite**

During development, the Vite dev server proxies requests from `/api/*` to `http://localhost:4000/*`. This avoids CORS issues in development while keeping the frontend code environment-agnostic. The `API_BASE` in the client simply points to `/api`.

**6. Sorting and Filtering**

Task sorting (urgent-first, then earliest due date) and status filtering happen client-side since the dataset is small and already fully loaded from the action center endpoint. This avoids unnecessary network round-trips for filter changes and keeps the UI responsive.

**7. Component Architecture**

Components are structured by responsibility:

- `StudentSelector` -- controls which student is active (writes to Zustand)
- `StudentProfile` -- displays read-only student info and urgency badge
- `SummaryCards` -- renders four metric cards from the summary object
- `TaskList` -- manages filter state and renders sorted `TaskCard` items
- `TaskCard` -- handles individual status updates via mutation
- `MessageList` -- displays messages with unread-first sorting
- `LoadingState` / `ErrorState` -- dedicated UI states for async boundaries

---

## Task 2: Production Quality Improvements

This section documents the bonus assessment additions — request logging, error middleware with request IDs, integration tests, frontend tests, and performance tradeoffs.

---

### Request Logging

Every HTTP request is logged with structured output using a custom `requestLogger` middleware (`server/src/middleware/requestLogger.ts`).

**What's logged per request:**

| Field       | Description                              |
| ----------- | ---------------------------------------- |
| `timestamp` | ISO 8601 timestamp when response finishes |
| `method`    | HTTP method (GET, PATCH, etc.)           |
| `url`       | Full request URL path                    |
| `statusCode`| HTTP response status code                |
| `durationMs`| Response time in milliseconds            |
| `requestId` | UUID assigned by the request ID middleware|

**Dev output** is color-coded (green for 2xx, yellow for 4xx, red for 5xx) for quick visual scanning. In production (`NODE_ENV=production`), structured JSON lines are emitted to stdout for ingestion by log aggregators (e.g., Datadog, ELK, CloudWatch).

Example dev log:
```
[GET] /students/stu_001/action-center → 200 (53ms) [rid:547d9481-7a64-458f-a428-c892ecf2be14]
[PATCH] /tasks/tsk_001/status → 400 (12ms) [rid:2a268a4a-5181-49b9-b3a8-ad3ddb6ebb85]
```

---

### Error Middleware with Request IDs

A `requestIdMiddleware` (`server/src/middleware/requestId.ts`) runs **first** in the middleware chain. It:

1. Generates a UUID (`crypto.randomUUID()`) for every incoming request.
2. Attaches it to `req.requestId` and sets the `X-Request-Id` response header.
3. If the client sends an `X-Request-Id` header, it is reused — enabling distributed tracing across services.

The global error handler includes the `requestId` in error responses:

```json
{
  "error": "INTERNAL_SERVER_ERROR",
  "message": "An unexpected error occurred.",
  "statusCode": 500
}
```

This allows support teams to correlate user-reported errors with specific log entries.

---

### Testing

#### Backend Integration Tests (Jest + Supertest)

Located in `server/src/__tests__/actionCenter.test.ts`. 13 tests covering:

- **Action Center API**: Validates response shape (student, tasks, messages, summary), ensures tasks/messages belong to the correct student, checks urgency level computation, verifies `totalTasks = completedTasks + pendingTasks`.
- **Task Status PATCH**: Tests valid updates (todo → in_progress → completed), invalid status validation (400), missing status field (400), non-existent task (404).
- **Request ID Tracing**: Verifies `X-Request-Id` header is present on every response, and that client-provided IDs are echoed back.
- **Health Check**: Verifies `/health` returns ok status.

Run backend tests:
```bash
cd server
npm test
```

#### Frontend Component Tests (Vitest + React Testing Library)

Located in `client/src/__tests__/Dashboard.test.tsx`. 8 tests covering:

- **Loading State**: Verifies skeleton loading UI appears while data fetches.
- **Error State**: Verifies error message and "Try Again" retry button appear on API failure.
- **Success State**: Verifies student name (Maya Patel), urgency badge (critical), task titles, message subjects, and summary metrics render after successful data load.
- **Navigation**: Verifies brand text and sidebar items render.

Run frontend tests:
```bash
cd client
npm test
```

---

### Performance Decisions & Tradeoffs

| Decision | Rationale | Tradeoff |
| -------- | --------- | -------- |
| **In-memory mock data** | No database setup needed, zero deployment friction, instant reads | Data resets on server restart; not suitable for production persistence |
| **Client-side filtering & sorting** | Dataset is small (~5-15 items per student). Avoids network round-trips for filter/sort changes | Would not scale to thousands of tasks — would need server-side pagination |
| **React Query with `staleTime`** | Prevents redundant refetches when switching tabs. Action center data stays fresh for 30s, student list for 5min | Stale data is shown briefly after mutations until `invalidateQueries` triggers a refetch |
| **Zustand for client state** | Only one piece of client state (selected student ID). Zustand has zero boilerplate vs Redux | Would need more structure (slices, middleware) if client state grew significantly |
| **Server-side urgency computation** | All API consumers get consistent urgency levels. Single source of truth | Adds server compute per request; could be cached if urgency inputs rarely change |
| **Vite dev proxy** | Eliminates CORS configuration during development | Requires separate CORS setup for production deployment |
| **Artificial API delay (2s)** | Demonstrates loading skeletons and transition animations realistically | Removed in test mode (`NODE_ENV=test`) for fast test execution |
| **UUID request IDs (crypto.randomUUID)** | Built-in Node.js, no external dependency. RFC 4122 compliant | Slightly longer than short IDs; acceptable for log correlation |
| **Console-based logging** | Simple, zero-dependency. Structured JSON in production mode | No log levels (info/warn/error) or log rotation — would use Winston/Pino in production |



### Some UI Screen Shots

## Task 1


# Landing Page


<img width="1897" height="901" alt="Image" src="https://github.com/user-attachments/assets/cabf0b6d-2905-4800-a118-d003224ea9fc" />


# Dashboard


<img width="1878" height="917" alt="Image" src="https://github.com/user-attachments/assets/9388e670-90e5-4e45-ae8b-70c6c1cd1180" />


# Students Taks


<img width="1912" height="908" alt="Image" src="https://github.com/user-attachments/assets/232c8a0a-831e-4f10-88cc-22f05713ea53" />


# Message Box


<img width="1918" height="901" alt="Image" src="https://github.com/user-attachments/assets/e6496d03-d640-4669-9d5a-59ef00a98b15" />



## Task 2 Evidence


# Frontend Tests


<img width="821" height="926" alt="Image" src="https://github.com/user-attachments/assets/29f52176-60cc-4c70-87a2-b35abbea7a5b" />



# Backend Tests


<img width="807" height="916" alt="Image" src="https://github.com/user-attachments/assets/3d276878-b8df-4efe-9c65-2fdb1fe8b69c" />



# Request ID


<img width="1906" height="911" alt="Image" src="https://github.com/user-attachments/assets/5ba46e16-19c0-42a7-8375-656eb287cfbb" />





<img width="1918" height="911" alt="Image" src="https://github.com/user-attachments/assets/bb415025-dfb3-4793-9882-a1df0cb91d35" />





<img width="1912" height="884" alt="Image" src="https://github.com/user-attachments/assets/173f40de-9331-4b57-bd12-c2dac258f31f" />




# Terminal 




<img width="834" height="449" alt="Image" src="https://github.com/user-attachments/assets/4eaff688-f0d6-450e-b727-6ab3c75f175a" />
