export default function EmptyState({ title = 'Nothing here yet', message, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-16 h-16 rounded-full bg-ocean-50 flex items-center justify-center mb-4">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ocean-400">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
      </div>
      <h3 className="font-display font-semibold text-lg text-ocean-900 mb-1">{title}</h3>
      {message && <p className="text-sm text-ocean-500 max-w-sm mb-4">{message}</p>}
      {action}
    </div>
  );
}
