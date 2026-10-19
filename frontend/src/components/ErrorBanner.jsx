export default function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 flex items-start gap-2">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4M12 16h.01" />
      </svg>
      <span>{message}</span>
    </div>
  );
}
