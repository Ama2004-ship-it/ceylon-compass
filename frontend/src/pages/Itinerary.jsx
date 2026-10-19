import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useItinerary } from '../context/ItineraryContext';
import { buildItinerary, resolveImageUrl } from '../api/api';
import LeafletMap from '../components/LeafletMap';
import EmptyState from '../components/EmptyState';
import ErrorBanner from '../components/ErrorBanner';
import Loader from '../components/Loader';

export default function Itinerary() {
  const { places, removePlace, clearItinerary } = useItinerary();
  const selectionKey = places.map((place) => place.id).join(',');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const data = await buildItinerary(places.map((p) => p.id));
      setResult({ ...data, selectionKey });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not generate the itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  function handleSaveAsFile() {
    const blob = new Blob([JSON.stringify({ places, result: currentResult }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ceylon-compass-itinerary.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  const currentResult = result?.selectionKey === selectionKey ? result : null;
  const routeCoords = currentResult
    ? currentResult.stops.map((stop) => {
        const place = places.find((p) => p.id === stop.placeId);
        return place ? [Number(place.latitude), Number(place.longitude)] : null;
      }).filter(Boolean)
    : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <span className="section-eyebrow">One-Day Visit Planner</span>
      <h1 className="section-heading">My Itinerary</h1>
      <p className="mt-3 text-ocean-600 max-w-2xl">
        Add places from the catalogue, then generate a suggested one-day schedule based on
        proximity and opening hours.
      </p>

      {places.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="Your itinerary is empty"
            message="Browse places and tap “Add to my itinerary” to start planning your day."
            action={
              <Link to="/places" className="btn-primary">
                Explore Places
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-lg text-ocean-900">
                Selected places ({places.length})
              </h2>
              <button onClick={clearItinerary} className="text-sm font-medium text-red-500 hover:text-red-700">
                Clear all
              </button>
            </div>

            {places.map((place) => (
              <div key={place.id} className="card flex items-center gap-4 p-3">
                <img
                  src={resolveImageUrl(place.primary_image) || '/placeholder-place.svg'}
                  alt={place.name}
                  className="w-20 h-16 object-cover rounded-xl shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-ocean-900 truncate">{place.name}</p>
                  <p className="text-xs text-ocean-500">{place.category_name}</p>
                </div>
                <button
                  onClick={() => removePlace(place.id)}
                  className="p-2 rounded-full text-ocean-400 hover:bg-red-50 hover:text-red-500 shrink-0"
                  aria-label="Remove"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 6l12 12M6 18L18 6" />
                  </svg>
                </button>
              </div>
            ))}

            <button onClick={handleGenerate} disabled={loading} className="btn-primary w-full mt-4">
              {loading ? 'Generating...' : 'Generate Itinerary'}
            </button>

            {error && <ErrorBanner message={error} />}

            {loading && <Loader label="Building your day plan..." />}

            {currentResult && !loading && (
              <div className="mt-6 space-y-4 print:mt-0" id="itinerary-result">
                <div className="rounded-2xl bg-ocean-50 border border-ocean-100 p-4 flex flex-wrap gap-6 text-sm">
                  <div>
                    <p className="text-ocean-500">Start</p>
                    <p className="font-display font-semibold text-ocean-900">{currentResult.startTime}</p>
                  </div>
                  <div>
                    <p className="text-ocean-500">Estimated finish</p>
                    <p className="font-display font-semibold text-ocean-900">{currentResult.endTime}</p>
                  </div>
                  <div>
                    <p className="text-ocean-500">Total travel distance</p>
                    <p className="font-display font-semibold text-ocean-900">{currentResult.totalTravelKm} km</p>
                  </div>
                  {!currentResult.fitsInOneDay && (
                    <div className="w-full">
                      <p className="text-amber-600 text-sm font-medium mt-1">
                        Some stops need attention. Check the timings and warnings below.
                      </p>
                    </div>
                  )}
                </div>

                <ol className="space-y-3">
                  {currentResult.stops.map((stop, i) => (
                    <li key={stop.placeId} className="card p-4 flex gap-4">
                      <div className="w-9 h-9 rounded-full bg-ocean-500 text-white font-display font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <p className="font-display font-semibold text-ocean-900">{stop.name}</p>
                          <p className="text-sm text-ocean-600 font-medium">
                            {stop.arrivalTime} &ndash; {stop.departureTime}
                          </p>
                        </div>
                        <p className="text-xs text-ocean-500 mt-1">
                          {stop.travelMinutesFromPrevious} min travel &middot; {stop.legDistanceKm} km from previous stop
                        </p>
                        {stop.waitingMinutes > 0 && <p className="text-xs text-ocean-500 mt-1">Wait {stop.waitingMinutes} min until opening</p>}
                        {stop.warnings.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {stop.warnings.map((w) => (
                              <li key={w} className="text-xs text-amber-600 flex items-start gap-1.5">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0">
                                  <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                </svg>
                                {w}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>

                <div className="flex flex-wrap gap-3 pt-2 print:hidden">
                  <button onClick={handlePrint} className="btn-secondary">
                    Print itinerary
                  </button>
                  <button onClick={handleSaveAsFile} className="btn-secondary">
                    Save as file
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1 print:hidden">
            {currentResult && <p className="text-xs text-ocean-500 mb-2">The line connects stops directly; use directions for actual roads.</p>}
            <div className="h-96 rounded-3xl overflow-hidden shadow-card border border-ocean-100 sticky top-24">
              <LeafletMap places={places} routeCoords={routeCoords.length > 1 ? routeCoords : null} zoom={11} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
