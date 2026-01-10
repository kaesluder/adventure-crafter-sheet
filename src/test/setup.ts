import { afterEach, beforeEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { setupLocalStorageMock } from "./utils";

// Setup localStorage mock before each test
beforeEach(() => {
  setupLocalStorageMock();
});

// Cleanup after each test
afterEach(() => {
  cleanup();
});
