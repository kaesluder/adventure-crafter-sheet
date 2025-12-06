import { createSlice } from "@reduxjs/toolkit";
import type { Adventure, TurningPoint } from "../types/Adenture";

interface AdventureState {
  adventures: Adventure[];
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
  adventures: [initialAdventure],
};

export const adventureSlice = createSlice({
  name: "adventure",
  initialState,
  reducers: {
    addAdventure: (state, action) => {
      state.adventures.push(action.payload);
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
  },
});

export const {
  addAdventure,
  updateAdventure,
  deleteAdventure,
  addTurningPoint,
} = adventureSlice.actions;

export default adventureSlice.reducer;
