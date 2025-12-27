import storage from "redux-persist/lib/storage"; // defaults to localStorage
import { storageAvailable } from "./storageAvailable";
import { migrateState } from "./migrations";

/**
 * Redux persist configuration for the adventure slice.
 *
 * Configuration:
 * - Uses localStorage for persistence (survives browser close)
 * - Persists the entire adventure reducer
 * - Throttles writes to 1 per second to prevent excessive writes
 * - Version 2: Fixes corrupted themes array (removes empty strings)
 */
const persistConfig = {
  key: "adventure-crafter-root",
  version: 2,
  storage,
  throttle: 1000, // throttle writes to 1 per second
  migrate: migrateState,
};

// Check if localStorage is available and warn if not
if (!storageAvailable("localStorage")) {
  console.warn(
    "localStorage is not available. State will not persist across sessions.",
  );
}

export default persistConfig;
