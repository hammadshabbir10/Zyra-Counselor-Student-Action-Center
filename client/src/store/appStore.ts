import { create } from "zustand";

// ---------------------------------------------------------------------------
// Client-side UI State — managed with Zustand
// Tracks which student is currently selected in the action center.
// ---------------------------------------------------------------------------

export type TabType = 'dashboard' | 'students' | 'tasks' | 'messages' | 'help';

interface AppState {
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedStudentId: "stu_001",
  setSelectedStudentId: (id: string) => set({ selectedStudentId: id }),
  activeTab: 'dashboard',
  setActiveTab: (tab: TabType) => set({ activeTab: tab }),
}));
