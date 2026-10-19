import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { fetchPlaces, deletePlace, resolveImageUrl } from '../api/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import ErrorBanner from '../components/ErrorBanner';

export default function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [notice, setNotice] = useState(() => location.state?.notice || '');
  const [deletingId, setDeletingId] = useState(null);
  const { username } = useAuth();

  useEffect(() => {
    let active = true;
    fetchPlaces()
      .then((data) => { if (active) setPlaces(data); })
      .catch(() => { if (active) setError('Could not load places.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (location.state?.notice) {
      setNotice(location.state.notice);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  async function handleDelete(place) {
    const confirmed = window.confirm(
      `Delete "${place.name}"? This cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingId(place.id);
    setActionError(null);
    setNotice('');
    try {
      await deletePlace(place.id);
      setPlaces((prev) => prev.filter((p) => p.id !== place.id));
      setNotice(`"${place.name}" deleted successfully.`);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to delete place.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="min-h-[70vh] bg-ocean-50/40 pb-16">
      <div className="bg-ocean-gradient px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-sand-200">Ceylon Compass · Admin</span>
          <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Manage Places</h1>
          <p className="mt-2 text-sm text-ocean-100">Welcome back, {username || 'Admin'}. Keep your destinations up to date.</p>
        </div>
        <div className="flex flex-wrap gap-3">
        <Link to="/" className="btn-outline-light !px-5 !py-2.5">View Public Site <span aria-hidden="true">↗</span></Link>
        <Link to="/admin/places/new" className="btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add New Place
        </Link>
        </div>
      </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-9 sm:px-6 lg:px-8">
        {notice && (
          <div role="status" className="mb-5 flex items-start justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-900">
            <span>✓ {notice}</span>
            <button type="button" onClick={() => setNotice('')} aria-label="Dismiss success message" className="rounded px-1 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-400">✕</button>
          </div>
        )}
        {actionError && <div className="mb-5"><ErrorBanner message={actionError} /></div>}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold text-ocean-950">Your places</h2>
            <p className="mt-1 text-sm text-ocean-600">Review and update destinations shown on the public site.</p>
          </div>
          {!loading && !error && <span className="badge">{places.length} {places.length === 1 ? 'place' : 'places'}</span>}
        </div>
        {loading && <Loader label="Loading places..." />}
        {!loading && error && <ErrorBanner message={error} />}
        {!loading && !error && places.length === 0 && (
          <EmptyState
            title="No places yet"
            message="Add your first place to get the catalogue started."
            action={
              <Link to="/admin/places/new" className="btn-primary">
                Add New Place
              </Link>
            }
          />
        )}

        {!loading && !error && places.length > 0 && (
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-ocean-50/70">
                <tr className="text-left text-ocean-500 border-b border-ocean-100">
                  <th scope="col" className="p-4 font-semibold">Place</th>
                  <th scope="col" className="p-4 font-semibold">Category</th>
                  <th scope="col" className="p-4 font-semibold">Distance</th>
                  <th scope="col" className="p-4 font-semibold">Hours</th>
                  <th scope="col" className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {places.map((place) => (
                  <tr key={place.id} className="border-b border-ocean-50 last:border-0 hover:bg-ocean-50/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={resolveImageUrl(place.primary_image) || '/placeholder-place.svg'}
                          alt=""
                          className="w-12 h-10 object-cover rounded-lg shrink-0"
                        />
                        <span className="font-medium text-ocean-900">{place.name}</span>
                      </div>
                    </td>
                    <td className="p-4"><span className="badge">{place.category_name}</span></td>
                    <td className="p-4 text-ocean-600">{place.distance_km} km</td>
                    <td className="p-4 text-ocean-600">
  {place.is_24_hours
    ? '24 Hours'
    : place.hours_unavailable
    ? 'Not available'
    : `${place.opening_time?.slice(0,5)} - ${place.closing_time?.slice(0,5)}`}
</td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/places/${place.id}/edit`} className="btn-secondary !px-3 !py-1.5 text-xs">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(place)}
                          type="button"
                          disabled={deletingId !== null}
                          className="btn-danger !px-3 !py-1.5 text-xs"
                        >
                          {deletingId === place.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
