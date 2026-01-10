import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// Setup localStorage mock for all tests
import { setupLocalStorageMock } from "./utils";

// Setup localStorage mock for all tests
setupLocalStorageMock();

// Cleanup after each test
afterEach(() => {
  cleanup();
});
