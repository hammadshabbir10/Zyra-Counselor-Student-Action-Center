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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// ---------------------------------------------------------------------------
// DashboardContent — main page content (ActionCenter)
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
// AppContent — routes based on activeTab
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
// App — root component with QueryClientProvider
// ---------------------------------------------------------------------------
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app-layout">
        <TopNav />
        <div className="app-body">
          <Sidebar />
          <main className="app-main-content">
            <AppContent />
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
}
