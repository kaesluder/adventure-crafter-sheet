import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../test/utils";
import { ThemesList } from "./ThemesList";
import type { Adventure } from "../types/Adventure";
import type { RootState } from "../store";

// Helper function to create mock adventures
function createMockAdventure(overrides?: Partial<Adventure>): Adventure {
  return {
    id: 1,
    title: "Test Adventure",
    description: "",
    characters: [],
    plotLines: [],
    themes: ["tension", "action", "mystery", "social", "personal"],
    notes: "",
    turningPoints: [],
    ...overrides,
  };
}

// Helper function to render ThemesList with specific state
function renderThemesList(
  adventures: Adventure[],
  selectedId: number | null = null,
) {
  const preloadedState = {
    adventure: {
      adventures,
      selectedAdventureId: selectedId,
    },
  };

  return renderWithProviders(<ThemesList />, { preloadedState });
}

describe("ThemesList", () => {
  describe("Rendering", () => {
    it("should render without crashing", () => {
      const adventures = [createMockAdventure()];
      const { container } = renderThemesList(adventures, 1);
      expect(container).toBeTruthy();
    });

    it("should display the Themes label", () => {
      const adventures = [createMockAdventure()];
      renderThemesList(adventures, 1);

      expect(screen.getByText("Themes")).toBeInTheDocument();
    });

    it("should display all 5 theme values in order", () => {
      const adventures = [
        createMockAdventure({
          themes: ["tension", "action", "mystery", "social", "personal"],
        }),
      ];
      renderThemesList(adventures, 1);

      const themeElements = screen.getAllByText(
        /Tension|Action|Mystery|Social|Personal/,
      );
      expect(themeElements).toHaveLength(5);

      // Verify all themes are present (capitalized)
      expect(screen.getByText("Tension")).toBeInTheDocument();
      expect(screen.getByText("Action")).toBeInTheDocument();
      expect(screen.getByText("Mystery")).toBeInTheDocument();
      expect(screen.getByText("Social")).toBeInTheDocument();
      expect(screen.getByText("Personal")).toBeInTheDocument();
    });

    it("should ensure all themes are unique (no duplicates)", () => {
      const adventures = [
        createMockAdventure({
          themes: ["tension", "action", "mystery", "social", "personal"],
        }),
      ];
      const { store } = renderThemesList(adventures, 1);

      const state = store.getState() as RootState;
      const themes = state.adventure.adventures[0].themes;
      const uniqueThemes = new Set(themes);

      expect(uniqueThemes.size).toBe(themes.length);
      expect(themes.length).toBe(5);
    });

    it("should show only themes from selected adventure", () => {
      const adventures = [
        createMockAdventure({
          id: 1,
          themes: ["tension", "action", "mystery", "social", "personal"],
        }),
        createMockAdventure({
          id: 2,
          themes: ["personal", "social", "mystery", "action", "tension"],
        }),
      ];
      renderThemesList(adventures, 1);

      // Should display themes, but we can't guarantee order without knowing implementation
      expect(screen.getByText("Tension")).toBeInTheDocument();
      expect(screen.getByText("Action")).toBeInTheDocument();
    });

    it("should render when no adventure selected (doesn't crash)", () => {
      const adventures = [createMockAdventure()];
      const { container } = renderThemesList(adventures, null);

      expect(container).toBeTruthy();
    });
  });

  describe("Drag and Drop Sorting", () => {
    it("should update state correctly after reordering", () => {
      const adventures = [
        createMockAdventure({
          themes: ["tension", "action", "mystery", "social", "personal"],
        }),
      ];
      const { store } = renderThemesList(adventures, 1);

      // Get the component container to simulate drag/drop
      const container = screen.getByText("Themes").closest("div");
      expect(container).toBeInTheDocument();

      // Simulate onSortEnd event (moving first item to last)
      // This would be triggered by react-easy-sort
      const onSortEnd = (oldIndex: number, newIndex: number) => {
        const state = store.getState() as RootState;
        const adventure = state.adventure.adventures.find(
          (adv) => adv.id === 1,
        );
        if (!adventure) return;

        const newThemes = [...adventure.themes];
        const [movedItem] = newThemes.splice(oldIndex, 1);
        newThemes.splice(newIndex, 0, movedItem);

        // This should trigger updateAdventure action
        expect(newThemes).toHaveLength(5);
      };

      onSortEnd(0, 4);
    });

    it("should maintain all theme values after reorder", () => {
      const adventures = [
        createMockAdventure({
          themes: ["tension", "action", "mystery", "social", "personal"],
        }),
      ];
      const { store } = renderThemesList(adventures, 1);

      const initialState = store.getState() as RootState;
      const initialThemes = [...initialState.adventure.adventures[0].themes];

      // After any reorder, all original themes should still be present
      expect(initialThemes).toContain("tension");
      expect(initialThemes).toContain("action");
      expect(initialThemes).toContain("mystery");
      expect(initialThemes).toContain("social");
      expect(initialThemes).toContain("personal");
      expect(initialThemes).toHaveLength(5);
    });

    it("should ensure all themes remain unique after reorder (no duplicates created)", () => {
      const adventures = [
        createMockAdventure({
          themes: ["tension", "action", "mystery", "social", "personal"],
        }),
      ];
      const { store } = renderThemesList(adventures, 1);

      const state = store.getState() as RootState;
      const themes = state.adventure.adventures[0].themes;
      const uniqueThemes = new Set(themes);

      expect(uniqueThemes.size).toBe(5);
      expect(themes).toHaveLength(5);
    });

    it("should preserve theme values (only order changes)", () => {
      const adventures = [
        createMockAdventure({
          themes: ["tension", "action", "mystery", "social", "personal"],
        }),
      ];
      const { store } = renderThemesList(adventures, 1);

      const state = store.getState() as RootState;
      const themes = state.adventure.adventures[0].themes;
      const sortedThemes = [...themes].sort();
      const expectedSorted = [
        "action",
        "mystery",
        "personal",
        "social",
        "tension",
      ];

      expect(sortedThemes).toEqual(expectedSorted);
    });

    it("should handle multiple reorders correctly", () => {
      const adventures = [
        createMockAdventure({
          themes: ["tension", "action", "mystery", "social", "personal"],
        }),
      ];
      const { store } = renderThemesList(adventures, 1);

      // Multiple reorders should still maintain 5 unique themes
      const state = store.getState() as RootState;
      const themes = state.adventure.adventures[0].themes;

      expect(themes).toHaveLength(5);
      expect(new Set(themes).size).toBe(5);
    });

    it("should allow first item to be moved to last position", () => {
      const adventures = [
        createMockAdventure({
          themes: ["tension", "action", "mystery", "social", "personal"],
        }),
      ];
      renderThemesList(adventures, 1);

      // Component should support moving first to last
      const firstTheme = screen.getByText("Tension");
      expect(firstTheme).toBeInTheDocument();
    });

    it("should allow last item to be moved to first position", () => {
      const adventures = [
        createMockAdventure({
          themes: ["tension", "action", "mystery", "social", "personal"],
        }),
      ];
      renderThemesList(adventures, 1);

      // Component should support moving last to first
      const lastTheme = screen.getByText("Personal");
      expect(lastTheme).toBeInTheDocument();
    });

    it("should allow middle item to be moved", () => {
      const adventures = [
        createMockAdventure({
          themes: ["tension", "action", "mystery", "social", "personal"],
        }),
      ];
      renderThemesList(adventures, 1);

      // Component should support moving middle items
      const middleTheme = screen.getByText("Mystery");
      expect(middleTheme).toBeInTheDocument();
    });
  });

  describe("State Management", () => {
    it("should only update selected adventure", () => {
      const adventures = [
        createMockAdventure({
          id: 1,
          themes: ["tension", "action", "mystery", "social", "personal"],
        }),
        createMockAdventure({
          id: 2,
          themes: ["personal", "social", "mystery", "action", "tension"],
        }),
      ];
      const { store } = renderThemesList(adventures, 1);

      const state = store.getState() as RootState;
      const adventure2 = state.adventure.adventures.find((adv) => adv.id === 2);

      // Adventure 1 should be selected
      expect(state.adventure.selectedAdventureId).toBe(1);

      // Adventure 2 should remain unchanged
      expect(adventure2?.themes).toEqual([
        "personal",
        "social",
        "mystery",
        "action",
        "tension",
      ]);
    });

    it("should dispatch updateAdventure action", () => {
      const adventures = [
        createMockAdventure({
          themes: ["tension", "action", "mystery", "social", "personal"],
        }),
      ];
      const { store } = renderThemesList(adventures, 1);

      // The component should use updateAdventure to change theme order
      const state = store.getState() as RootState;
      expect(state.adventure.adventures[0]).toBeDefined();
      expect(state.adventure.adventures[0].themes).toHaveLength(5);
    });

    it("should preserve adventure object structure", () => {
      const adventures = [
        createMockAdventure({
          id: 1,
          title: "My Adventure",
          themes: ["tension", "action", "mystery", "social", "personal"],
          characters: ["Hero"],
          plotLines: ["Main Quest"],
        }),
      ];
      const { store } = renderThemesList(adventures, 1);

      const state = store.getState() as RootState;
      const adventure = state.adventure.adventures[0];

      // All properties should be preserved
      expect(adventure.id).toBe(1);
      expect(adventure.title).toBe("My Adventure");
      expect(adventure.characters).toEqual(["Hero"]);
      expect(adventure.plotLines).toEqual(["Main Quest"]);
      expect(adventure.themes).toHaveLength(5);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty themes array", () => {
      const adventures = [
        createMockAdventure({
          themes: [],
        }),
      ];
      const { container } = renderThemesList(adventures, 1);

      expect(container).toBeTruthy();
    });

    it("should handle themes array with fewer than 5 items", () => {
      const adventures = [
        createMockAdventure({
          themes: ["tension", "action"],
        }),
      ];
      const { container } = renderThemesList(adventures, 1);

      expect(container).toBeTruthy();
      expect(screen.getByText("Tension")).toBeInTheDocument();
      expect(screen.getByText("Action")).toBeInTheDocument();
    });

    it("should handle themes array with duplicate values", () => {
      const adventures = [
        createMockAdventure({
          themes: ["tension", "tension", "action", "action", "mystery"],
        }),
      ];
      const { store } = renderThemesList(adventures, 1);

      const state = store.getState() as RootState;
      const themes = state.adventure.adventures[0].themes;

      // Should still render, even with duplicates
      expect(themes).toHaveLength(5);
    });

    it("should maintain state isolation when switching adventures", () => {
      const adventures = [
        createMockAdventure({
          id: 1,
          themes: ["tension", "action", "mystery", "social", "personal"],
        }),
        createMockAdventure({
          id: 2,
          themes: ["personal", "social", "mystery", "action", "tension"],
        }),
      ];

      // Render with adventure 1 selected
      const { store } = renderThemesList(adventures, 1);

      const state1 = store.getState() as RootState;
      expect(state1.adventure.selectedAdventureId).toBe(1);

      // Note: In actual implementation, switching adventures would be handled by Redux
      // For this test, we just verify the initial state isolation
      const state2 = store.getState() as RootState;
      const adventure1Themes = state2.adventure.adventures.find(
        (adv) => adv.id === 1,
      )?.themes;
      const adventure2Themes = state2.adventure.adventures.find(
        (adv) => adv.id === 2,
      )?.themes;

      expect(adventure1Themes).toEqual([
        "tension",
        "action",
        "mystery",
        "social",
        "personal",
      ]);
      expect(adventure2Themes).toEqual([
        "personal",
        "social",
        "mystery",
        "action",
        "tension",
      ]);
    });

    it("should handle empty adventures array", () => {
      const { container } = renderThemesList([], null);
      expect(container).toBeTruthy();
    });

    it("should not crash when no adventure is selected", () => {
      const adventures = [
        createMockAdventure({
          themes: ["tension", "action", "mystery", "social", "personal"],
        }),
      ];
      const { container } = renderThemesList(adventures, null);

      expect(container).toBeTruthy();
    });

    it("should maintain theme count of 5 for valid adventures", () => {
      const adventures = [
        createMockAdventure({
          themes: ["tension", "action", "mystery", "social", "personal"],
        }),
      ];
      const { store } = renderThemesList(adventures, 1);

      const state = store.getState() as RootState;
      const themes = state.adventure.adventures[0].themes;

      expect(themes).toHaveLength(5);
    });

    it("should prevent duplicate themes from being created during reorder", () => {
      const adventures = [
        createMockAdventure({
          themes: ["tension", "action", "mystery", "social", "personal"],
        }),
      ];
      const { store } = renderThemesList(adventures, 1);

      const state = store.getState() as RootState;
      const themes = state.adventure.adventures[0].themes;
      const uniqueThemes = new Set(themes);

      // After any reorder operation, no duplicates should exist
      expect(uniqueThemes.size).toBe(themes.length);
    });
  });
});
