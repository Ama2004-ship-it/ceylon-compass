import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <p className="font-display font-bold text-6xl text-ocean-200">404</p>
      <h1 className="font-display font-bold text-2xl text-ocean-900 mt-2">Page not found</h1>
      <p className="text-ocean-500 mt-2 max-w-sm">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link to="/" className="btn-primary mt-6">Back to Home</Link>
    </div>
  );
}
