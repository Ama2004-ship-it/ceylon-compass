import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPlaces, fetchCategories } from '../api/api';
import { useItinerary } from '../context/ItineraryContext';
import PlaceCard from '../components/PlaceCard';
import CategoryFilter from '../components/CategoryFilter';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import ErrorBanner from '../components/ErrorBanner';

export default function Places() {
  const [places, setPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { places: planPlaces } = useItinerary();

  const hasFilters =
    Boolean(search.trim()) || selectedCategories.length > 0;

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(null);

    const timeout = setTimeout(() => {
      fetchPlaces({
        search: search.trim() || undefined,
        category: selectedCategories.length
          ? selectedCategories.join(',')
          : undefined,
      })
        .then((results) => {
          if (active) setPlaces(results);
        })
        .catch(() => {
          if (active) {
            setError(
              'Could not load places. Please check the backend is running.'
            );
          }
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [search, selectedCategories]);

  function toggleCategory(name) {
    setSelectedCategories((previous) =>
      previous.includes(name)
        ? previous.filter((category) => category !== name)
        : [...previous, name]
    );
  }

  function resetFilters() {
    setSearch('');
    setSelectedCategories([]);
  }

  return (
    <div className="bg-gradient-to-b from-ocean-50/70 to-white pb-20">
      <section className="relative overflow-hidden bg-ocean-gradient text-white">
        <div className="pointer-events-none absolute -right-24 -top-36 h-[450px] w-[450px] rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-8 -top-16 h-[350px] w-[350px] rounded-full border border-white/15" />
        <div className="pointer-events-none absolute right-16 top-14 h-52 w-52 rounded-full bg-sand-300/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 md:pt-20 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-sand-300">
              Explore Ceylon Compass
            </span>

            <h1 className="mt-5 font-display text-4xl font-bold leading-tight sm:text-5xl">
              Find a place worth{' '}
              <span className="text-sand-300">
                the journey.
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-ocean-100">
              Explore local favourites around Panadura. Search
              by name or interest, find the details, and add
              your favourites to a one-day plan.
            </p>
          </div>
        </div>
      </section>

      <div className="relative mx-auto -mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-ocean-100 bg-white p-5 shadow-card-hover sm:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="w-full lg:max-w-xl">
              <label
                htmlFor="place-search"
                className="mb-2 block text-sm font-semibold text-ocean-900"
              >
                Search places
              </label>

              <div className="relative">
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-ocean-500"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.3-4.3" />
                </svg>

                <input
                  id="place-search"
                  type="search"
                  placeholder="Try a place name or keyword..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  className="input !py-3 !pl-12"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={resetFilters}
                disabled={!hasFilters}
                className="btn-secondary !px-5 !py-3 disabled:opacity-50"
              >
                Reset Filters
              </button>

              {planPlaces.length > 0 && (
                <Link
                  to="/itinerary"
                  className="btn-primary !px-5 !py-3"
                >
                  My Plan ({planPlaces.length}) ↗
                </Link>
              )}
            </div>
          </div>

          <div className="mt-6 border-t border-ocean-100 pt-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ocean-500">
              Filter by category
            </p>

            <CategoryFilter
              categories={categories}
              selected={selectedCategories}
              onToggle={toggleCategory}
            />
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="section-eyebrow">
              Explore places
            </span>

            <h2 className="font-display text-2xl font-bold text-ocean-950 sm:text-3xl">
              {hasFilters
                ? 'Your results'
                : 'Places to discover'}
            </h2>
          </div>

          {!loading && !error && (
            <p
              className="rounded-full bg-ocean-50 px-4 py-2 text-sm font-semibold text-ocean-700"
              aria-live="polite"
            >
              {places.length}{' '}
              {places.length === 1 ? 'place' : 'places'} found
            </p>
          )}
        </div>

        <div className="mt-7">
          {loading && <Loader label="Finding places..." />}

          {!loading && error && (
            <ErrorBanner message={error} />
          )}

          {!loading && !error && places.length === 0 && (
            <div className="rounded-3xl border border-ocean-100 bg-white shadow-card">
              <EmptyState
                title={
                  hasFilters
                    ? 'No matching places'
                    : 'No places available yet'
                }
                message={
                  hasFilters
                    ? 'Try another keyword or reset your filters.'
                    : 'Please check back later.'
                }
                action={
                  hasFilters ? (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="btn-primary"
                    >
                      Reset Filters
                    </button>
                  ) : null
                }
              />
            </div>
          )}

          {!loading && !error && places.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {places.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}