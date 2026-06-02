import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";

// ---------------------------------------------------------------------------
// We import individual components instead of the full App to avoid the
// top-level QueryClient singleton that conflicts with test isolation.
// ---------------------------------------------------------------------------
import { useAppStore } from "../store/appStore";

import { TopNav } from "../components/TopNav";
import { Sidebar } from "../components/Sidebar";
import { StudentProfile } from "../components/StudentProfile";
import { SummaryCards } from "../components/SummaryCards";
import { TaskList } from "../components/TaskList";
import { MessageList } from "../components/MessageList";
import { LoadingState } from "../components/LoadingState";
import { ErrorState } from "../components/ErrorState";
import { useActionCenter } from "../hooks/useActionCenter";

// ---------------------------------------------------------------------------
// Frontend Tests — Counselor Student Action Center UI
// ---------------------------------------------------------------------------

const MOCK_ACTION_CENTER = {
  student: {
    id: "stu_001",
    name: "Maya Patel",
    email: "maya.patel@school.edu",
    grade: 11,
    gpa: 3.2,
    counselorId: "csl_001",
    enrollmentStatus: "at_risk",
  },
  tasks: [
    {
      id: "tsk_001",
      studentId: "stu_001",
      title: "Submit College Application",
      description: "Finalize and submit the common app.",
      status: "todo",
      priority: "urgent",
      dueDate: "2026-01-15",
      createdAt: "2025-11-01T00:00:00.000Z",
      updatedAt: "2025-11-01T00:00:00.000Z",
    },
  ],
  messages: [
    {
      id: "msg_001",
      studentId: "stu_001",
      from: "Principal Office",
      subject: "Academic Review Notice",
      preview: "Please schedule a meeting.",
      read: false,
      receivedAt: "2025-11-15T00:00:00.000Z",
    },
  ],
  summary: {
    totalTasks: 1,
    completedTasks: 0,
    pendingTasks: 1,
    overdueTasks: 1,
    urgentTasks: 1,
    unreadMessages: 1,
    urgencyLevel: "critical",
  },
};

const MOCK_STUDENTS = [
  {
    id: "stu_001",
    name: "Maya Patel",
    email: "maya.patel@school.edu",
    grade: 11,
    gpa: 3.2,
    counselorId: "csl_001",
    enrollmentStatus: "at_risk",
  },
];

const testQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 0,
    },
  },
});

function TestDashboardContent() {
  const selectedStudentId = useAppStore((s) => s.selectedStudentId);
  const { data, isLoading, isError, error, refetch } =
    useActionCenter(selectedStudentId);

  if (isLoading) return <LoadingState />;

  if (isError) {
    return (
      <ErrorState
        message={error?.message || "Failed to load action center data."}
        onRetry={() => refetch()}
      />
    );
  }

  if (!data) return null;

  return (
    <div className="action-center-content">
      <StudentProfile student={data.student} summary={data.summary} />
      <SummaryCards summary={data.summary} />
      <div className="content-grid">
        <TaskList tasks={data.tasks} studentId={data.student.id} />
        <MessageList
          messages={data.messages}
          unreadCount={data.summary.unreadMessages}
        />
      </div>
    </div>
  );
}

function TestApp() {
  return (
    <QueryClientProvider client={testQueryClient}>
      <div className="app-layout">
        <TopNav />
        <div className="app-body">
          <Sidebar />
          <main className="app-main-content">
            <TestDashboardContent />
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
}

// ---------------------------------------------------------------------------
// Fetch mock helpers
// ---------------------------------------------------------------------------
function mockFetchSuccess() {
  vi.stubGlobal(
    "fetch",
    vi.fn((url: string) => {
      if (url.includes("/students") && !url.includes("action-center")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(MOCK_STUDENTS),
        });
      }
      if (url.includes("action-center")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(MOCK_ACTION_CENTER),
        });
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve([]),
      });
    })
  );
}

function mockFetchError() {
  vi.stubGlobal(
    "fetch",
    vi.fn((url: string) => {
      if (url.includes("/students") && !url.includes("action-center")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(MOCK_STUDENTS),
        });
      }
      // Simulate API failure for action-center
      return Promise.resolve({
        ok: false,
        status: 500,
        json: () =>
          Promise.resolve({ error: "INTERNAL_SERVER_ERROR", message: "fail" }),
      });
    })
  );
}

beforeEach(() => {
  testQueryClient.clear();
  vi.clearAllMocks();
  // Reset selected student to stu_001
  useAppStore.setState({ selectedStudentId: "stu_001", activeTab: "dashboard" });
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Test Suites
// ---------------------------------------------------------------------------

describe("DashboardContent — Loading State", () => {
  it("shows loading skeleton while data is being fetched", () => {
    // Delay the response so loading state is visible
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise(() => {})) // never resolves = always loading
    );

    render(<TestApp />);

    // Loading skeleton container should be present
    const loadingEl = screen.getByRole("status");
    expect(loadingEl).toBeInTheDocument();
  });
});

describe("DashboardContent — Error State", () => {
  it("shows error message and retry button when API fails", async () => {
    mockFetchError();
    render(<TestApp />);

    // Wait for the error state to appear
    const errorAlert = await screen.findByRole("alert", {}, { timeout: 5000 });
    expect(errorAlert).toBeInTheDocument();

    // Retry button should be visible
    const retryButton = screen.getByRole("button", { name: /try again/i });
    expect(retryButton).toBeInTheDocument();
  });
});

describe("DashboardContent — Success State", () => {
  it("renders the student name after successful data load", async () => {
    mockFetchSuccess();
    render(<TestApp />);
    const nameEl = await screen.findByText(/Maya Patel/i, {}, { timeout: 5000 });
    expect(nameEl).toBeInTheDocument();
  });

  it("renders the urgency badge with correct level", async () => {
    mockFetchSuccess();
    render(<TestApp />);
    const badgeEl = await screen.findByText(/critical/i, {}, { timeout: 5000 });
    expect(badgeEl).toBeInTheDocument();
  });

  it("renders task title in the task list", async () => {
    mockFetchSuccess();
    render(<TestApp />);
    const taskEl = await screen.findByRole("heading", {
      name: /Submit College Application/i,
    });
    expect(taskEl).toBeInTheDocument();
  });

  it("renders unread message subject in the message list", async () => {
    mockFetchSuccess();
    render(<TestApp />);
    const msgEl = await screen.findByText(/Academic Review Notice/i, {}, { timeout: 5000 });
    expect(msgEl).toBeInTheDocument();
  });
});

describe("Navigation", () => {
  it("renders nav brand text Zyra in the header", () => {
    mockFetchSuccess();
    render(<TestApp />);

    expect(screen.getByText("Zyra")).toBeInTheDocument();
  });

  it("renders sidebar Dashboard navigation item", () => {
    mockFetchSuccess();
    render(<TestApp />);

    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });
});
