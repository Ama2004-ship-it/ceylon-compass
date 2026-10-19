import { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import ShowcaseSection from '../components/ShowcaseSection';
import MapPreviewSection from '../components/MapPreviewSection';
import Loader from '../components/Loader';
import ErrorBanner from '../components/ErrorBanner';
import { fetchPlaces } from '../api/api';

export default function Home() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlaces()
      .then(setPlaces)
      .catch(() => setError('Could not load places right now. Please check the backend is running.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Hero places={places} />

      {loading && <Loader label="Loading destinations..." />}
      {error && (
        <div className="max-w-3xl mx-auto px-4 py-10">
          <ErrorBanner message={error} />
        </div>
      )}

      {!loading && !error && (
        <>
          <ShowcaseSection places={places} />
          <MapPreviewSection places={places} />

          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="rounded-3xl bg-ocean-gradient text-white px-8 py-14 md:px-16 md:py-16 text-center relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-56 h-56 bg-sand-400/10 rounded-full blur-3xl" />
              <h2 className="font-display font-bold text-3xl md:text-4xl relative">
                Ready to plan your day near Panadura?
              </h2>
              <p className="mt-4 text-ocean-100 max-w-xl mx-auto relative">
                Pick a few places you love, and let Ceylon Compass build a practical, time-aware
                itinerary in seconds.
              </p>
              <div className="mt-8 relative">
                <a href="/places" className="btn-primary !bg-sand-400 !text-ocean-950 hover:!bg-sand-400/90">
                  Start Exploring
                </a>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
