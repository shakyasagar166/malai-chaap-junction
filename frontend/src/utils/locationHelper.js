// Restaurant Table Presence & Geolocation Verification Utilities
// Designed for Svad Malai Chaap Junction, Sector 23, Sanjay Nagar, Ghaziabad

export const RESTAURANT_COORDS = {
  name: 'Hotel',
  address: 'Sanjay Nagar, Ghaziabad',
  // Svad Malai Chaap Junction Coordinates
  latitude: 28.69472,
  longitude: 77.44528,
  // Distance threshold in meters: within 200m is considered physically at the restaurant
  maxDineInRadiusMeters: 200
};

/**
 * Calculate distance in meters between two GPS coordinates using Haversine formula
 */
export function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const R = 6371e3; // Earth radius in meters
  const toRad = deg => (deg * Math.PI) / 180;
  const phi1 = toRad(lat1);
  const phi2 = toRad(lat2);
  const deltaPhi = toRad(lat2 - lat1);
  const deltaLambda = toRad(lon2 - lon1);

  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Request device geolocation with a quick timeout (non-blocking)
 * Returns { status, distanceMeters, accuracy, lat, lng }
 * Statuses:
 * - 'VERIFIED_AT_RESTAURANT' (Customer is within 200m of restaurant)
 * - 'SUSPECTED_REMOTE' (Customer is > 200m away, e.g. at home)
 * - 'LOCATION_NOT_SHARED' (User denied GPS or permission not granted)
 * - 'NOT_SUPPORTED' (Browser lacks geolocation API)
 */
export async function getCustomerDistanceToRestaurant() {
  if (typeof window === 'undefined' || !navigator.geolocation) {
    return {
      status: 'NOT_SUPPORTED',
      distanceMeters: null,
      message: 'Browser does not support geolocation'
    };
  }

  return new Promise((resolve) => {
    // 5 second timeout so checkout is never stalled
    const timeoutId = setTimeout(() => {
      resolve({
        status: 'LOCATION_NOT_SHARED',
        distanceMeters: null,
        message: 'Location request timed out'
      });
    }, 5000);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId);
        const { latitude, longitude, accuracy } = position.coords;
        const dist = calculateDistanceMeters(
          latitude,
          longitude,
          RESTAURANT_COORDS.latitude,
          RESTAURANT_COORDS.longitude
        );

        const isAtRestaurant = dist != null && dist <= RESTAURANT_COORDS.maxDineInRadiusMeters;

        resolve({
          status: isAtRestaurant ? 'VERIFIED_AT_RESTAURANT' : 'SUSPECTED_REMOTE',
          distanceMeters: dist,
          accuracy: Math.round(accuracy || 0),
          latitude,
          longitude
        });
      },
      (error) => {
        clearTimeout(timeoutId);
        resolve({
          status: 'LOCATION_NOT_SHARED',
          distanceMeters: null,
          message: error.message || 'Location permission denied'
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 4500,
        maximumAge: 30000
      }
    );
  });
}

/**
 * Detect client device category
 */
export function detectClientDevice() {
  if (typeof window === 'undefined') return 'Web Client';
  const ua = navigator.userAgent || '';
  if (/android/i.test(ua)) return 'Android Mobile';
  if (/iphone/i.test(ua)) return 'Apple iPhone';
  if (/ipad/i.test(ua)) return 'Apple iPad';
  if (/windows/i.test(ua)) return 'Windows PC';
  if (/macintosh/i.test(ua)) return 'Mac OS';
  if (/linux/i.test(ua)) return 'Linux';
  return 'Mobile / Web';
}

/**
 * Format verification metadata string for storage in notes
 */
export function formatVerificationTag(meta) {
  const parts = [
    `status:${meta.locationStatus || 'LOCATION_NOT_SHARED'}`,
    `dist:${meta.distanceMeters != null ? meta.distanceMeters : 'unknown'}`,
    `qr:${Boolean(meta.isQrScanned)}`,
    `dev:${meta.deviceInfo || 'Mobile'}`,
    `time:${new Date().toISOString()}`
  ];
  return `[VERIFY|${parts.join('|')}]`;
}

/**
 * Parse verification metadata from order notes or direct properties
 */
export function parseVerificationFromOrder(order) {
  if (!order) return null;

  // Direct fields if already set
  let locationStatus = order.locationStatus;
  let distanceMeters = order.distanceMeters;
  let isQrScanned = order.isQrScanned;
  let deviceInfo = order.deviceInfo;
  let verificationStatus = order.verificationStatus || 'PENDING_VERIFICATION';

  // Check if embedded in notes: [VERIFY|status:...|dist:...|qr:...|dev:...]
  const notes = order.notes || '';
  const match = notes.match(/\[VERIFY\|([^\]]+)\]/);
  if (match) {
    const rawPairs = match[1].split('|');
    rawPairs.forEach(p => {
      const [k, v] = p.split(':');
      if (k === 'status' && !locationStatus) locationStatus = v;
      if (k === 'dist' && distanceMeters == null && v !== 'unknown') distanceMeters = parseInt(v, 10);
      if (k === 'qr' && isQrScanned == null) isQrScanned = v === 'true';
      if (k === 'dev' && !deviceInfo) deviceInfo = v;
    });
  }

  // Format human-friendly distance
  let distanceDisplay = 'Location Not Shared';
  if (distanceMeters != null) {
    if (distanceMeters < 1000) {
      distanceDisplay = `~${distanceMeters} meters away`;
    } else {
      distanceDisplay = `~${(distanceMeters / 1000).toFixed(1)} km away`;
    }
  }

  // Determine presence trust score / label
  let isLikelyFake = false;
  let trustBadge = {
    level: 'warning',
    title: 'Location Not Shared',
    description: 'Customer did not share GPS location. Waiter should visually confirm Table presence.',
    color: 'amber'
  };

  if (locationStatus === 'VERIFIED_AT_RESTAURANT') {
    trustBadge = {
      level: 'verified',
      title: '📍 Verified at Restaurant',
      description: `Customer is physically present at/near the restaurant (${distanceDisplay}).`,
      color: 'emerald'
    };
  } else if (locationStatus === 'SUSPECTED_REMOTE') {
    isLikelyFake = true;
    trustBadge = {
      level: 'danger',
      title: '⚠️ Suspected Remote / Home Order!',
      description: `Customer device is ${distanceDisplay}! They may NOT be seated at Table ${order.tableNumber}.`,
      color: 'red'
    };
  }

  // Clean user notes (removing the [VERIFY|...] tag for display)
  const cleanNotes = notes.replace(/\[VERIFY\|[^\]]+\]\s*/g, '').trim();

  return {
    locationStatus: locationStatus || 'LOCATION_NOT_SHARED',
    distanceMeters,
    distanceDisplay,
    isQrScanned: Boolean(isQrScanned),
    deviceInfo: deviceInfo || 'Web Client',
    verificationStatus,
    isLikelyFake,
    trustBadge,
    cleanNotes
  };
}
