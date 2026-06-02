// ---------------------------------------------------------------------------
// LoadingState — My skeleton loader.
// I prefer skeleton loading over spinner icons because it prevents the UI
// from jumping around when data arrives. It gives the user a sense of what's
// coming before the API request finishes.
// ---------------------------------------------------------------------------
export function LoadingState() {
  return (
    <div className="loading-container" role="status" aria-label="Loading">
      <div className="loading-skeleton-card large" />
      <div className="loading-skeleton-grid">
        <div className="loading-skeleton-card small" />
        <div className="loading-skeleton-card small" />
        <div className="loading-skeleton-card small" />
        <div className="loading-skeleton-card small" />
      </div>
      <div className="loading-skeleton-card medium" />
      <div className="loading-skeleton-card medium" />
      <span className="sr-only">Loading student action center...</span>
    </div>
  );
}
