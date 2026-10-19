import { Link } from 'react-router-dom';
import { resolveImageUrl } from '../api/api';

export default function Hero({ places = [] }) {
  const scenicPlace =
    places.find(
      (place) =>
        place.name?.toLowerCase().includes('bolgoda') &&
        place.primary_image
    ) ||
    places.find(
      (place) =>
        place.name?.toLowerCase().includes('beach') &&
        place.primary_image
    ) ||
    places.find((place) => place.primary_image);

  const scenicImage = scenicPlace
    ? resolveImageUrl(scenicPlace.primary_image)
    : null;

  return (
    <section className="relative isolate flex min-h-[700px] items-center overflow-hidden bg-ocean-950 text-white md:min-h-[760px]">
      {scenicImage && (
        <img
          src={scenicImage}
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
          fetchPriority="high"
        />
      )}

      <div className="absolute inset-0 -z-10 bg-ocean-950/35" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ocean-950 via-ocean-950/95 to-transparent lg:via-ocean-950/75" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ocean-950/85 via-transparent to-ocean-950/25" />

      <div className="pointer-events-none absolute -left-40 top-0 h-[480px] w-[480px] rounded-full bg-ocean-400/20 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-4 pb-28 pt-24 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pb-36 lg:pt-32">
        <div className="max-w-2xl animate-slide-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-sand-300" />
            Discover Panadura & beyond
          </span>

          <h1 className="mt-7 font-display text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            Your next day out
            <span className="block text-sand-300">
              starts here.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-relaxed text-ocean-100 sm:text-lg">
            Explore beautiful places around Panadura. Find the
            spots you love, check the details, and bring them
            together in one simple day plan.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/places"
              className="btn-primary !bg-sand-400 !px-8 !py-3.5 !text-ocean-950 hover:!bg-sand-300"
            >
              Explore Places <span aria-hidden="true">↗</span>
            </Link>

            <Link
              to="/itinerary"
              className="btn-outline-light !px-8 !py-3.5 !backdrop-blur-md"
            >
              Plan My Day
            </Link>
          </div>

          <div className="mt-14 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/20 pt-6 text-sm text-ocean-100">
            <span>
              <strong className="font-display text-xl text-white">
                {places.length || '10+'}
              </strong>{' '}
              <p>places</p>
            </span>

            <span>
              <strong className="font-display text-xl text-white">
                25km
              </strong>{' '}
              <p>around Panadura</p>
            </span>

            <span>
              <strong className="font-display text-xl text-white">
                1 day
              </strong>{' '}
              <p>your way</p>
            </span>
          </div>
        </div>

        <div className="hidden h-full items-end justify-end pb-4 lg:flex">
          <div className="max-w-xs rounded-2xl border border-white/30 bg-ocean-950/25 p-5 shadow-xl backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-sand-300/60 text-sand-300">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="m15.5 8.5-2.3 4.7-4.7 2.3 2.3-4.7 4.7-2.3Z" />
                </svg>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-sand-300">
                  Ceylon Compass
                </p>
                <p className="mt-1 text-sm font-medium text-white">
                  A little closer to your next adventure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-wave-pattern bg-repeat-x bg-bottom opacity-95" />
    </section>
  );
}