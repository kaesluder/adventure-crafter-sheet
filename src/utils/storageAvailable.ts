/**
 * Checks if localStorage is available and usable.
 * Handles private browsing mode and SecurityError scenarios.
 *
 * @param type - The type of storage to check ('localStorage' or 'sessionStorage')
 * @returns true if storage is available and usable, false otherwise
 */
export function storageAvailable(
  type: "localStorage" | "sessionStorage",
): boolean {
  try {
    const storage = window[type];
    const testKey = "__storage_test__";
    storage.setItem(testKey, "test");
    storage.removeItem(testKey);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      window[type] !== undefined &&
      window[type].length !== 0
    );
  }
}
