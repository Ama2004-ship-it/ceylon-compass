const { haversineDistanceKm } = require('./haversine');

const AVG_SPEED_KMH = 30;
const DAY_START_MINUTES = 8 * 60;
const DAY_END_MINUTES = 19 * 60;

function minutesToTimeStr(totalMinutes) {
  const minutes = ((totalMinutes % 1440) + 1440) % 1440;
  const hours = Math.floor(minutes / 60).toString().padStart(2, '0');
  const remainingMinutes = Math.floor(minutes % 60)
    .toString()
    .padStart(2, '0');

  return `${hours}:${remainingMinutes}`;
}

function timeStrToMinutes(timeStr) {
  if (!timeStr) return null;

  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

function generateItinerary(
  places,
  referenceLat,
  referenceLng,
  maxRadiusKm
) {
  const remaining = [...places];
  const schedule = [];

  let currentLat = referenceLat;
  let currentLng = referenceLng;
  let clock = DAY_START_MINUTES;

  while (remaining.length > 0) {
    let nearestIndex = 0;
    let bestScore = Infinity;

    remaining.forEach((place, index) => {
      const distance = haversineDistanceKm(
        currentLat,
        currentLng,
        place.latitude,
        place.longitude
      );

      const travelMinutes = Math.round(
        (distance / AVG_SPEED_KMH) * 60
      );

      const openTime = timeStrToMinutes(place.opening_time);
      const closeTime = timeStrToMinutes(place.closing_time);
      const unknownHours =
        place.is_24_hours || place.hours_unavailable;

      const arrival =
        unknownHours || openTime === null
          ? clock + travelMinutes
          : Math.max(clock + travelMinutes, openTime);

      const finish =
        arrival + Number(place.avg_visit_minutes || 90);

      const fitsHours =
        unknownHours ||
        closeTime === null ||
        finish <= closeTime;

      const score =
        (fitsHours ? 0 : 1e6) +
        (arrival - clock) +
        distance;

      if (score < bestScore) {
        bestScore = score;
        nearestIndex = index;
      }
    });

    const [next] = remaining.splice(nearestIndex, 1);

    const legDistanceKm = haversineDistanceKm(
      currentLat,
      currentLng,
      next.latitude,
      next.longitude
    );

    const travelMinutes = Math.round(
      (legDistanceKm / AVG_SPEED_KMH) * 60
    );

    const openTime = timeStrToMinutes(next.opening_time);
    const closeTime = timeStrToMinutes(next.closing_time);

    const earliestArrival = clock + travelMinutes;

    const arrival =
      next.is_24_hours ||
      next.hours_unavailable ||
      openTime === null
        ? earliestArrival
        : Math.max(earliestArrival, openTime);

    const visitMinutes = Number(next.avg_visit_minutes || 90);
    const departure = arrival + visitMinutes;

    const distanceFromReference = haversineDistanceKm(
      referenceLat,
      referenceLng,
      next.latitude,
      next.longitude
    );

    const warnings = [];

    if (distanceFromReference > maxRadiusKm) {
      warnings.push(
        `This place is ${distanceFromReference.toFixed(
          1
        )} km away, outside the ${maxRadiusKm} km planning radius.`
      );
    }

    if (!next.is_24_hours) {
      if (
        next.hours_unavailable ||
        (openTime === null && closeTime === null)
      ) {
        warnings.push(
          'Opening hours are not available for this place - please confirm before travelling.'
        );
      } else if (
        closeTime !== null &&
        departure > closeTime
      ) {
        warnings.push(
          `Estimated departure (${minutesToTimeStr(
            departure
          )}) is after closing time (${minutesToTimeStr(
            closeTime
          )}).`
        );
      }
    }

    if (departure > DAY_END_MINUTES) {
      warnings.push(
        'This stop may make the itinerary run later than a practical one-day trip.'
      );
    }

    schedule.push({
      placeId: next.id,
      name: next.name,
      travelMinutesFromPrevious: travelMinutes,
      legDistanceKm: Number(legDistanceKm.toFixed(2)),
      distanceFromReferenceKm: Number(
        distanceFromReference.toFixed(2)
      ),
      arrivalTime: minutesToTimeStr(arrival),
      departureTime: minutesToTimeStr(departure),
      visitMinutes,
      waitingMinutes: arrival - earliestArrival,
      warnings,
    });

    clock = departure;
    currentLat = next.latitude;
    currentLng = next.longitude;
  }

  const totalTravelKm = schedule.reduce(
    (sum, stop) => sum + stop.legDistanceKm,
    0
  );

  return {
    startTime: minutesToTimeStr(DAY_START_MINUTES),
    endTime: minutesToTimeStr(clock),
    totalTravelKm: Number(totalTravelKm.toFixed(2)),
    stops: schedule,
    fitsInOneDay:
      clock <= DAY_END_MINUTES &&
      schedule.every((stop) =>
        stop.warnings.every((warning) =>
          warning.startsWith('Opening hours are not available')
        )
      ),
  };
}

module.exports = {
  generateItinerary,
  minutesToTimeStr,
};