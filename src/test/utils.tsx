import { render, type RenderOptions } from "@testing-library/react";
import { configureStore, type EnhancedStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import adventureReducer from "../slices/adventureSlice";

type RootState = {
  adventure: ReturnType<typeof adventureReducer>;
};

// Define the store type for tests
type TestStore = EnhancedStore<RootState>;

interface ExtendedRenderOptions extends Omit<RenderOptions, "wrapper"> {
  preloadedState?: Partial<RootState>;
  store?: TestStore;
}

/**
 * Sets up localStorage mock for testing.
 * This ensures tests have a clean localStorage environment.
 */
export function setupLocalStorageMock() {
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
      get length() {
        return Object.keys(store).length;
      },
      key: (index: number) => {
        const keys = Object.keys(store);
        return keys[index] || null;
      },
    };
  })();

  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
    writable: true,
  });

  return localStorageMock;
}

export function renderWithProviders(
  ui: React.ReactElement,
  extendedRenderOptions: ExtendedRenderOptions = {},
) {
  const {
    preloadedState,
    store = configureStore({
      reducer: { adventure: adventureReducer },
      ...(preloadedState && { preloadedState: preloadedState as RootState }),
    }) as TestStore,
    ...renderOptions
  } = extendedRenderOptions;

  // Clear localStorage before each render to ensure test isolation
  if (typeof window !== "undefined" && window.localStorage) {
    window.localStorage.clear();
  }

  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// Re-export everything from Testing Library
export * from "@testing-library/react";
export { userEvent } from "@testing-library/user-event";
