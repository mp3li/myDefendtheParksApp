import type { IndigenousContextData, NearbySovereignty } from '@/types/parks';
import { fetchIndigenousContextByCoordinates } from '@/services/native-land-api';

const EARTH_RADIUS_METERS = 6371000;
const NEARBY_DISTANCE_METERS = 50000;
const NEARBY_BEARINGS = [0, 45, 90, 135, 180, 225, 270, 315];

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function toDegrees(value: number) {
  return (value * 180) / Math.PI;
}

function offsetCoordinate(latitude: number, longitude: number, distanceMeters: number, bearingDegrees: number) {
  const angularDistance = distanceMeters / EARTH_RADIUS_METERS;
  const bearing = toRadians(bearingDegrees);
  const lat1 = toRadians(latitude);
  const lon1 = toRadians(longitude);

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(angularDistance) +
      Math.cos(lat1) * Math.sin(angularDistance) * Math.cos(bearing)
  );
  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(lat1),
      Math.cos(angularDistance) - Math.sin(lat1) * Math.sin(lat2)
    );

  return {
    latitude: toDegrees(lat2),
    longitude: ((toDegrees(lon2) + 540) % 360) - 180,
  };
}

function addNearbyRecords(
  records: Map<string, NearbySovereignty>,
  context: IndigenousContextData,
  currentContext: IndigenousContextData,
  approximateDistanceMeters: number
) {
  const currentNames = new Set(
    [...currentContext.territories, ...currentContext.languages, ...currentContext.treaties].map((name) =>
      name.toLowerCase()
    )
  );

  const addRecord = (name: string, category: NearbySovereignty['category']) => {
    const normalized = name.trim();
    if (!normalized || currentNames.has(normalized.toLowerCase())) {
      return;
    }

    const key = `${category}:${normalized.toLowerCase()}`;
    const existing = records.get(key);
    if (!existing || approximateDistanceMeters < existing.approximateDistanceMeters) {
      records.set(key, {
        name: normalized,
        category,
        approximateDistanceMeters,
        referenceLinks: context.referenceLinks,
      });
    }
  };

  context.territories.forEach((name) => addRecord(name, 'territory'));
  context.languages.forEach((name) => addRecord(name, 'language'));
  context.treaties.forEach((name) => addRecord(name, 'treaty'));
}

export async function fetchLocationContext(latitude: number, longitude: number) {
  return fetchIndigenousContextByCoordinates(String(latitude), String(longitude));
}

export async function fetchNearbySovereignties(
  latitude: number,
  longitude: number,
  currentContext: IndigenousContextData
) {
  const records = new Map<string, NearbySovereignty>();

  const lookups = NEARBY_BEARINGS.map(async (bearing) => {
    const coordinate = offsetCoordinate(latitude, longitude, NEARBY_DISTANCE_METERS, bearing);
    const context = await fetchIndigenousContextByCoordinates(
      String(coordinate.latitude),
      String(coordinate.longitude)
    );
    addNearbyRecords(records, context, currentContext, NEARBY_DISTANCE_METERS);
  });

  await Promise.allSettled(lookups);

  return [...records.values()]
    .sort((left, right) => {
      if (left.approximateDistanceMeters !== right.approximateDistanceMeters) {
        return left.approximateDistanceMeters - right.approximateDistanceMeters;
      }
      return left.name.localeCompare(right.name);
    })
    .slice(0, 12);
}
