import { render, type RenderOptions } from "@testing-library/react";
import { configureStore, type PreloadedState } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import adventureReducer from "../slices/adventureSlice";

interface ExtendedRenderOptions extends Omit<RenderOptions, "wrapper"> {
  preloadedState?: PreloadedState<RootState>;
  store?: ReturnType<typeof configureStore>;
}

type RootState = {
  adventure: ReturnType<typeof adventureReducer>;
};

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = configureStore({
      reducer: { adventure: adventureReducer },
      preloadedState,
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// Re-export everything from Testing Library
export * from "@testing-library/react";
export { userEvent } from "@testing-library/user-event";
