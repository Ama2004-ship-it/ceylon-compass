import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from 'react-leaflet';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import {
  fetchReferenceConfig,
  resolveImageUrl,
} from '../api/api';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const referenceIcon = new L.DivIcon({
  html: '<div style="background:#0f2739;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 0 0 3px #2685b8;"></div>',
  className: '',
  iconSize: [16, 16],
});

function distanceKm([fromLat, fromLng], toLat, toLng) {
  const rad = (degrees) => (degrees * Math.PI) / 180;

  const dLat = rad(toLat - fromLat);
  const dLng = rad(toLng - fromLng);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(fromLat)) *
      Math.cos(rad(toLat)) *
      Math.sin(dLng / 2) ** 2;

  return (
    6371 *
    2 *
    Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  );
}

function FitBounds({ points, boundsKey }) {
  const map = useMap();

  useEffect(() => {
    if (points.length > 1) {
      map.fitBounds(points, {
        padding: [36, 36],
        maxZoom: 14,
      });
    } else if (points.length === 1) {
      map.setView(points[0], 13);
    }
  }, [map, boundsKey]);

  return null;
}

export default function LeafletMap({
  center,
  places = [],
  showReference = true,
  routeCoords = null,
  height = '100%',
  zoom = 12,
}) {
  const [referenceCenter, setReferenceCenter] = useState([
    6.7296579,
    79.9294361,
  ]);

  useEffect(() => {
    if (center) return undefined;

    let active = true;

    fetchReferenceConfig()
      .then(({ referenceLat, referenceLng }) => {
        const lat = Number(referenceLat);
        const lng = Number(referenceLng);

        if (
          active &&
          typeof referenceLat === 'number' &&
          typeof referenceLng === 'number' &&
          Number.isFinite(lat) &&
          Number.isFinite(lng)
        ) {
          setReferenceCenter([lat, lng]);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [center]);

  const mapCenter = center || referenceCenter;

  const points = places
    .map((place) => [
      Number(place.latitude),
      Number(place.longitude),
    ])
    .filter(
      ([lat, lng]) =>
        Number.isFinite(lat) && Number.isFinite(lng)
    );

  const allPoints = showReference
    ? [...points, mapCenter]
    : points;

  const boundsKey = allPoints
    .map(([lat, lng]) => `${lat},${lng}`)
    .join('|');

  return (
    <div style={{ height }} className="w-full">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom
        wheelDebounceTime={80}
        wheelPxPerZoomLevel={100}
        zoomControl
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {showReference && (
          <Marker
            position={mapCenter}
            icon={referenceIcon}
          >
            <Popup>
              Reference location (Panadura)
            </Popup>
          </Marker>
        )}

        {places.map((place) => {
          const lat = Number(place.latitude);
          const lng = Number(place.longitude);

          if (
            !Number.isFinite(lat) ||
            !Number.isFinite(lng)
          ) {
            return null;
          }

          const photo = resolveImageUrl(
            place.primary_image
          );

          return (
            <Marker
              key={place.id}
              position={[lat, lng]}
              icon={defaultIcon}
            >
              <Popup minWidth={240} maxWidth={280}>
                <div className="w-[250px] max-w-full text-ocean-950">
                  <img
                    src={
                      photo ||
                      '/placeholder-place.svg'
                    }
                    alt={place.name}
                    className="h-32 w-full rounded-xl object-cover"
                    onError={(event) => {
                      event.currentTarget.src =
                        '/placeholder-place.svg';
                    }}
                  />

                  {place.category_name && (
                    <span className="mt-3 block text-[11px] font-semibold uppercase tracking-wide text-ocean-500">
                      {place.category_name}
                    </span>
                  )}

                  <h3 className="mt-1 font-display text-base font-bold leading-snug">
                    {place.name}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-xs text-ocean-600">
                    {place.short_description ||
                      place.description ||
                      'Explore this destination near Panadura.'}
                  </p>

                  <p className="mt-2 text-xs font-medium text-ocean-500">
                    {distanceKm(
                      mapCenter,
                      lat,
                      lng
                    ).toFixed(1)}{' '}
                    km from reference
                  </p>

                  <div className="mt-3 flex gap-2">
                    <Link
                      to={`/places/${place.id}`}
                      className="rounded-lg bg-ocean-600 px-3 py-2 text-xs font-semibold !text-white hover:bg-ocean-700"
                    >
                      View details
                    </Link>

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-ocean-200 px-3 py-2 text-xs font-semibold text-ocean-700 hover:bg-ocean-50"
                    >
                      Directions
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {routeCoords && routeCoords.length > 1 && (
          <Polyline
            positions={routeCoords}
            pathOptions={{
              color: '#2685b8',
              weight: 4,
              dashArray: '6 8',
            }}
          />
        )}

        {allPoints.length > 0 && (
          <FitBounds
            points={allPoints}
            boundsKey={boundsKey}
          />
        )}
      </MapContainer>
    </div>
  );
}