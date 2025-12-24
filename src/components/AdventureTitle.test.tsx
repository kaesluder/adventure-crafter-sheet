import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders, userEvent } from "../test/utils";
import { AdventureTitle } from "./AdventureTitle";
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

// Helper function to render AdventureTitle with specific state
function renderAdventureTitle(
  adventures: Adventure[],
  selectedId: number | null = null,
) {
  const preloadedState = {
    adventure: {
      adventures,
      selectedAdventureId: selectedId,
    },
  };

  return renderWithProviders(<AdventureTitle />, { preloadedState });
}

describe("AdventureTitle", () => {
  describe("Rendering", () => {
    it("should render without crashing", () => {
      const { container } = renderAdventureTitle([]);
      expect(container).toBeTruthy();
    });

    it("should display the label", () => {
      const adventures = [createMockAdventure()];
      const { container } = renderAdventureTitle(adventures, 1);

      // Label component is present via data-testid
      const label = container.querySelector('[data-testid="flowbite-label"]');
      expect(label).toBeInTheDocument();
      expect(label).toHaveAttribute("for", "adventure-title");
    });

    it("should display the text input field", () => {
      const adventures = [createMockAdventure()];
      renderAdventureTitle(adventures, 1);

      expect(
        screen.getByPlaceholderText("Enter adventure title"),
      ).toBeInTheDocument();
    });

    it("should display current adventure title in input", () => {
      const adventures = [
        createMockAdventure({ id: 1, title: "My Epic Quest" }),
      ];
      renderAdventureTitle(adventures, 1);

      const input = screen.getByPlaceholderText(
        "Enter adventure title",
      ) as HTMLInputElement;
      expect(input.value).toBe("My Epic Quest");
    });

    it("should display empty string for adventure with empty title", () => {
      const adventures = [createMockAdventure({ id: 1, title: "" })];
      renderAdventureTitle(adventures, 1);

      const input = screen.getByPlaceholderText(
        "Enter adventure title",
      ) as HTMLInputElement;
      expect(input.value).toBe("");
    });
  });

  describe("No Selected Adventure", () => {
    it("should render when no adventure is selected", () => {
      const adventures = [createMockAdventure()];
      renderAdventureTitle(adventures, null);

      expect(
        screen.getByPlaceholderText("Enter adventure title"),
      ).toBeInTheDocument();
    });

    it("should display empty input when no adventure selected", () => {
      const adventures = [
        createMockAdventure({ id: 1, title: "My Adventure" }),
      ];
      renderAdventureTitle(adventures, null);

      const input = screen.getByPlaceholderText(
        "Enter adventure title",
      ) as HTMLInputElement;
      expect(input.value).toBe("");
    });

    it("should disable input when no adventure is selected", () => {
      const adventures = [createMockAdventure()];
      renderAdventureTitle(adventures, null);

      const input = screen.getByPlaceholderText("Enter adventure title");
      expect(input).toBeDisabled();
    });

    it("should not update state when typing with no adventure selected", async () => {
      const adventures = [createMockAdventure({ id: 1 })];
      const { store } = renderAdventureTitle(adventures, null);

      const input = screen.getByPlaceholderText("Enter adventure title");

      // Input is disabled, so userEvent.type should not work
      await userEvent.type(input, "New Title");

      // Title should remain unchanged
      expect(store.getState().adventure.adventures[0].title).toBe(
        "Test Adventure",
      );
    });
  });

  describe("Updating Title", () => {
    it("should update title when user types", async () => {
      const adventures = [createMockAdventure({ id: 1, title: "" })];
      const { store } = renderAdventureTitle(adventures, 1);

      const input = screen.getByPlaceholderText("Enter adventure title");

      await userEvent.clear(input);
      await userEvent.type(input, "New Adventure");

      const updatedAdventure = store
        .getState()
        .adventure.adventures.find((adv) => adv.id === 1);
      expect(updatedAdventure?.title).toBe("New Adventure");
    });

    it("should update title in real-time on each keystroke", async () => {
      const adventures = [createMockAdventure({ id: 1, title: "" })];
      const { store } = renderAdventureTitle(adventures, 1);

      const input = screen.getByPlaceholderText("Enter adventure title");

      await userEvent.clear(input);
      await userEvent.type(input, "A");

      let updatedAdventure = store
        .getState()
        .adventure.adventures.find((adv) => adv.id === 1);
      expect(updatedAdventure?.title).toBe("A");

      await userEvent.type(input, "B");

      updatedAdventure = store
        .getState()
        .adventure.adventures.find((adv) => adv.id === 1);
      expect(updatedAdventure?.title).toBe("AB");
    });

    it("should replace existing title when updated", async () => {
      const adventures = [
        createMockAdventure({ id: 1, title: "Old Title" }),
      ];
      const { store } = renderAdventureTitle(adventures, 1);

      const input = screen.getByPlaceholderText("Enter adventure title");

      await userEvent.clear(input);
      await userEvent.type(input, "New Title");

      const updatedAdventure = store
        .getState()
        .adventure.adventures.find((adv) => adv.id === 1);
      expect(updatedAdventure?.title).toBe("New Title");
    });

    it("should allow empty title", async () => {
      const adventures = [
        createMockAdventure({ id: 1, title: "Some Title" }),
      ];
      const { store } = renderAdventureTitle(adventures, 1);

      const input = screen.getByPlaceholderText("Enter adventure title");

      await userEvent.clear(input);

      const updatedAdventure = store
        .getState()
        .adventure.adventures.find((adv) => adv.id === 1);
      expect(updatedAdventure?.title).toBe("");
    });

    it("should reflect input value as user types", async () => {
      const adventures = [createMockAdventure({ id: 1, title: "" })];
      renderAdventureTitle(adventures, 1);

      const input = screen.getByPlaceholderText(
        "Enter adventure title",
      ) as HTMLInputElement;

      await userEvent.type(input, "My Quest");

      expect(input.value).toBe("My Quest");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty adventures array", () => {
      const { container } = renderAdventureTitle([], null);
      expect(container).toBeTruthy();

      const input = screen.getByPlaceholderText("Enter adventure title");
      expect(input).toBeDisabled();
    });

    it("should handle special characters in title", async () => {
      const adventures = [createMockAdventure({ id: 1, title: "" })];
      const { store } = renderAdventureTitle(adventures, 1);

      const input = screen.getByPlaceholderText("Enter adventure title");

      await userEvent.type(input, "Quest #1: The @Beginning!");

      const updatedAdventure = store
        .getState()
        .adventure.adventures.find((adv) => adv.id === 1);
      expect(updatedAdventure?.title).toBe("Quest #1: The @Beginning!");
    });

    it("should handle very long titles", async () => {
      const adventures = [createMockAdventure({ id: 1, title: "" })];
      const { store } = renderAdventureTitle(adventures, 1);

      const input = screen.getByPlaceholderText("Enter adventure title");

      const longTitle = "A".repeat(200);
      await userEvent.type(input, longTitle);

      const updatedAdventure = store
        .getState()
        .adventure.adventures.find((adv) => adv.id === 1);
      expect(updatedAdventure?.title).toBe(longTitle);
    });

    it("should handle Unicode characters", async () => {
      const adventures = [createMockAdventure({ id: 1, title: "" })];
      const { store } = renderAdventureTitle(adventures, 1);

      const input = screen.getByPlaceholderText("Enter adventure title");

      await userEvent.type(input, "冒険 🎮 Приключение");

      const updatedAdventure = store
        .getState()
        .adventure.adventures.find((adv) => adv.id === 1);
      expect(updatedAdventure?.title).toBe("冒険 🎮 Приключение");
    });

    it("should preserve other adventure properties when updating title", async () => {
      const adventures = [
        createMockAdventure({
          id: 1,
          title: "Old Title",
          description: "My Description",
          characters: ["Hero"],
          plotLines: ["Main Quest"],
        }),
      ];
      const { store } = renderAdventureTitle(adventures, 1);

      const input = screen.getByPlaceholderText("Enter adventure title");

      await userEvent.clear(input);
      await userEvent.type(input, "New Title");

      const updatedAdventure = store
        .getState()
        .adventure.adventures.find((adv) => adv.id === 1);
      expect(updatedAdventure?.title).toBe("New Title");
      expect(updatedAdventure?.description).toBe("My Description");
      expect(updatedAdventure?.characters).toEqual(["Hero"]);
      expect(updatedAdventure?.plotLines).toEqual(["Main Quest"]);
    });
  });

  describe("Multiple Adventures", () => {
    it("should only update the selected adventure", async () => {
      const adventures = [
        createMockAdventure({ id: 1, title: "Adventure 1" }),
        createMockAdventure({ id: 2, title: "Adventure 2" }),
      ];
      const { store } = renderAdventureTitle(adventures, 1);

      const input = screen.getByPlaceholderText("Enter adventure title");

      await userEvent.clear(input);
      await userEvent.type(input, "Updated Title");

      const state = store.getState();
      const adventure1 = state.adventure.adventures.find((adv) => adv.id === 1);
      const adventure2 = state.adventure.adventures.find((adv) => adv.id === 2);

      expect(adventure1?.title).toBe("Updated Title");
      expect(adventure2?.title).toBe("Adventure 2");
    });

    it("should display correct title when adventure is selected", () => {
      const adventures = [
        createMockAdventure({ id: 1, title: "First Adventure" }),
        createMockAdventure({ id: 2, title: "Second Adventure" }),
      ];

      // Render with adventure 1 selected
      const { unmount: unmount1 } = renderAdventureTitle(adventures, 1);

      let input = screen.getByPlaceholderText(
        "Enter adventure title",
      ) as HTMLInputElement;
      expect(input.value).toBe("First Adventure");

      unmount1();

      // Render with adventure 2 selected
      renderAdventureTitle(adventures, 2);

      input = screen.getByPlaceholderText(
        "Enter adventure title",
      ) as HTMLInputElement;
      expect(input.value).toBe("Second Adventure");
    });
  });
});
