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
 * Example migration for future use:
 * Uncomment and modify when Adventure type schema changes
 *
 * function migrateV1toV2(state: any): any {
 *   // Example: Adding a new field to adventures
 *   if (state.adventure?.adventures) {
 *     state.adventure.adventures = state.adventure.adventures.map((adv: any) => ({
 *       ...adv,
 *       newField: defaultValue,
 *     }));
 *   }
 *   return state;
 * }
 */

/**
 * Apply all necessary migrations based on stored version
 *
 * @param state - The persisted state to migrate
 * @returns The migrated state
 */
export function migrateState(state: unknown): unknown {
  const persistedVersion =
    (state as PersistedState)?._persist?.version || 0;

  let migratedState = state;

  // Apply migrations sequentially
  if (persistedVersion < 1) {
    migratedState = migrateV0toV1(migratedState);
  }

  // Future migrations go here
  // if (persistedVersion < 2) {
  //   migratedState = migrateV1toV2(migratedState);
  // }

  return migratedState;
}
