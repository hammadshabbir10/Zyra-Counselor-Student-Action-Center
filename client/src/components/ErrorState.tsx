// ---------------------------------------------------------------------------
// ErrorState — user-friendly error display with retry
// ---------------------------------------------------------------------------
interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="error-container" role="alert">
      <div className="error-icon">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" />
          <path d="M24 14v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="24" cy="32" r="1.5" fill="currentColor" />
        </svg>
      </div>
      <h3 className="error-title">Something went wrong</h3>
      <p className="error-message">{message}</p>
      {onRetry && (
        <button className="error-retry-btn" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}
