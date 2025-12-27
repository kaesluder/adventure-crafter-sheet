/**
 * State migrations for handling schema changes across versions.
 * Add new migration functions as the state schema evolves.
 *
 * Example usage:
 * When the Adventure type changes (e.g., adding a new field),
 * increment the version in persistConfig and add a migration function here.
 */

export type PersistedState = {
  adventure: unknown; // Will be the AdventureState type
  _persist: {
    version: number;
    rehydrated: boolean;
  };
};

/**
 * Migration from version 0 (no schema) to version 1 (current)
 * This is the baseline version - no migration needed
 */
function migrateV0toV1(state: unknown): unknown {
  return state;
}

/**
 * Migration from version 1 to version 2
 * Fixes corrupted themes array (removes empty strings and invalid values)
 */
function migrateV1toV2(state: any): any {
  const validThemes = ["tension", "action", "mystery", "social", "personal"];

  if (state.adventure?.adventures) {
    state.adventure.adventures = state.adventure.adventures.map((adv: any) => {
      // Filter out empty strings and invalid theme values
      const cleanedThemes = adv.themes?.filter(
        (theme: string) => theme && validThemes.includes(theme)
      ) || [];

      // If themes array is empty or invalid, reset to default
      const themes = cleanedThemes.length === 0
        ? ["tension", "action", "mystery", "social", "personal"]
        : cleanedThemes;

      return {
        ...adv,
        themes,
      };
    });
  }
  return state;
}

/**
 * Apply all necessary migrations based on stored version
 *
 * @param state - The persisted state to migrate
 * @returns Promise resolving to the migrated state
 */
export function migrateState(state: unknown): Promise<PersistedState> {
  const persistedVersion =
    (state as PersistedState)?._persist?.version || 0;

  let migratedState = state;

  // Apply migrations sequentially
  if (persistedVersion < 1) {
    migratedState = migrateV0toV1(migratedState);
  }

  // Apply migration to fix corrupted themes
  if (persistedVersion < 2) {
    migratedState = migrateV1toV2(migratedState);
  }

  return Promise.resolve(migratedState as PersistedState);
}
