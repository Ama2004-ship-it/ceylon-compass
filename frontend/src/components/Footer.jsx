import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-ocean-950 text-ocean-100 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src="/compass-icon.svg" alt="Ceylon Compass" className="w-8 h-8" />
            <span className="font-display font-bold text-white text-lg">Ceylon Compass</span>
          </div>
          <p className="text-sm text-ocean-300 max-w-xs">
            Discover places of interest around Panadura and build a practical one-day visit plan
            in minutes.
          </p>
        </div>

        <div>
          <h4 className="font-display font-semibold text-white mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-ocean-300">
            <li><Link to="/places" className="hover:text-white transition">All Places</Link></li>
            <li><Link to="/map" className="hover:text-white transition">Interactive Map</Link></li>
            <li><Link to="/itinerary" className="hover:text-white transition">My Itinerary</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-white mb-3">Good to know</h4>
          <p className="text-sm text-ocean-300 max-w-xs">
            Distances, travel times and route guidance are estimates and may vary with traffic,
            weather and road conditions. Please verify opening hours and entry fees before
            travelling.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-ocean-400">
        Ceylon Compass &mdash; Developed for the ITE2953 university project.
      </div>
    </footer>
  );
}
