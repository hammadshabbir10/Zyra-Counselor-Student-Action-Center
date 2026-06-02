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
