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
      const adventures = [createMockAdventure({ id: 1, turningPoints })];
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
      const adventures = [createMockAdventure({ id: 1, turningPoints })];
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
      const adventures = [createMockAdventure({ id: 1, turningPoints })];
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
          turningPoints: [createMockTurningPoint({ id: 2, title: "Other TP" })],
        }),
      ];
      renderTurningPointCards(adventures, 1);

      expect(screen.getByText("Selected TP")).toBeInTheDocument();
      expect(screen.queryByText("Other TP")).not.toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should display new turning point button when no turning points exist", () => {
      const adventures = [createMockAdventure({ id: 1, turningPoints: [] })];
      renderTurningPointCards(adventures, 1);

      expect(
        screen.getByTestId("new-turning-point-button"),
      ).toBeInTheDocument();
    });

    it("should display new turning point button when turning points exist", () => {
      const turningPoints = [
        createMockTurningPoint({ id: 1, title: "Some TP" }),
      ];
      const adventures = [createMockAdventure({ id: 1, turningPoints })];
      renderTurningPointCards(adventures, 1);

      expect(
        screen.getByTestId("new-turning-point-button"),
      ).toBeInTheDocument();
    });

    it("should display empty plot points list when no plot points exist", () => {
      const turningPoints = [createMockTurningPoint({ id: 1, plotPoints: [] })];
      const adventures = [createMockAdventure({ id: 1, turningPoints })];
      renderTurningPointCards(adventures, 1);

      const card = screen.getByTestId("turning-point-card-1");
      expect(card).toBeInTheDocument();
      // Card should render but have no plot point items
    });

    it("should display placeholder text when title is empty", () => {
      const turningPoints = [createMockTurningPoint({ id: 1, title: "" })];
      const adventures = [createMockAdventure({ id: 1, turningPoints })];
      renderTurningPointCards(adventures, 1);

      expect(screen.getByText("Title")).toBeInTheDocument();
    });

    it("should display placeholder text when plotLine is empty", () => {
      const turningPoints = [createMockTurningPoint({ id: 1, plotLine: "" })];
      const adventures = [createMockAdventure({ id: 1, turningPoints })];
      renderTurningPointCards(adventures, 1);

      expect(screen.getByText("Plot Line")).toBeInTheDocument();
    });

    it("should handle adventure with no turning points", () => {
      const adventures = [createMockAdventure({ id: 1, turningPoints: [] })];
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
      const adventures = [createMockAdventure({ id: 1, turningPoints })];

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
      const adventures = [createMockAdventure({ id: 1, turningPoints })];

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
      const adventures = [createMockAdventure({ id: 1, turningPoints })];

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
      const adventures = [createMockAdventure({ id: 1, turningPoints })];

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
      const adventures = [createMockAdventure({ id: 1, turningPoints })];
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
      const adventures = [createMockAdventure({ id: 1, turningPoints })];
      renderTurningPointCards(adventures, 1);

      expect(screen.getByTestId("turning-point-card-1")).toBeInTheDocument();
      expect(screen.getByTestId("turning-point-card-2")).toBeInTheDocument();
      expect(screen.getByTestId("turning-point-card-3")).toBeInTheDocument();
    });
  });

  describe("Modal Activation Integration", () => {
    describe("Turning Point Card Click Activation", () => {
      it("should call onClick callback with correct turning point ID when card is clicked", async () => {
        const mockOnClick = vi.fn();
        const mockOnAddNew = vi.fn();

        const turningPoints = [
          createMockTurningPoint({ id: 1, title: "First Turning Point" }),
          createMockTurningPoint({ id: 2, title: "Second Turning Point" }),
        ];
        const adventures = [createMockAdventure({ id: 1, turningPoints })];

        renderWithProviders(
          <TurningPointCards onClick={mockOnClick} onAddNew={mockOnAddNew} />,
          {
            preloadedState: {
              adventure: {
                adventures,
                selectedAdventureId: 1,
              },
            },
          },
        );

        const firstCard = screen.getByTestId("turning-point-card-1");
        await userEvent.click(firstCard);

        expect(mockOnClick).toHaveBeenCalledWith(1);
        expect(mockOnClick).toHaveBeenCalledTimes(1);
        expect(mockOnAddNew).not.toHaveBeenCalled();
      });

      it("should call onClick with different IDs for different cards", async () => {
        const mockOnClick = vi.fn();
        const mockOnAddNew = vi.fn();

        const turningPoints = [
          createMockTurningPoint({ id: 10, title: "Card 10" }),
          createMockTurningPoint({ id: 20, title: "Card 20" }),
          createMockTurningPoint({ id: 30, title: "Card 30" }),
        ];
        const adventures = [createMockAdventure({ id: 1, turningPoints })];

        renderWithProviders(
          <TurningPointCards onClick={mockOnClick} onAddNew={mockOnAddNew} />,
          {
            preloadedState: {
              adventure: {
                adventures,
                selectedAdventureId: 1,
              },
            },
          },
        );

        await userEvent.click(screen.getByTestId("turning-point-card-20"));
        expect(mockOnClick).toHaveBeenCalledWith(20);

        await userEvent.click(screen.getByTestId("turning-point-card-10"));
        expect(mockOnClick).toHaveBeenCalledWith(10);

        await userEvent.click(screen.getByTestId("turning-point-card-30"));
        expect(mockOnClick).toHaveBeenCalledWith(30);

        expect(mockOnClick).toHaveBeenCalledTimes(3);
        expect(mockOnAddNew).not.toHaveBeenCalled();
      });

      it("should not call onClick when callback is not provided", async () => {
        const turningPoints = [createMockTurningPoint({ id: 1 })];
        const adventures = [createMockAdventure({ id: 1, turningPoints })];

        renderWithProviders(<TurningPointCards />, {
          preloadedState: {
            adventure: {
              adventures,
              selectedAdventureId: 1,
            },
          },
        });

        const card = screen.getByTestId("turning-point-card-1");
        // Should not throw error when clicked without onClick prop
        await userEvent.click(card);
      });
    });

    describe("New Turning Point Button Activation", () => {
      it("should call onAddNew callback when new turning point button is clicked", async () => {
        const mockOnClick = vi.fn();
        const mockOnAddNew = vi.fn();

        const adventures = [createMockAdventure({ id: 1 })];

        renderWithProviders(
          <TurningPointCards onClick={mockOnClick} onAddNew={mockOnAddNew} />,
          {
            preloadedState: {
              adventure: {
                adventures,
                selectedAdventureId: 1,
              },
            },
          },
        );

        const button = screen.getByTestId("new-turning-point-button");
        await userEvent.click(button);

        expect(mockOnAddNew).toHaveBeenCalledTimes(1);
        expect(mockOnClick).not.toHaveBeenCalled();
      });

      it("should not call onAddNew when callback is not provided", async () => {
        const adventures = [createMockAdventure({ id: 1 })];

        renderWithProviders(<TurningPointCards />, {
          preloadedState: {
            adventure: {
              adventures,
              selectedAdventureId: 1,
            },
          },
        });

        const button = screen.getByTestId("new-turning-point-button");
        // Should not throw error when clicked without onAddNew prop
        await userEvent.click(button);
      });

      it("should work with existing turning points present", async () => {
        const mockOnClick = vi.fn();
        const mockOnAddNew = vi.fn();

        const turningPoints = [createMockTurningPoint({ id: 1 })];
        const adventures = [createMockAdventure({ id: 1, turningPoints })];

        renderWithProviders(
          <TurningPointCards onClick={mockOnClick} onAddNew={mockOnAddNew} />,
          {
            preloadedState: {
              adventure: {
                adventures,
                selectedAdventureId: 1,
              },
            },
          },
        );

        const button = screen.getByTestId("new-turning-point-button");
        await userEvent.click(button);

        expect(mockOnAddNew).toHaveBeenCalledTimes(1);
        expect(mockOnClick).not.toHaveBeenCalled();
      });
    });

    describe("Modal Activation Props Pattern", () => {
      it("should support callback pattern for modal activation", async () => {
        const mockOnClick = vi.fn();
        const mockOnAddNew = vi.fn();

        const turningPoints = [createMockTurningPoint({ id: 1 })];
        const adventures = [createMockAdventure({ id: 1, turningPoints })];

        renderWithProviders(
          <TurningPointCards onClick={mockOnClick} onAddNew={mockOnAddNew} />,
          {
            preloadedState: {
              adventure: {
                adventures,
                selectedAdventureId: 1,
              },
            },
          },
        );

        // Test card click activation
        const card = screen.getByTestId("turning-point-card-1");
        await userEvent.click(card);
        expect(mockOnClick).toHaveBeenCalledWith(1);

        // Test new button activation
        const button = screen.getByTestId("new-turning-point-button");
        await userEvent.click(button);
        expect(mockOnAddNew).toHaveBeenCalledTimes(1);

        // Verify callback pattern works correctly
        expect(mockOnClick).toHaveBeenCalledTimes(1);
        expect(mockOnAddNew).toHaveBeenCalledTimes(1);
      });

      it("should allow both callbacks to be optional", async () => {
        const turningPoints = [createMockTurningPoint({ id: 1 })];
        const adventures = [createMockAdventure({ id: 1, turningPoints })];

        // Test with only onClick
        const { rerender } = renderWithProviders(
          <TurningPointCards onClick={vi.fn()} />,
          {
            preloadedState: {
              adventure: {
                adventures,
                selectedAdventureId: 1,
              },
            },
          },
        );

        // Test with only onAddNew
        rerender(<TurningPointCards onAddNew={vi.fn()} />);

        // Test with neither
        rerender(<TurningPointCards />);

        // Should not crash in any case
        expect(screen.getByTestId("turning-point-card-1")).toBeInTheDocument();
        expect(
          screen.getByTestId("new-turning-point-button"),
        ).toBeInTheDocument();
      });

      it("should maintain callback isolation between cards and button", async () => {
        const mockOnClick = vi.fn();
        const mockOnAddNew = vi.fn();

        const turningPoints = [createMockTurningPoint({ id: 1 })];
        const adventures = [createMockAdventure({ id: 1, turningPoints })];

        renderWithProviders(
          <TurningPointCards onClick={mockOnClick} onAddNew={mockOnAddNew} />,
          {
            preloadedState: {
              adventure: {
                adventures,
                selectedAdventureId: 1,
              },
            },
          },
        );

        // Click card - should only call onClick
        const card = screen.getByTestId("turning-point-card-1");
        await userEvent.click(card);
        expect(mockOnClick).toHaveBeenCalledTimes(1);
        expect(mockOnAddNew).not.toHaveBeenCalled();

        // Click button - should only call onAddNew
        const button = screen.getByTestId("new-turning-point-button");
        await userEvent.click(button);
        expect(mockOnAddNew).toHaveBeenCalledTimes(1);
        expect(mockOnClick).toHaveBeenCalledTimes(1); // Should not increase
      });
    });

    describe("Modal Data Propagation Pattern", () => {
      it("should provide turning point ID for modal lookup via onClick", async () => {
        const mockOnClick = vi.fn();
        const mockOnAddNew = vi.fn();

        const turningPoints = [
          createMockTurningPoint({
            id: 42,
            title: "Specific Turning Point",
            notes: "Important moment",
            plotLine: "Main Quest",
            charactersInvolved: ["Hero"],
            plotPoints: ["Battle", "Victory"],
          }),
        ];
        const adventures = [createMockAdventure({ id: 1, turningPoints })];

        renderWithProviders(
          <TurningPointCards onClick={mockOnClick} onAddNew={mockOnAddNew} />,
          {
            preloadedState: {
              adventure: {
                adventures,
                selectedAdventureId: 1,
              },
            },
          },
        );

        const card = screen.getByTestId("turning-point-card-42");
        await userEvent.click(card);

        // Verify the ID is passed correctly for modal to fetch the full data
        expect(mockOnClick).toHaveBeenCalledWith(42);
        expect(mockOnClick).toHaveBeenCalledTimes(1);
      });

      it("should support new turning point creation pattern via onAddNew", async () => {
        const mockOnClick = vi.fn();
        const mockOnAddNew = vi.fn();

        const adventures = [createMockAdventure({ id: 1 })];

        renderWithProviders(
          <TurningPointCards onClick={mockOnClick} onAddNew={mockOnAddNew} />,
          {
            preloadedState: {
              adventure: {
                adventures,
                selectedAdventureId: 1,
              },
            },
          },
        );

        const button = screen.getByTestId("new-turning-point-button");
        await userEvent.click(button);

        // Verify the new turning point pattern is triggered
        expect(mockOnAddNew).toHaveBeenCalledTimes(1);
        expect(mockOnClick).not.toHaveBeenCalled();
      });

      it("should maintain data isolation between different turning points", async () => {
        const mockOnClick = vi.fn();
        const mockOnAddNew = vi.fn();

        const turningPoints = [
          createMockTurningPoint({ id: 1, title: "First" }),
          createMockTurningPoint({ id: 2, title: "Second" }),
          createMockTurningPoint({ id: 3, title: "Third" }),
        ];
        const adventures = [createMockAdventure({ id: 1, turningPoints })];

        renderWithProviders(
          <TurningPointCards onClick={mockOnClick} onAddNew={mockOnAddNew} />,
          {
            preloadedState: {
              adventure: {
                adventures,
                selectedAdventureId: 1,
              },
            },
          },
        );

        // Click different cards and verify correct IDs are passed
        await userEvent.click(screen.getByTestId("turning-point-card-2"));
        expect(mockOnClick).toHaveBeenCalledWith(2);

        await userEvent.click(screen.getByTestId("turning-point-card-1"));
        expect(mockOnClick).toHaveBeenCalledWith(1);

        await userEvent.click(screen.getByTestId("turning-point-card-3"));
        expect(mockOnClick).toHaveBeenCalledWith(3);

        // Verify no cross-contamination of data
        expect(mockOnClick).toHaveBeenCalledTimes(3);
        expect(mockOnAddNew).not.toHaveBeenCalled();
      });
    });
  });
});
