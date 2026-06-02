import { create } from "zustand";

// ---------------------------------------------------------------------------
// My global UI state store — I use Zustand here because it's lightweight and
// lets me avoid prop-drilling across my entire component tree. This single
// store manages three concerns:
//   1. Page routing (splash → landing → dashboard app)
//   2. Which student the counselor is currently viewing
//   3. Which sidebar tab is active inside the dashboard
// ---------------------------------------------------------------------------

export type TabType = 'dashboard' | 'students' | 'tasks' | 'messages' | 'help';
export type PageType = 'splash' | 'landing' | 'app';

interface AppState {
  // Page-level navigation (splash screen → landing → full app)
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;

  // Currently selected student in the action center
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;

  // Active sidebar tab inside the dashboard app
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentPage: "splash",
  setCurrentPage: (page: PageType) => set({ currentPage: page }),

  selectedStudentId: "stu_001",
  setSelectedStudentId: (id: string) => set({ selectedStudentId: id }),

  activeTab: "dashboard",
  setActiveTab: (tab: TabType) => set({ activeTab: tab }),
}));
