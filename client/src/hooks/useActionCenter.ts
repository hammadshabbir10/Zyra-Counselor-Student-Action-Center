import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchStudents,
  fetchActionCenter,
  updateTaskStatus,
} from "../api/actionCenter";
import type { TaskStatus } from "../types";

// ---------------------------------------------------------------------------
// React Query Hooks — My data fetching layer.
// I rely on TanStack Query to handle caching, background refetching, and
// loading states. By wrapping my API calls in these hooks, I keep my UI
// components completely clean of fetch logic. I also use mutation invalidation
// here to ensure the UI instantly reflects task status updates.
// ---------------------------------------------------------------------------

/** Fetches the list of all students. Stale time set to 5 minutes. */
export function useStudents() {
  return useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
    staleTime: 5 * 60 * 1000,
  });
}

/** Fetches the full action center data for a specific student. */
export function useActionCenter(studentId: string) {
  return useQuery({
    queryKey: ["action-center", studentId],
    queryFn: () => fetchActionCenter(studentId),
    enabled: !!studentId,
    staleTime: 30 * 1000,
  });
}

/** Mutation to update a task's status, with optimistic cache invalidation. */
export function useUpdateTaskStatus(studentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
      updateTaskStatus(taskId, status),
    onSuccess: () => {
      // Refetch the action center to get updated summary and task list
      queryClient.invalidateQueries({
        queryKey: ["action-center", studentId],
      });
    },
  });
}
