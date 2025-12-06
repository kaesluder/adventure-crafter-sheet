import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders, userEvent } from "../test/utils";
import { CharacterList } from "./CharacterList";
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

// Helper function to render CharacterList with specific state
function renderCharacterList(
  adventures: Adventure[],
  selectedId: number | null = null,
) {
  const preloadedState = {
    adventure: {
      adventures,
      selectedAdventureId: selectedId,
    },
  };

  return renderWithProviders(<CharacterList />, { preloadedState });
}

describe("CharacterList", () => {
  describe("Rendering", () => {
    it("should render without crashing", () => {
      const { container } = renderCharacterList([]);
      expect(container).toBeTruthy();
    });

    it("should display the add character input field", () => {
      const adventures = [createMockAdventure()];
      renderCharacterList(adventures, 1);

      expect(
        screen.getByPlaceholderText("Add a new character"),
      ).toBeInTheDocument();
    });

    it("should display the add character button", () => {
      const adventures = [createMockAdventure()];
      renderCharacterList(adventures, 1);

      expect(screen.getByText("Add Character")).toBeInTheDocument();
    });

    it("should display all characters from selected adventure", () => {
      const adventures = [
        createMockAdventure({
          id: 1,
          characters: ["Hero", "Villain", "Sidekick"],
        }),
      ];
      renderCharacterList(adventures, 1);

      expect(screen.getByText("Hero")).toBeInTheDocument();
      expect(screen.getByText("Villain")).toBeInTheDocument();
      expect(screen.getByText("Sidekick")).toBeInTheDocument();
    });

    it("should not display characters from non-selected adventures", () => {
      const adventures = [
        createMockAdventure({ id: 1, characters: ["Hero"] }),
        createMockAdventure({ id: 2, characters: ["Other Hero"] }),
      ];
      renderCharacterList(adventures, 1);

      expect(screen.getByText("Hero")).toBeInTheDocument();
      expect(screen.queryByText("Other Hero")).not.toBeInTheDocument();
    });
  });

  describe("No Selected Adventure", () => {
    it("should render when no adventure is selected", () => {
      const adventures = [createMockAdventure()];
      renderCharacterList(adventures, null);

      expect(
        screen.getByPlaceholderText("Add a new character"),
      ).toBeInTheDocument();
    });

    it("should not display any characters when no adventure selected", () => {
      const adventures = [
        createMockAdventure({ id: 1, characters: ["Hero"] }),
      ];
      renderCharacterList(adventures, null);

      expect(screen.queryByText("Hero")).not.toBeInTheDocument();
    });

    it("should not add character when no adventure is selected", async () => {
      const adventures = [createMockAdventure({ id: 1 })];
      const { store } = renderCharacterList(adventures, null);

      const input = screen.getByPlaceholderText("Add a new character");
      const button = screen.getByText("Add Character");

      await userEvent.type(input, "New Hero");
      await userEvent.click(button);

      // Characters array should still be empty
      expect(store.getState().adventure.adventures[0].characters).toEqual([]);
    });
  });

  describe("Adding Characters", () => {
    it("should add a character when button is clicked", async () => {
      const adventures = [createMockAdventure({ id: 1 })];
      const { store } = renderCharacterList(adventures, 1);

      const input = screen.getByPlaceholderText("Add a new character");
      const button = screen.getByText("Add Character");

      await userEvent.type(input, "New Hero");
      await userEvent.click(button);

      const updatedAdventure = store
        .getState()
        .adventure.adventures.find((adv) => adv.id === 1);
      expect(updatedAdventure?.characters).toContain("New Hero");
    });

    it("should clear input field after adding character", async () => {
      const adventures = [createMockAdventure({ id: 1 })];
      renderCharacterList(adventures, 1);

      const input = screen.getByPlaceholderText(
        "Add a new character",
      ) as HTMLInputElement;
      const button = screen.getByText("Add Character");

      await userEvent.type(input, "New Hero");
      await userEvent.click(button);

      expect(input.value).toBe("");
    });

    it("should add multiple characters sequentially", async () => {
      const adventures = [createMockAdventure({ id: 1 })];
      const { store } = renderCharacterList(adventures, 1);

      const input = screen.getByPlaceholderText("Add a new character");
      const button = screen.getByText("Add Character");

      await userEvent.type(input, "Hero");
      await userEvent.click(button);

      await userEvent.type(input, "Villain");
      await userEvent.click(button);

      await userEvent.type(input, "Sidekick");
      await userEvent.click(button);

      const updatedAdventure = store
        .getState()
        .adventure.adventures.find((adv) => adv.id === 1);
      expect(updatedAdventure?.characters).toEqual([
        "Hero",
        "Villain",
        "Sidekick",
      ]);
    });

    it("should preserve existing characters when adding new ones", async () => {
      const adventures = [
        createMockAdventure({ id: 1, characters: ["Existing Hero"] }),
      ];
      const { store } = renderCharacterList(adventures, 1);

      const input = screen.getByPlaceholderText("Add a new character");
      const button = screen.getByText("Add Character");

      await userEvent.type(input, "New Hero");
      await userEvent.click(button);

      const updatedAdventure = store
        .getState()
        .adventure.adventures.find((adv) => adv.id === 1);
      expect(updatedAdventure?.characters).toEqual([
        "Existing Hero",
        "New Hero",
      ]);
    });

    it("should trim whitespace from character names", async () => {
      const adventures = [createMockAdventure({ id: 1 })];
      const { store } = renderCharacterList(adventures, 1);

      const input = screen.getByPlaceholderText("Add a new character");
      const button = screen.getByText("Add Character");

      await userEvent.type(input, "  Hero with spaces  ");
      await userEvent.click(button);

      const updatedAdventure = store
        .getState()
        .adventure.adventures.find((adv) => adv.id === 1);
      expect(updatedAdventure?.characters).toContain("Hero with spaces");
    });
  });

  describe("Input Validation", () => {
    it("should not add empty character names", async () => {
      const adventures = [createMockAdventure({ id: 1 })];
      const { store } = renderCharacterList(adventures, 1);

      const button = screen.getByText("Add Character");
      await userEvent.click(button);

      const updatedAdventure = store
        .getState()
        .adventure.adventures.find((adv) => adv.id === 1);
      expect(updatedAdventure?.characters).toEqual([]);
    });

    it("should not add whitespace-only character names", async () => {
      const adventures = [createMockAdventure({ id: 1 })];
      const { store } = renderCharacterList(adventures, 1);

      const input = screen.getByPlaceholderText("Add a new character");
      const button = screen.getByText("Add Character");

      await userEvent.type(input, "   ");
      await userEvent.click(button);

      const updatedAdventure = store
        .getState()
        .adventure.adventures.find((adv) => adv.id === 1);
      expect(updatedAdventure?.characters).toEqual([]);
    });

    it("should not add character when input is empty after trim", async () => {
      const adventures = [createMockAdventure({ id: 1 })];
      const { store } = renderCharacterList(adventures, 1);

      const input = screen.getByPlaceholderText("Add a new character");
      const button = screen.getByText("Add Character");

      await userEvent.type(input, "\t\n  \t");
      await userEvent.click(button);

      const updatedAdventure = store
        .getState()
        .adventure.adventures.find((adv) => adv.id === 1);
      expect(updatedAdventure?.characters).toEqual([]);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty adventures array", () => {
      const { container } = renderCharacterList([], null);
      expect(container).toBeTruthy();
    });

    it("should handle adventure with empty characters array", () => {
      const adventures = [createMockAdventure({ id: 1, characters: [] })];
      renderCharacterList(adventures, 1);

      expect(
        screen.getByPlaceholderText("Add a new character"),
      ).toBeInTheDocument();
    });

    it("should update input field value as user types", async () => {
      const adventures = [createMockAdventure({ id: 1 })];
      renderCharacterList(adventures, 1);

      const input = screen.getByPlaceholderText(
        "Add a new character",
      ) as HTMLInputElement;

      await userEvent.type(input, "New Character");

      expect(input.value).toBe("New Character");
    });

    it("should handle special characters in character names", async () => {
      const adventures = [createMockAdventure({ id: 1 })];
      const { store } = renderCharacterList(adventures, 1);

      const input = screen.getByPlaceholderText("Add a new character");
      const button = screen.getByText("Add Character");

      await userEvent.type(input, "Hero-123 (The Great)");
      await userEvent.click(button);

      const updatedAdventure = store
        .getState()
        .adventure.adventures.find((adv) => adv.id === 1);
      expect(updatedAdventure?.characters).toContain("Hero-123 (The Great)");
    });

    it("should handle very long character names", async () => {
      const adventures = [createMockAdventure({ id: 1 })];
      const { store } = renderCharacterList(adventures, 1);

      const input = screen.getByPlaceholderText("Add a new character");
      const button = screen.getByText("Add Character");

      const longName = "A".repeat(200);
      await userEvent.type(input, longName);
      await userEvent.click(button);

      const updatedAdventure = store
        .getState()
        .adventure.adventures.find((adv) => adv.id === 1);
      expect(updatedAdventure?.characters).toContain(longName);
    });

    it("should allow duplicate character names", async () => {
      const adventures = [
        createMockAdventure({ id: 1, characters: ["Hero"] }),
      ];
      const { store } = renderCharacterList(adventures, 1);

      const input = screen.getByPlaceholderText("Add a new character");
      const button = screen.getByText("Add Character");

      await userEvent.type(input, "Hero");
      await userEvent.click(button);

      const updatedAdventure = store
        .getState()
        .adventure.adventures.find((adv) => adv.id === 1);
      expect(updatedAdventure?.characters).toEqual(["Hero", "Hero"]);
    });
  });

  describe("Multiple Adventures", () => {
    it("should only update the selected adventure", async () => {
      const adventures = [
        createMockAdventure({ id: 1, characters: [] }),
        createMockAdventure({ id: 2, characters: ["Other Hero"] }),
      ];
      const { store } = renderCharacterList(adventures, 1);

      const input = screen.getByPlaceholderText("Add a new character");
      const button = screen.getByText("Add Character");

      await userEvent.type(input, "My Hero");
      await userEvent.click(button);

      const state = store.getState();
      const adventure1 = state.adventure.adventures.find((adv) => adv.id === 1);
      const adventure2 = state.adventure.adventures.find((adv) => adv.id === 2);

      expect(adventure1?.characters).toContain("My Hero");
      expect(adventure2?.characters).toEqual(["Other Hero"]);
    });
  });
});
