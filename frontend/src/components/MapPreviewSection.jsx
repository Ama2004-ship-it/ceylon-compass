import { Link } from 'react-router-dom';
import LeafletMap from './LeafletMap';

export default function MapPreviewSection({ places }) {
  return (
    <section className="bg-ocean-50/60 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
          <span className="section-eyebrow">Know before you go</span>
          <h2 className="section-heading">
            See every destination, <span className="text-ocean-500">right on the map.</span>
          </h2>
          <p className="mt-5 text-ocean-600 leading-relaxed max-w-lg">
            Explore every place on an interactive map centred around Panadura. Check how far each
            destination is, get a feel for the area, and jump straight into turn-by-turn
            directions when you're ready to go.
          </p>
          <Link to="/map" className="btn-secondary mt-8">
            Open Full Map
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="order-1 lg:order-2 h-80 md:h-96 rounded-3xl overflow-hidden shadow-card-hover border-4 border-white">
          <LeafletMap places={places.slice(0, 10)} zoom={11} />
        </div>
      </div>
    </section>
  );
}
