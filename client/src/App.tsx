import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAppStore } from "./store/appStore";
import { useActionCenter } from "./hooks/useActionCenter";
import { Sidebar } from "./components/Sidebar";
import { TopNav } from "./components/TopNav";
import { StudentProfile } from "./components/StudentProfile";
import { SummaryCards } from "./components/SummaryCards";
import { TaskList } from "./components/TaskList";
import { MessageList } from "./components/MessageList";
import { LoadingState } from "./components/LoadingState";
import { ErrorState } from "./components/ErrorState";
import { StudentsDirectory } from "./components/StudentsDirectory";
import { TaskManagement } from "./components/TaskManagement";
import { MessagesView } from "./components/MessagesView";
import { HelpView } from "./components/HelpView";
import { SplashScreen } from "./components/SplashScreen";
import { LandingPage } from "./components/LandingPage";

// ---------------------------------------------------------------------------
// App — My root component that orchestrates the entire page lifecycle.
// I use a simple three-phase routing approach via Zustand:
//   Phase 1: SplashScreen → cinematic Zyra logo animation
//   Phase 2: LandingPage  → marketing overview with "Open Action Center" CTA
//   Phase 3: Full App     → TopNav + Sidebar + Dashboard content
//
// I initialize React Query here with sensible defaults: 2 retries and no
// refetch on window focus, which prevents unnecessary network calls when the
// counselor switches between browser tabs during a busy school day.
// ---------------------------------------------------------------------------

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// ---------------------------------------------------------------------------
// DashboardContent — The main action center view for a selected student.
// I fetch the student's full action center payload (profile, tasks, messages,
// summary) and render the appropriate loading/error/success state.
// ---------------------------------------------------------------------------
function DashboardContent() {
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

// ---------------------------------------------------------------------------
// AppContent — My tab router inside the dashboard. I switch between the
// different views (Dashboard, Students, Tasks, Messages, Help) based on
// which sidebar tab the counselor clicks. Each view is its own component
// to keep the codebase modular.
// ---------------------------------------------------------------------------
function AppContent() {
  const activeTab = useAppStore((s) => s.activeTab);

  switch (activeTab) {
    case "dashboard":
      return <DashboardContent />;
    case "students":
      return <StudentsDirectory />;
    case "tasks":
      return <TaskManagement />;
    case "messages":
      return <MessagesView />;
    case "help":
      return <HelpView />;
    default:
      return <DashboardContent />;
  }
}

// ---------------------------------------------------------------------------
// App — The actual export. I wrap everything in QueryClientProvider so all
// child components can use React Query hooks. The currentPage state controls
// which top-level view is rendered.
// ---------------------------------------------------------------------------
export default function App() {
  const currentPage = useAppStore((s) => s.currentPage);

  return (
    <QueryClientProvider client={queryClient}>
      {currentPage === "splash" && <SplashScreen />}
      {currentPage === "landing" && <LandingPage />}
      {currentPage === "app" && (
        <div className="app-layout">
          <TopNav />
          <div className="app-body">
            <Sidebar />
            <main className="app-main-content">
              <AppContent />
            </main>
          </div>
        </div>
      )}
    </QueryClientProvider>
  );
}
