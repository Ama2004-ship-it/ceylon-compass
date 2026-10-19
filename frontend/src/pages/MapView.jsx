import { useEffect, useState } from 'react';
import { fetchPlacesForMap, fetchCategories } from '../api/api';
import LeafletMap from '../components/LeafletMap';
import CategoryFilter from '../components/CategoryFilter';
import Loader from '../components/Loader';
import ErrorBanner from '../components/ErrorBanner';

export default function MapView() {
  const [places, setPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([fetchPlacesForMap(), fetchCategories()])
      .then(([placeData, catData]) => {
        setPlaces(placeData);
        setCategories(catData);
      })
      .catch(() => setError('Could not load map data. Please check the backend is running.'))
      .finally(() => setLoading(false));
  }, []);

  function toggleCategory(name) {
    setSelected((prev) => (prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]));
  }

  const categoryNameById = Object.fromEntries(categories.map((c) => [c.id, c.name]));
  const visiblePlaces =
    selected.length === 0
      ? places
      : places.filter((p) => selected.includes(categoryNameById[p.category_id]));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <span className="section-eyebrow">Interactive Map</span>
      <h1 className="section-heading">All destinations at a glance</h1>
      <p className="mt-3 text-ocean-600 max-w-2xl">
        Every place plotted around the Panadura reference point (the dark marker). Filter by
        category to focus on what interests you most.
      </p>

      <div className="mt-6">
        <CategoryFilter categories={categories} selected={selected} onToggle={toggleCategory} />
      </div>

      <div className="mt-8">
        {loading && <Loader label="Loading map..." />}
        {!loading && error && <ErrorBanner message={error} />}
        {!loading && !error && (
          <div className="h-[32rem] rounded-3xl overflow-hidden shadow-card-hover border-4 border-white">
            <LeafletMap places={visiblePlaces} zoom={11} />
          </div>
        )}
      </div>
    </div>
  );
}
