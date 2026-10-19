import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPlaceById } from '../api/api';
import { useItinerary } from '../context/ItineraryContext';
import Gallery from '../components/Gallery';
import LeafletMap from '../components/LeafletMap';
import Loader from '../components/Loader';
import ErrorBanner from '../components/ErrorBanner';

function formatTime(t) {
  if (!t) return null;
  return t.slice(0, 5);
}

export default function PlaceDetails() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addPlace, isInItinerary } = useItinerary();

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchPlaceById(id)
      .then(setPlace)
      .catch(() => setError('This place could not be found.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader label="Loading place details..." />;
  if (error || !place) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <ErrorBanner message={error || 'This place could not be found.'} />
        <Link to="/places" className="btn-secondary mt-6 inline-flex">Back to all places</Link>
      </div>
    );
  }

  const alreadyAdded = isInItinerary(place.id);
  const hasHours = !place.hours_unavailable && !place.is_24_hours && place.opening_time && place.closing_time;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/places" className="inline-flex items-center gap-1.5 text-sm font-medium text-ocean-600 hover:text-ocean-800 mb-6">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to all places
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <span className="badge">{place.category_name}</span>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-ocean-950 mt-3">{place.name}</h1>

          <div className="mt-6">
            <Gallery
              images={[place.primary_image, place.image_1, place.image_2]}
              alt={place.name}
            />
          </div>

          <div className="mt-8 prose-sm max-w-none">
            <h2 className="font-display font-semibold text-xl text-ocean-900 mb-2">About this place</h2>
            <p className="text-ocean-700 leading-relaxed whitespace-pre-line">{place.description}</p>
          </div>

          {place.travel_tips && (
            <div className="mt-8 rounded-2xl bg-sand-50 border border-sand-200 p-5">
              <h3 className="font-display font-semibold text-ocean-900 flex items-center gap-2 mb-1.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l2.4 7.2H22l-6 4.6 2.3 7.2-6.3-4.5-6.3 4.5 2.3-7.2-6-4.6h7.6z" />
                </svg>
                Travel Tips
              </h3>
              <p className="text-ocean-700 text-sm leading-relaxed">{place.travel_tips}</p>
            </div>
          )}

          <div className="mt-8 rounded-2xl overflow-hidden h-72 shadow-card border border-ocean-100">
            <LeafletMap places={[place]} zoom={13} />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="card p-6 sticky top-24 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ocean-500">Distance from Panadura</span>
              <span className="font-display font-semibold text-ocean-900">{place.distance_km} km</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-display font-semibold text-ocean-900 text-right">
  {place.is_24_hours
    ? 'Open 24 hours'
    : hasHours
    ? `${formatTime(place.opening_time)} - ${formatTime(place.closing_time)}`
    : 'Not available'}
</span>
            </div>

            <hr className="border-ocean-100" />

            <button
              onClick={() => addPlace(place)}
              disabled={alreadyAdded}
              className="btn-primary w-full"
            >
              {alreadyAdded ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                  Added to itinerary
                </>
              ) : (
                'Add to my itinerary'
              )}
            </button>
            <Link to="/itinerary" className="btn-secondary w-full">
              View my itinerary
            </Link>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 text-sm font-semibold text-ocean-600 hover:text-ocean-800 pt-1"
            >
              Get directions on Google Maps
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M7 7h10v10" />
              </svg>
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
