import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import adventureReducer from "./slices/adventureSlice";

// Create root reducer
const rootReducer = combineReducers({
  adventure: adventureReducer,
});

// Persist configuration
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  throttle: 1000,
};

// Wrap root reducer with persistence
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store, null, () => {
  console.log("Redux persist: Rehydration complete");
  console.log("Current state:", store.getState());
  console.log(
    "localStorage content:",
    localStorage.getItem("persist:root"),
  );
});

// Debug: Log when state changes
if (import.meta.env.DEV) {
  store.subscribe(() => {
    const state = store.getState();
    console.log("State updated:", state);
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
