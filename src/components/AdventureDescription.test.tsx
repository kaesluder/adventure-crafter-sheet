import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders, userEvent } from "../test/utils";
import { AdventureDescription } from "./AdventureDescription";
import type { Adventure } from "../types/Adventure";

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

// Helper function to render AdventureDescription with specific state
function renderAdventureDescription(
  adventures: Adventure[],
  selectedId: number | null = null,
) {
  const preloadedState = {
    adventure: {
      adventures,
      selectedAdventureId: selectedId,
    },
  };

  return renderWithProviders(<AdventureDescription />, { preloadedState });
}

describe("AdventureDescription", () => {
  describe("Rendering", () => {
    it("should render without crashing", () => {
      const { container } = renderAdventureDescription([]);
      expect(container).toBeTruthy();
    });

    it("should display the label", () => {
      const adventures = [createMockAdventure()];
      const { container } = renderAdventureDescription(adventures, 1);

      // Label component is present via data-testid
      const label = container.querySelector('[data-testid="flowbite-label"]');
      expect(label).toBeInTheDocument();
      expect(label).toHaveAttribute("for", "adventure-description");
    });

    it("should display the textarea field", () => {
      const adventures = [createMockAdventure()];
      renderAdventureDescription(adventures, 1);

      expect(
        screen.getByPlaceholderText("Enter adventure description"),
      ).toBeInTheDocument();
    });

    it("should display current adventure description in textarea", () => {
      const adventures = [
        createMockAdventure({
          id: 1,
          description: "A grand quest awaits",
        }),
      ];
      renderAdventureDescription(adventures, 1);

      const textarea = screen.getByPlaceholderText(
        "Enter adventure description",
      ) as HTMLTextAreaElement;
      expect(textarea.value).toBe("A grand quest awaits");
    });

    it("should display empty string for adventure with empty description", () => {
      const adventures = [createMockAdventure({ id: 1, description: "" })];
      renderAdventureDescription(adventures, 1);

      const textarea = screen.getByPlaceholderText(
        "Enter adventure description",
      ) as HTMLTextAreaElement;
      expect(textarea.value).toBe("");
    });

    it("should have 4 rows by default", () => {
      const adventures = [createMockAdventure()];
      renderAdventureDescription(adventures, 1);

      const textarea = screen.getByPlaceholderText(
        "Enter adventure description",
      ) as HTMLTextAreaElement;
      expect(textarea.rows).toBe(4);
    });
  });

  describe("No Selected Adventure", () => {
    it("should render when no adventure is selected", () => {
      const adventures = [createMockAdventure()];
      renderAdventureDescription(adventures, null);

      expect(
        screen.getByPlaceholderText("Enter adventure description"),
      ).toBeInTheDocument();
    });

    it("should display empty textarea when no adventure selected", () => {
      const adventures = [
        createMockAdventure({ id: 1, description: "My Description" }),
      ];
      renderAdventureDescription(adventures, null);

      const textarea = screen.getByPlaceholderText(
        "Enter adventure description",
      ) as HTMLTextAreaElement;
      expect(textarea.value).toBe("");
    });

    it("should disable textarea when no adventure is selected", () => {
      const adventures = [createMockAdventure()];
      renderAdventureDescription(adventures, null);

      const textarea = screen.getByPlaceholderText(
        "Enter adventure description",
      );
      expect(textarea).toBeDisabled();
    });

    it("should not update state when typing with no adventure selected", async () => {
      const adventures = [createMockAdventure({ id: 1 })];
      const { store } = renderAdventureDescription(adventures, null);

      const textarea = screen.getByPlaceholderText(
        "Enter adventure description",
      );

      // Textarea is disabled, so userEvent.type should not work
      await userEvent.type(textarea, "New Description");

      // Description should remain unchanged
      expect(store.getState().adventure.adventures[0].description).toBe("");
    });
  });

  describe("Updating Description", () => {
    it("should update description when user types", async () => {
      const adventures = [createMockAdventure({ id: 1, description: "" })];
      const { store } = renderAdventureDescription(adventures, 1);

      const textarea = screen.getByPlaceholderText(
        "Enter adventure description",
      );

      await userEvent.clear(textarea);
      await userEvent.type(textarea, "New adventure description");

      const updatedAdventure = store
        .getState()
        .adventure.adventures.find((adv) => adv.id === 1);
      expect(updatedAdventure?.description).toBe("New adventure description");
    });

    it("should update description in real-time on each keystroke", async () => {
      const adventures = [createMockAdventure({ id: 1, description: "" })];
      const { store } = renderAdventureDescription(adventures, 1);

      const textarea = screen.getByPlaceholderText(
        "Enter adventure description",
      );

      await userEvent.clear(textarea);
      await userEvent.type(textarea, "A");

      let updatedAdventure = store
        .getState()
        .adventure.adventures.find((adv) => adv.id === 1);
      expect(updatedAdventure?.description).toBe("A");

      await userEvent.type(textarea, "B");

      updatedAdventure = store
        .getState()
        .adventure.adventures.find((adv) => adv.id === 1);
      expect(updatedAdventure?.description).toBe("AB");
    });

    it("should replace existing description when updated", async () => {
      const adventures = [
        createMockAdventure({ id: 1, description: "Old Description" }),
      ];
      const { store } = renderAdventureDescription(adventures, 1);

      const textarea = screen.getByPlaceholderText(
        "Enter adventure description",
      );

      await userEvent.clear(textarea);
      await userEvent.type(textarea, "New Description");

      const updatedAdventure = store
        .getState()
        .adventure.adventures.find((adv) => adv.id === 1);
      expect(updatedAdventure?.description).toBe("New Description");
    });

    it("should allow empty description", async () => {
      const adventures = [
        createMockAdventure({ id: 1, description: "Some Description" }),
      ];
      const { store } = renderAdventureDescription(adventures, 1);

      const textarea = screen.getByPlaceholderText(
        "Enter adventure description",
      );

      await userEvent.clear(textarea);

      const updatedAdventure = store
        .getState()
        .adventure.adventures.find((adv) => adv.id === 1);
      expect(updatedAdventure?.description).toBe("");
    });

    it("should reflect textarea value as user types", async () => {
      const adventures = [createMockAdventure({ id: 1, description: "" })];
      renderAdventureDescription(adventures, 1);

      const textarea = screen.getByPlaceholderText(
        "Enter adventure description",
      ) as HTMLTextAreaElement;

      await userEvent.type(textarea, "My Quest");

      expect(textarea.value).toBe("My Quest");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty adventures array", () => {
      const { container } = renderAdventureDescription([], null);
      expect(container).toBeTruthy();

      const textarea = screen.getByPlaceholderText(
        "Enter adventure description",
      );
      expect(textarea).toBeDisabled();
    });

    it("should handle special characters in description", async () => {
      const adventures = [createMockAdventure({ id: 1, description: "" })];
      const { store } = renderAdventureDescription(adventures, 1);

      const textarea = screen.getByPlaceholderText(
        "Enter adventure description",
      );

      await userEvent.type(textarea, "Quest #1: The @Beginning!");

      const updatedAdventure = store
        .getState()
        .adventure.adventures.find((adv) => adv.id === 1);
      expect(updatedAdventure?.description).toBe("Quest #1: The @Beginning!");
    });

    it("should handle very long descriptions", async () => {
      const adventures = [createMockAdventure({ id: 1, description: "" })];
      const { store } = renderAdventureDescription(adventures, 1);

      const textarea = screen.getByPlaceholderText(
        "Enter adventure description",
      );

      const longDescription = "A".repeat(500);
      await userEvent.type(textarea, longDescription);

      const updatedAdventure = store
        .getState()
        .adventure.adventures.find((adv) => adv.id === 1);
      expect(updatedAdventure?.description).toBe(longDescription);
    });

    it("should handle Unicode characters", async () => {
      const adventures = [createMockAdventure({ id: 1, description: "" })];
      const { store } = renderAdventureDescription(adventures, 1);

      const textarea = screen.getByPlaceholderText(
        "Enter adventure description",
      );

      await userEvent.type(textarea, "冒険 🎮 Приключение");

      const updatedAdventure = store
        .getState()
        .adventure.adventures.find((adv) => adv.id === 1);
      expect(updatedAdventure?.description).toBe("冒険 🎮 Приключение");
    });

    it("should handle newlines in description", async () => {
      const adventures = [createMockAdventure({ id: 1, description: "" })];
      const { store } = renderAdventureDescription(adventures, 1);

      const textarea = screen.getByPlaceholderText(
        "Enter adventure description",
      );

      // userEvent.type handles newlines with {Enter}
      await userEvent.type(textarea, "Line 1{Enter}Line 2{Enter}Line 3");

      const updatedAdventure = store
        .getState()
        .adventure.adventures.find((adv) => adv.id === 1);
      expect(updatedAdventure?.description).toBe("Line 1\nLine 2\nLine 3");
    });

    it("should preserve other adventure properties when updating description", async () => {
      const adventures = [
        createMockAdventure({
          id: 1,
          title: "My Title",
          description: "Old Description",
          characters: ["Hero"],
          plotLines: ["Main Quest"],
        }),
      ];
      const { store } = renderAdventureDescription(adventures, 1);

      const textarea = screen.getByPlaceholderText(
        "Enter adventure description",
      );

      await userEvent.clear(textarea);
      await userEvent.type(textarea, "New Description");

      const updatedAdventure = store
        .getState()
        .adventure.adventures.find((adv) => adv.id === 1);
      expect(updatedAdventure?.description).toBe("New Description");
      expect(updatedAdventure?.title).toBe("My Title");
      expect(updatedAdventure?.characters).toEqual(["Hero"]);
      expect(updatedAdventure?.plotLines).toEqual(["Main Quest"]);
    });
  });

  describe("Multiple Adventures", () => {
    it("should only update the selected adventure", async () => {
      const adventures = [
        createMockAdventure({ id: 1, description: "Description 1" }),
        createMockAdventure({ id: 2, description: "Description 2" }),
      ];
      const { store } = renderAdventureDescription(adventures, 1);

      const textarea = screen.getByPlaceholderText(
        "Enter adventure description",
      );

      await userEvent.clear(textarea);
      await userEvent.type(textarea, "Updated Description");

      const state = store.getState();
      const adventure1 = state.adventure.adventures.find((adv) => adv.id === 1);
      const adventure2 = state.adventure.adventures.find((adv) => adv.id === 2);

      expect(adventure1?.description).toBe("Updated Description");
      expect(adventure2?.description).toBe("Description 2");
    });

    it("should display correct description when adventure is selected", () => {
      const adventures = [
        createMockAdventure({ id: 1, description: "First Description" }),
        createMockAdventure({ id: 2, description: "Second Description" }),
      ];

      // Render with adventure 1 selected
      const { unmount: unmount1 } = renderAdventureDescription(adventures, 1);

      let textarea = screen.getByPlaceholderText(
        "Enter adventure description",
      ) as HTMLTextAreaElement;
      expect(textarea.value).toBe("First Description");

      unmount1();

      // Render with adventure 2 selected
      renderAdventureDescription(adventures, 2);

      textarea = screen.getByPlaceholderText(
        "Enter adventure description",
      ) as HTMLTextAreaElement;
      expect(textarea.value).toBe("Second Description");
    });
  });
});
