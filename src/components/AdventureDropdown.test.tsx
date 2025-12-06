import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders, userEvent } from "../test/utils";
import { AdventureDropdown } from "./AdventureDropdown";
import type { Adventure } from "../types/Adventure";

// Helper function to create mock adventures
function createMockAdventure(overrides?: Partial<Adventure>): Adventure {
  return {
    id: 1,
    title: "Test Adventure",
    description: "",
    characters: [],
    plotLines: [],
    themes: ["", "", "", "", ""],
    notes: "",
    turningPoints: [],
    ...overrides,
  };
}

// Helper function to render dropdown with specific state
function renderDropdown(
  adventures: Adventure[],
  selectedId: number | null = null,
) {
  const preloadedState = {
    adventure: {
      adventures,
      selectedAdventureId: selectedId,
    },
  };

  return renderWithProviders(<AdventureDropdown />, { preloadedState });
}

describe("AdventureDropdown", () => {
  describe("Rendering", () => {
    it("should render without crashing", () => {
      const { container } = renderDropdown([]);
      expect(container).toBeTruthy();
    });

    it('should display "Select Adventure" by default', () => {
      renderDropdown([createMockAdventure()]);
      expect(screen.getByText("Select Adventure")).toBeInTheDocument();
    });

    it("should render all adventures", async () => {
      const adventures = [
        createMockAdventure({ id: 1, title: "Quest 1" }),
        createMockAdventure({ id: 2, title: "Quest 2" }),
      ];

      renderDropdown(adventures);

      // Open dropdown
      const dropdownButton = screen.getByRole("button");
      await userEvent.click(dropdownButton);

      // Verify items appear
      expect(await screen.findByText("Quest 1")).toBeInTheDocument();
      expect(screen.getByText("Quest 2")).toBeInTheDocument();
    });

    it('should show "Untitled Adventure" for empty titles', async () => {
      const adventures = [createMockAdventure({ id: 1, title: "" })];
      renderDropdown(adventures);

      const dropdownButton = screen.getByRole("button");
      await userEvent.click(dropdownButton);

      expect(
        await screen.findByText("Untitled Adventure"),
      ).toBeInTheDocument();
    });
  });

  describe("State Selection", () => {
    it("should display selected adventure title", () => {
      const adventures = [createMockAdventure({ id: 1, title: "My Quest" })];
      renderDropdown(adventures, 1);

      expect(screen.getByText("My Quest")).toBeInTheDocument();
    });

    it('should fall back to "Select Adventure" when null', () => {
      const adventures = [createMockAdventure({ id: 1, title: "Quest" })];
      renderDropdown(adventures, null);

      expect(screen.getByText("Select Adventure")).toBeInTheDocument();
    });

    it("should handle empty title in selected adventure", () => {
      const adventures = [createMockAdventure({ id: 1, title: "" })];
      renderDropdown(adventures, 1);

      expect(screen.getByText("Untitled Adventure")).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("should dispatch setSelectedAdventure on click", async () => {
      const adventures = [createMockAdventure({ id: 2, title: "Quest 1" })];
      const { store } = renderDropdown(adventures);

      const dropdownButton = screen.getByRole("button");
      await userEvent.click(dropdownButton);

      const item = await screen.findByText("Quest 1");
      await userEvent.click(item);

      expect(store.getState().adventure.selectedAdventureId).toBe(2);
    });

    it("should dispatch with correct adventure ID", async () => {
      const adventures = [createMockAdventure({ id: 5, title: "Quest 5" })];
      const { store } = renderDropdown(adventures);

      const dropdownButton = screen.getByRole("button");
      await userEvent.click(dropdownButton);

      const item = await screen.findByText("Quest 5");
      await userEvent.click(item);

      expect(store.getState().adventure.selectedAdventureId).toBe(5);
    });

    it("should allow selecting different adventures", async () => {
      const adventures = [
        createMockAdventure({ id: 1, title: "Quest 1" }),
        createMockAdventure({ id: 2, title: "Quest 2" }),
      ];
      const { store } = renderDropdown(adventures);

      const dropdownButton = screen.getByRole("button");

      // Select first adventure
      await userEvent.click(dropdownButton);
      const item1 = await screen.findByText("Quest 1");
      await userEvent.click(item1);
      expect(store.getState().adventure.selectedAdventureId).toBe(1);

      // Select second adventure
      await userEvent.click(dropdownButton);
      const item2 = await screen.findByText("Quest 2");
      await userEvent.click(item2);
      expect(store.getState().adventure.selectedAdventureId).toBe(2);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty adventures array", () => {
      renderDropdown([]);
      expect(screen.getByText("Select Adventure")).toBeInTheDocument();
    });

    it("should handle single adventure", async () => {
      const adventures = [createMockAdventure({ id: 1, title: "Solo Quest" })];
      renderDropdown(adventures);

      const dropdownButton = screen.getByRole("button");
      await userEvent.click(dropdownButton);

      expect(await screen.findByText("Solo Quest")).toBeInTheDocument();
    });

    it("should handle many adventures", async () => {
      const adventures = Array.from({ length: 10 }, (_, i) =>
        createMockAdventure({ id: i + 1, title: `Quest ${i + 1}` }),
      );
      renderDropdown(adventures);

      const dropdownButton = screen.getByRole("button");
      await userEvent.click(dropdownButton);

      // Verify first and last
      expect(await screen.findByText("Quest 1")).toBeInTheDocument();
      expect(screen.getByText("Quest 10")).toBeInTheDocument();
    });
  });
});
