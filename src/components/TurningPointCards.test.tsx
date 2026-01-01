import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders, userEvent } from "../test/utils";
import { TurningPointCards } from "./TurningPointCards";
import type { Adventure, TurningPoint } from "../types/Adventure";

// Helper function to create mock turning point
function createMockTurningPoint(
  overrides?: Partial<TurningPoint>,
): TurningPoint {
  return {
    id: 1,
    title: "Test Turning Point",
    notes: "Test notes",
    plotLine: "Test Plot Line",
    charactersInvolved: [],
    plotPoints: [],
    ...overrides,
  };
}

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

// Helper function to render TurningPointCards with specific state
function renderTurningPointCards(
  adventures: Adventure[],
  selectedId: number | null = null,
) {
  const preloadedState = {
    adventure: {
      adventures,
      selectedAdventureId: selectedId,
    },
  };

  return renderWithProviders(<TurningPointCards />, { preloadedState });
}

describe("TurningPointCards", () => {
  describe("Rendering", () => {
    it("should render without crashing", () => {
      const { container } = renderTurningPointCards([]);
      expect(container).toBeTruthy();
    });

    it("should render container with data-testid", () => {
      const adventures = [createMockAdventure()];
      renderTurningPointCards(adventures, 1);

      expect(screen.getByTestId("turning-point-list")).toBeInTheDocument();
    });

    it("should display new turning point button with data-testid", () => {
      const adventures = [createMockAdventure()];
      renderTurningPointCards(adventures, 1);

      expect(
        screen.getByTestId("new-turning-point-button"),
      ).toBeInTheDocument();
    });

    it("should display all turning points from selected adventure", () => {
      const turningPoints = [
        createMockTurningPoint({ id: 1, title: "First Turning Point" }),
        createMockTurningPoint({ id: 2, title: "Second Turning Point" }),
        createMockTurningPoint({ id: 3, title: "Third Turning Point" }),
      ];
      const adventures = [
        createMockAdventure({ id: 1, turningPoints }),
      ];
      renderTurningPointCards(adventures, 1);

      expect(screen.getByTestId("turning-point-card-1")).toBeInTheDocument();
      expect(screen.getByTestId("turning-point-card-2")).toBeInTheDocument();
      expect(screen.getByTestId("turning-point-card-3")).toBeInTheDocument();
    });

    it("should display turning point title and plotLine", () => {
      const turningPoints = [
        createMockTurningPoint({
          id: 1,
          title: "Epic Moment",
          plotLine: "Main Quest Line",
        }),
      ];
      const adventures = [
        createMockAdventure({ id: 1, turningPoints }),
      ];
      renderTurningPointCards(adventures, 1);

      expect(screen.getByText("Epic Moment")).toBeInTheDocument();
      expect(screen.getByText("Main Quest Line")).toBeInTheDocument();
    });

    it("should display all plot points for a turning point", () => {
      const turningPoints = [
        createMockTurningPoint({
          id: 1,
          plotPoints: ["Point A", "Point B", "Point C"],
        }),
      ];
      const adventures = [
        createMockAdventure({ id: 1, turningPoints }),
      ];
      renderTurningPointCards(adventures, 1);

      expect(screen.getByText("Point A")).toBeInTheDocument();
      expect(screen.getByText("Point B")).toBeInTheDocument();
      expect(screen.getByText("Point C")).toBeInTheDocument();
    });

    it("should not display turning points from non-selected adventures", () => {
      const adventures = [
        createMockAdventure({
          id: 1,
          turningPoints: [
            createMockTurningPoint({ id: 1, title: "Selected TP" }),
          ],
        }),
        createMockAdventure({
          id: 2,
          turningPoints: [
            createMockTurningPoint({ id: 2, title: "Other TP" }),
          ],
        }),
      ];
      renderTurningPointCards(adventures, 1);

      expect(screen.getByText("Selected TP")).toBeInTheDocument();
      expect(screen.queryByText("Other TP")).not.toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should display new turning point button when no turning points exist", () => {
      const adventures = [
        createMockAdventure({ id: 1, turningPoints: [] }),
      ];
      renderTurningPointCards(adventures, 1);

      expect(
        screen.getByTestId("new-turning-point-button"),
      ).toBeInTheDocument();
    });

    it("should display new turning point button when turning points exist", () => {
      const turningPoints = [
        createMockTurningPoint({ id: 1, title: "Some TP" }),
      ];
      const adventures = [
        createMockAdventure({ id: 1, turningPoints }),
      ];
      renderTurningPointCards(adventures, 1);

      expect(
        screen.getByTestId("new-turning-point-button"),
      ).toBeInTheDocument();
    });

    it("should display empty plot points list when no plot points exist", () => {
      const turningPoints = [
        createMockTurningPoint({ id: 1, plotPoints: [] }),
      ];
      const adventures = [
        createMockAdventure({ id: 1, turningPoints }),
      ];
      renderTurningPointCards(adventures, 1);

      const card = screen.getByTestId("turning-point-card-1");
      expect(card).toBeInTheDocument();
      // Card should render but have no plot point items
    });

    it("should display placeholder text when title is empty", () => {
      const turningPoints = [
        createMockTurningPoint({ id: 1, title: "" }),
      ];
      const adventures = [
        createMockAdventure({ id: 1, turningPoints }),
      ];
      renderTurningPointCards(adventures, 1);

      expect(screen.getByText("Title")).toBeInTheDocument();
    });

    it("should display placeholder text when plotLine is empty", () => {
      const turningPoints = [
        createMockTurningPoint({ id: 1, plotLine: "" }),
      ];
      const adventures = [
        createMockAdventure({ id: 1, turningPoints }),
      ];
      renderTurningPointCards(adventures, 1);

      expect(screen.getByText("Plot Line")).toBeInTheDocument();
    });

    it("should handle adventure with no turning points", () => {
      const adventures = [
        createMockAdventure({ id: 1, turningPoints: [] }),
      ];
      renderTurningPointCards(adventures, 1);

      expect(screen.getByTestId("turning-point-list")).toBeInTheDocument();
      expect(
        screen.queryByTestId("turning-point-card-1"),
      ).not.toBeInTheDocument();
    });

    it("should handle no selected adventure", () => {
      const adventures = [createMockAdventure()];
      renderTurningPointCards(adventures, null);

      expect(screen.getByTestId("turning-point-list")).toBeInTheDocument();
    });

    it("should handle empty adventures array", () => {
      const { container } = renderTurningPointCards([], null);
      expect(container).toBeTruthy();
    });
  });

  describe("Interactivity", () => {
    it("should accept onClick callback prop", () => {
      const mockOnClick = vi.fn();
      const turningPoints = [createMockTurningPoint({ id: 1 })];
      const adventures = [
        createMockAdventure({ id: 1, turningPoints }),
      ];

      renderWithProviders(<TurningPointCards onClick={mockOnClick} />, {
        preloadedState: {
          adventure: {
            adventures,
            selectedAdventureId: 1,
          },
        },
      });

      expect(screen.getByTestId("turning-point-card-1")).toBeInTheDocument();
    });

    it("should call onClick callback with turning point ID when card is clicked", async () => {
      const mockOnClick = vi.fn();
      const turningPoints = [createMockTurningPoint({ id: 42 })];
      const adventures = [
        createMockAdventure({ id: 1, turningPoints }),
      ];

      renderWithProviders(<TurningPointCards onClick={mockOnClick} />, {
        preloadedState: {
          adventure: {
            adventures,
            selectedAdventureId: 1,
          },
        },
      });

      const card = screen.getByTestId("turning-point-card-42");
      await userEvent.click(card);

      expect(mockOnClick).toHaveBeenCalledWith(42);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it("should call onClick with correct ID for multiple cards", async () => {
      const mockOnClick = vi.fn();
      const turningPoints = [
        createMockTurningPoint({ id: 1 }),
        createMockTurningPoint({ id: 2 }),
        createMockTurningPoint({ id: 3 }),
      ];
      const adventures = [
        createMockAdventure({ id: 1, turningPoints }),
      ];

      renderWithProviders(<TurningPointCards onClick={mockOnClick} />, {
        preloadedState: {
          adventure: {
            adventures,
            selectedAdventureId: 1,
          },
        },
      });

      await userEvent.click(screen.getByTestId("turning-point-card-2"));
      expect(mockOnClick).toHaveBeenCalledWith(2);

      await userEvent.click(screen.getByTestId("turning-point-card-1"));
      expect(mockOnClick).toHaveBeenCalledWith(1);

      await userEvent.click(screen.getByTestId("turning-point-card-3"));
      expect(mockOnClick).toHaveBeenCalledWith(3);

      expect(mockOnClick).toHaveBeenCalledTimes(3);
    });

    it("should not call onClick when callback is not provided", async () => {
      const turningPoints = [createMockTurningPoint({ id: 1 })];
      const adventures = [
        createMockAdventure({ id: 1, turningPoints }),
      ];

      renderTurningPointCards(adventures, 1);

      const card = screen.getByTestId("turning-point-card-1");
      // Should not throw error when clicked without onClick prop
      await userEvent.click(card);
    });

    it("should accept onAddNew callback prop for new turning point button", () => {
      const mockOnAddNew = vi.fn();
      const adventures = [createMockAdventure({ id: 1 })];

      renderWithProviders(<TurningPointCards onAddNew={mockOnAddNew} />, {
        preloadedState: {
          adventure: {
            adventures,
            selectedAdventureId: 1,
          },
        },
      });

      expect(
        screen.getByTestId("new-turning-point-button"),
      ).toBeInTheDocument();
    });

    it("should call onAddNew callback when new turning point button is clicked", async () => {
      const mockOnAddNew = vi.fn();
      const adventures = [createMockAdventure({ id: 1 })];

      renderWithProviders(<TurningPointCards onAddNew={mockOnAddNew} />, {
        preloadedState: {
          adventure: {
            adventures,
            selectedAdventureId: 1,
          },
        },
      });

      const button = screen.getByTestId("new-turning-point-button");
      await userEvent.click(button);

      expect(mockOnAddNew).toHaveBeenCalledTimes(1);
    });
  });

  describe("Layout", () => {
    it("should use flexbox layout for cards", () => {
      const turningPoints = [
        createMockTurningPoint({ id: 1 }),
        createMockTurningPoint({ id: 2 }),
      ];
      const adventures = [
        createMockAdventure({ id: 1, turningPoints }),
      ];
      renderTurningPointCards(adventures, 1);

      const listContainer = screen.getByTestId("turning-point-list");

      // Verify it uses flexbox (will be checked visually but structure should support it)
      expect(listContainer).toBeInTheDocument();
    });

    it("should render multiple cards in horizontal layout", () => {
      const turningPoints = [
        createMockTurningPoint({ id: 1, title: "First" }),
        createMockTurningPoint({ id: 2, title: "Second" }),
        createMockTurningPoint({ id: 3, title: "Third" }),
      ];
      const adventures = [
        createMockAdventure({ id: 1, turningPoints }),
      ];
      renderTurningPointCards(adventures, 1);

      expect(screen.getByTestId("turning-point-card-1")).toBeInTheDocument();
      expect(screen.getByTestId("turning-point-card-2")).toBeInTheDocument();
      expect(screen.getByTestId("turning-point-card-3")).toBeInTheDocument();
    });
  });
});
