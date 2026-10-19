import { Link } from 'react-router-dom';
import { resolveImageUrl } from '../api/api';
import { useItinerary } from '../context/ItineraryContext';

export default function PlaceCard({
  place,
  compact = false,
}) {
  const { addPlace, isInItinerary } = useItinerary();
  const alreadyAdded = isInItinerary(place.id);

  const image =
    resolveImageUrl(place.primary_image) ||
    '/placeholder-place.svg';

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-ocean-100 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <div
        className={`relative overflow-hidden ${
          compact ? 'h-44' : 'h-56'
        }`}
      >
        <Link
          to={`/places/${place.id}`}
          aria-label={`View details for ${place.name}`}
          className="block h-full"
        >
          <img
            src={image}
            alt={place.name}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.src =
                '/placeholder-place.svg';
            }}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ocean-950/60 via-transparent to-transparent" />

        <span className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/60 bg-white/95 px-3 py-1.5 text-xs font-semibold text-ocean-800 shadow-sm">
          {place.category_name}
        </span>

        {place.distance_km !== undefined && (
          <span className="pointer-events-none absolute bottom-4 right-4 rounded-full border border-white/25 bg-ocean-950/75 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
            {place.distance_km} km away
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <Link
          to={`/places/${place.id}`}
          className="font-display text-lg font-semibold leading-snug text-ocean-950 transition hover:text-ocean-600"
        >
          {place.name}
        </Link>

        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-ocean-600">
          {place.short_description || place.description}
        </p>

        <div className="mt-5 flex items-center gap-3 border-t border-ocean-100 pt-4">
          <Link
            to={`/places/${place.id}`}
            className="inline-flex flex-1 items-center gap-1 text-sm font-semibold text-ocean-700 hover:text-ocean-500"
          >
            View details
            <span aria-hidden="true">↗</span>
          </Link>

          <button
            type="button"
            onClick={() => addPlace(place)}
            disabled={alreadyAdded}
            aria-label={
              alreadyAdded
                ? `${place.name} added to plan`
                : `Add ${place.name} to plan`
            }
            className={`inline-flex min-w-[116px] items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-ocean-300 focus:ring-offset-2 ${
              alreadyAdded
                ? 'cursor-default bg-ocean-50 text-ocean-700'
                : 'bg-ocean-600 text-white hover:bg-ocean-700'
            }`}
          >
            <span aria-hidden="true">
              {alreadyAdded ? '✓' : '+'}
            </span>
            {alreadyAdded ? 'Added' : 'Add to Plan'}
          </button>
        </div>
      </div>
    </article>
  );
}