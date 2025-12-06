import { createSlice } from "@reduxjs/toolkit";
import type { Adventure, TurningPoint } from "../types/Adventure";

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
  themes: ["", "", "", "", ""],
  notes: "",
  turningPoints: [],
};

const initialState: AdventureState = {
  selectedAdventureId: null,
  adventures: [initialAdventure],
};

export const adventureSlice = createSlice({
  name: "adventure",
  initialState,
  reducers: {
    addAdventure: (state, action) => {
      state.adventures.push(action.payload);
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
      state.adventures = state.adventures.filter(
        (adv) => adv.id !== action.payload,
      );
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
} = adventureSlice.actions;

export default adventureSlice.reducer;
