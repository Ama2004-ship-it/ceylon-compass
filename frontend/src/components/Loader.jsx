export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-ocean-500">
      <div className="w-10 h-10 border-4 border-ocean-200 border-t-ocean-500 rounded-full animate-spin" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}
