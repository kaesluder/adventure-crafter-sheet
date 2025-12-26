import { createSlice } from "@reduxjs/toolkit";
import type { Adventure } from "../types/Adventure";

interface AdventureState {
  adventures: Adventure[];
  selectedAdventureId: number | null;
}

const initialAdventure: Adventure = {
  id: 1,
  title: "",
  description: "",
  characters: [],
  plotLines: [],
  themes: ["tension", "action", "mystery", "social", "personal"],
  notes: "",
  turningPoints: [],
};

const initialState: AdventureState = {
  selectedAdventureId: 1,
  adventures: [initialAdventure],
};

const generateNewAdventure = (state: AdventureState): Adventure => {
  const newId = Math.max(0, ...state.adventures.map((adv) => adv.id)) + 1;
  return {
    id: newId,
    title: "",
    description: "",
    characters: [],
    plotLines: [],
    themes: ["tension", "action", "mystery", "social", "personal"],
    notes: "",
    turningPoints: [],
  };
};

export const adventureSlice = createSlice({
  name: "adventure",
  initialState,
  reducers: {
    addAdventure: (state, action) => {
      state.adventures.push(action.payload);
    },
    newAdventure: (state) => {
      const adventure = generateNewAdventure(state);
      state.adventures.push(adventure);
      state.selectedAdventureId = adventure.id;
    },
    setSelectedAdventure: (state, action) => {
      state.selectedAdventureId = action.payload;
    },
    updateAdventure: (state, action) => {
      const index = state.adventures.findIndex(
        (adv) => adv.id === action.payload.id,
      );
      if (index !== -1) {
        state.adventures[index] = action.payload;
      }
    },
    deleteAdventure: (state, action) => {
      const adventureToDelete = action.payload;
      const adventureExists = state.adventures.some(
        (adv) => adv.id === adventureToDelete,
      );

      // If adventure doesn't exist, don't modify state
      if (!adventureExists) {
        return;
      }

      const isLastAdventure = state.adventures.length === 1;
      const isDeletingSelected =
        state.selectedAdventureId === adventureToDelete;

      // If deleting the last adventure, generate new one before removing
      let newAdventure: Adventure | null = null;
      if (isLastAdventure) {
        newAdventure = generateNewAdventure(state);
      }

      // Remove the adventure
      state.adventures = state.adventures.filter(
        (adv) => adv.id !== adventureToDelete,
      );

      // Handle edge cases
      if (isLastAdventure && newAdventure) {
        // Add the new adventure that was generated before deletion
        state.adventures.push(newAdventure);
        state.selectedAdventureId = newAdventure.id;
      } else if (isDeletingSelected) {
        // Select the next adventure (first one in the remaining list)
        state.selectedAdventureId =
          state.adventures.length > 0 ? state.adventures[0].id : null;
      }
      // If deleting non-selected adventure, keep selectedAdventureId unchanged
    },
    addTurningPoint: (state, action) => {
      const { adventureId, turningPoint } = action.payload;
      const adventure = state.adventures.find((adv) => adv.id === adventureId);
      if (adventure) {
        adventure.turningPoints.push(turningPoint);
      }
    },
    updateTurningPoint: (state, action) => {
      const { adventureId, turningPointId, turningPoint } = action.payload;
      const adventure = state.adventures.find((adv) => adv.id === adventureId);
      if (adventure) {
        const tpIndex = adventure.turningPoints.findIndex(
          (tp) => tp.id === turningPointId,
        );
        if (tpIndex !== -1) {
          adventure.turningPoints[tpIndex] = turningPoint;
        }
      }
    },
  },
});

export const {
  addAdventure,
  setSelectedAdventure,
  updateAdventure,
  deleteAdventure,
  addTurningPoint,
  updateTurningPoint,
  newAdventure,
} = adventureSlice.actions;

export default adventureSlice.reducer;
