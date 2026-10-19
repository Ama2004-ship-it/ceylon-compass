import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { resolveImageUrl } from '../api/api';

export default function ShowcaseSection({ places }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (places.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % places.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [places.length]);

  if (places.length === 0) return null;

  const active = places[index];
  const image = resolveImageUrl(active.primary_image) || '/placeholder-place.svg';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Dynamic rotating place card */}
        <div className="relative">
          <div className="relative rounded-3xl overflow-hidden shadow-card-hover aspect-[4/3]">
            {places.map((place, i) => (
              <img
                key={place.id}
                src={resolveImageUrl(place.primary_image) || '/placeholder-place.svg'}
                alt={place.name}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  i === index ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/80 via-ocean-950/10 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <span className="badge bg-sand-400 text-ocean-950 mb-2">{active.category_name}</span>
              <h3 className="font-display font-bold text-2xl">{active.name}</h3>
              <p className="text-sm text-ocean-100 mt-1 line-clamp-2 max-w-md">
                {active.short_description || active.description}
              </p>
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-5">
            {places.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setIndex(i)}
                aria-label={`Show ${p.name}`}
                className={`h-2 rounded-full transition-all ${
                  i === index ? 'w-8 bg-ocean-500' : 'w-2 bg-ocean-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Explanatory content */}
        <div>
          <span className="section-eyebrow">Why Ceylon Compass</span>
          <h2 className="section-heading">
            Every hidden gem near Panadura, <span className="text-ocean-500">in one place.</span>
          </h2>
          <p className="mt-5 text-ocean-600 leading-relaxed">
            No more piecing together information from maps, social media and travel blogs.
            Ceylon Compass brings together beaches, temples, nature reserves and local dining
            spots &mdash; each with real opening hours, travel tips and distances &mdash; so you can decide
            where to go and how to get there in minutes.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              'Search and filter by category in real time',
              'Rich place details with photo galleries and maps',
              'A smart one-day itinerary builder with route guidance',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-ocean-800">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-ocean-100 text-ocean-600 flex items-center justify-center shrink-0">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
          <Link to="/places" className="btn-primary mt-8">
            Explore All Places
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
