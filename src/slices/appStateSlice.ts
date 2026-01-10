import { createSlice } from "@reduxjs/toolkit";

interface AppState {
  turningPointEdit: boolean;
  selectedTurningPointId: number | null;
}

const initialState: AppState = {
  turningPointEdit: false,
  selectedTurningPointId: null,
};

const appStateSlice = createSlice({
  name: "appState",
  initialState,
  reducers: {
    setTurningPointEdit: (state, action) => {
      state.turningPointEdit = action.payload;
    },
    setSelectedTurningPointId: (state, action) => {
      state.selectedTurningPointId = action.payload;
    },
  },
});

export const { setTurningPointEdit, setSelectedTurningPointId } = appStateSlice.actions;
export default appStateSlice.reducer;
