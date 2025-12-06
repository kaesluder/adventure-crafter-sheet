import { configureStore } from "@reduxjs/toolkit";
import adventureReducer from "./slices/adventureSlice";

const store = configureStore({
  reducer: {
    adventure: adventureReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
