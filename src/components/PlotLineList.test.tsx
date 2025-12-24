import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders, userEvent } from "../test/utils";
import { PlotLineList } from "./PlotLineList";
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

// Helper function to render PlotLineList with specific state
function renderPlotLineList(
  adventures: Adventure[],
  selectedId: number | null = null,
) {
  const preloadedState = {
    adventure: {
      adventures,
      selectedAdventureId: selectedId,
    },
  };

  return renderWithProviders(<PlotLineList />, { preloadedState });
}

describe("PlotLineList", () => {
  describe("Rendering", () => {
    it("should render without crashing", () => {
      const { container } = renderPlotLineList([]);
      expect(container).toBeTruthy();
    });

    it("should display the Plot Lines label", () => {
      const adventures = [createMockAdventure()];
      renderPlotLineList(adventures, 1);

      expect(screen.getByText("Plot Lines")).toBeInTheDocument();
    });

    it("should display the add plot line input field", () => {
      const adventures = [createMockAdventure()];
      renderPlotLineList(adventures, 1);

      expect(
        screen.getByPlaceholderText("Add a new plot line"),
      ).toBeInTheDocument();
    });

    it("should display the add plot line button", () => {
      const adventures = [createMockAdventure()];
      renderPlotLineList(adventures, 1);

      expect(screen.getByText("Add Plot Line")).toBeInTheDocument();
    });

    it("should display all plot lines from selected adventure", () => {
      const adventures = [
        createMockAdventure({
          id: 1,
          plotLines: ["Main Quest", "Side Quest", "Mystery Arc"],
        }),
      ];
      renderPlotLineList(adventures, 1);

      expect(screen.getByText("Main Quest")).toBeInTheDocument();
      expect(screen.getByText("Side Quest")).toBeInTheDocument();
      expect(screen.getByText("Mystery Arc")).toBeInTheDocument();
    });

    it("should not display plot lines from non-selected adventures", () => {
      const adventures = [
        createMockAdventure({ id: 1, plotLines: ["Main Quest"] }),
        createMockAdventure({ id: 2, plotLines: ["Other Quest"] }),
      ];
      renderPlotLineList(adventures, 1);

      expect(screen.getByText("Main Quest")).toBeInTheDocument();
      expect(screen.queryByText("Other Quest")).not.toBeInTheDocument();
    });
  });

  describe("No Selected Adventure", () => {
    it("should render when no adventure is selected", () => {
      const adventures = [createMockAdventure()];
      renderPlotLineList(adventures, null);

      expect(
        screen.getByPlaceholderText("Add a new plot line"),
      ).toBeInTheDocument();
    });

    it("should not display any plot lines when no adventure selected", () => {
      const adventures = [
        createMockAdventure({ id: 1, plotLines: ["Main Quest"] }),
      ];
      renderPlotLineList(adventures, null);

      expect(screen.queryByText("Main Quest")).not.toBeInTheDocument();
    });

    it("should not add plot line when no adventure is selected", async () => {
      const adventures = [createMockAdventure({ id: 1 })];
      const { store } = renderPlotLineList(adventures, null);

      const input = screen.getByPlaceholderText("Add a new plot line");
      const button = screen.getByText("Add Plot Line");

      await userEvent.type(input, "New Quest");
      await userEvent.click(button);

      // Plot lines array should still be empty
      expect(store.getState().adventure.adventures[0].plotLines).toEqual([]);
    });
  });

  describe("Adding Plot Lines", () => {
    it("should add a plot line when button is clicked", async () => {
      const adventures = [createMockAdventure({ id: 1 })];
      const { store } = renderPlotLineList(adventures, 1);

      const input = screen.getByPlaceholderText("Add a new plot line");
      const button = screen.getByText("Add Plot Line");

      await userEvent.type(input, "New Quest");
      await userEvent.click(button);

      const updatedAdventure = store
        .getState()
        .adventure.adventures.find((adv) => adv.id === 1);
      expect(updatedAdventure?.plotLines).toContain("New Quest");
    });

    it("should clear input field after adding plot line", async () => {
      const adventures = [createMockAdventure({ id: 1 })];
      renderPlotLineList(adventures, 1);

      const input = screen.getByPlaceholderText(
        "Add a new plot line",
      ) as HTMLInputElement;
      const button = screen.getByText("Add Plot Line");

      await userEvent.type(input, "New Quest");
      await userEvent.click(button);

      expect(input.value).toBe("");
    });

    it("should add multiple plot lines sequentially", async () => {
      const adventures = [createMockAdventure({ id: 1 })];
      const { store } = renderPlotLineList(adventures, 1);

      const input = screen.getByPlaceholderText("Add a new plot line");
      const button = screen.getByText("Add Plot Line");

      await userEvent.type(input, "Main Quest");
      await userEvent.click(button);

      await userEvent.type(input, "Side Quest");
      await userEvent.click(button);

      await userEvent.type(input, "Mystery Arc");
      await userEvent.click(button);

      const updatedAdventure = store
        .getState()
        .adventure.adventures.find((adv) => adv.id === 1);
      expect(updatedAdventure?.plotLines).toEqual([
        "Main Quest",
        "Side Quest",
        "Mystery Arc",
      ]);
    });

    it("should preserve existing plot lines when adding new ones", async () => {
      const adventures = [
        createMockAdventure({ id: 1, plotLines: ["Existing Quest"] }),
      ];
      const { store } = renderPlotLineList(adventures, 1);

      const input = screen.getByPlaceholderText("Add a new plot line");
      const button = screen.getByText("Add Plot Line");

      await userEvent.type(input, "New Quest");
      await userEvent.click(button);

      const updatedAdventure = store
        .getState()
        .adventure.adventures.find((adv) => adv.id === 1);
      expect(updatedAdventure?.plotLines).toEqual([
        "Existing Quest",
        "New Quest",
      ]);
    });

    it("should trim whitespace from plot line names", async () => {
      const adventures = [createMockAdventure({ id: 1 })];
      const { store } = renderPlotLineList(adventures, 1);

      const input = screen.getByPlaceholderText("Add a new plot line");
      const button = screen.getByText("Add Plot Line");

      await userEvent.type(input, "  Quest with spaces  ");
      await userEvent.click(button);

      const updatedAdventure = store
        .getState()
        .adventure.adventures.find((adv) => adv.id === 1);
      expect(updatedAdventure?.plotLines).toContain("Quest with spaces");
    });
  });

  describe("Input Validation", () => {
    it("should not add empty plot line names", async () => {
      const adventures = [createMockAdventure({ id: 1 })];
      const { store } = renderPlotLineList(adventures, 1);

      const button = screen.getByText("Add Plot Line");
      await userEvent.click(button);

      const updatedAdventure = store
        .getState()
        .adventure.adventures.find((adv) => adv.id === 1);
      expect(updatedAdventure?.plotLines).toEqual([]);
    });

    it("should not add whitespace-only plot line names", async () => {
      const adventures = [createMockAdventure({ id: 1 })];
      const { store } = renderPlotLineList(adventures, 1);

      const input = screen.getByPlaceholderText("Add a new plot line");
      const button = screen.getByText("Add Plot Line");

      await userEvent.type(input, "   ");
      await userEvent.click(button);

      const updatedAdventure = store
        .getState()
        .adventure.adventures.find((adv) => adv.id === 1);
      expect(updatedAdventure?.plotLines).toEqual([]);
    });

    it("should not add plot line when input is empty after trim", async () => {
      const adventures = [createMockAdventure({ id: 1 })];
      const { store } = renderPlotLineList(adventures, 1);

      const input = screen.getByPlaceholderText("Add a new plot line");
      const button = screen.getByText("Add Plot Line");

      await userEvent.type(input, "\t\n  \t");
      await userEvent.click(button);

      const updatedAdventure = store
        .getState()
        .adventure.adventures.find((adv) => adv.id === 1);
      expect(updatedAdventure?.plotLines).toEqual([]);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty adventures array", () => {
      const { container } = renderPlotLineList([], null);
      expect(container).toBeTruthy();
    });

    it("should handle adventure with empty plotLines array", () => {
      const adventures = [createMockAdventure({ id: 1, plotLines: [] })];
      renderPlotLineList(adventures, 1);

      expect(
        screen.getByPlaceholderText("Add a new plot line"),
      ).toBeInTheDocument();
    });

    it("should update input field value as user types", async () => {
      const adventures = [createMockAdventure({ id: 1 })];
      renderPlotLineList(adventures, 1);

      const input = screen.getByPlaceholderText(
        "Add a new plot line",
      ) as HTMLInputElement;

      await userEvent.type(input, "New Plot Line");

      expect(input.value).toBe("New Plot Line");
    });

    it("should handle special characters in plot line names", async () => {
      const adventures = [createMockAdventure({ id: 1 })];
      const { store } = renderPlotLineList(adventures, 1);

      const input = screen.getByPlaceholderText("Add a new plot line");
      const button = screen.getByText("Add Plot Line");

      await userEvent.type(input, "Quest-123 (The Great Mystery)");
      await userEvent.click(button);

      const updatedAdventure = store
        .getState()
        .adventure.adventures.find((adv) => adv.id === 1);
      expect(updatedAdventure?.plotLines).toContain(
        "Quest-123 (The Great Mystery)",
      );
    });

    it("should handle very long plot line names", async () => {
      const adventures = [createMockAdventure({ id: 1 })];
      const { store } = renderPlotLineList(adventures, 1);

      const input = screen.getByPlaceholderText("Add a new plot line");
      const button = screen.getByText("Add Plot Line");

      const longName = "A".repeat(200);
      await userEvent.type(input, longName);
      await userEvent.click(button);

      const updatedAdventure = store
        .getState()
        .adventure.adventures.find((adv) => adv.id === 1);
      expect(updatedAdventure?.plotLines).toContain(longName);
    });

    it("should allow duplicate plot line names", async () => {
      const adventures = [
        createMockAdventure({ id: 1, plotLines: ["Main Quest"] }),
      ];
      const { store } = renderPlotLineList(adventures, 1);

      const input = screen.getByPlaceholderText("Add a new plot line");
      const button = screen.getByText("Add Plot Line");

      await userEvent.type(input, "Main Quest");
      await userEvent.click(button);

      const updatedAdventure = store
        .getState()
        .adventure.adventures.find((adv) => adv.id === 1);
      expect(updatedAdventure?.plotLines).toEqual(["Main Quest", "Main Quest"]);
    });
  });

  describe("Multiple Adventures", () => {
    it("should only update the selected adventure", async () => {
      const adventures = [
        createMockAdventure({ id: 1, plotLines: [] }),
        createMockAdventure({ id: 2, plotLines: ["Other Quest"] }),
      ];
      const { store } = renderPlotLineList(adventures, 1);

      const input = screen.getByPlaceholderText("Add a new plot line");
      const button = screen.getByText("Add Plot Line");

      await userEvent.type(input, "My Quest");
      await userEvent.click(button);

      const state = store.getState();
      const adventure1 = state.adventure.adventures.find((adv) => adv.id === 1);
      const adventure2 = state.adventure.adventures.find((adv) => adv.id === 2);

      expect(adventure1?.plotLines).toContain("My Quest");
      expect(adventure2?.plotLines).toEqual(["Other Quest"]);
    });
  });
});
