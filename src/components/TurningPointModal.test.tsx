import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../test/utils";
import type { TurningPoint, Adventure } from "../types/Adventure";
import TurningPointModal from "./TurningPointModal";

const mockTurningPoint: TurningPoint = {
  id: 1,
  title: "title",
  notes: "notes",
  plotLine: "plotLine",
  charactersInvolved: [],
  plotPoints: [],
};

const mockTurningPointWithCharacters: TurningPoint = {
  id: 3,
  title: "title",
  notes: "notes",
  plotLine: "plotLine",
  charactersInvolved: ["Alice", "Bob", "Charlie"],
  plotPoints: [],
};

const mockEmptyTurningPoint: TurningPoint = {
  id: 2,
  title: "",
  notes: "",
  plotLine: "",
  charactersInvolved: [],
  plotPoints: [],
};

const mockAdventure: Adventure = {
  id: 1,
  title: "Test Adventure",
  description: "Test Description",
  characters: ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank"],
  plotLines: ["Main Plot"],
  themes: ["action"],
  notes: "Test notes",
  turningPoints: [],
};

describe("TurningPointModal", () => {
  describe("Rendering with mockTurningPoint", () => {
    it("should render title, notes, and plotLine fields with labels and text fields", () => {
      renderWithProviders(
        <TurningPointModal
          show={true}
          turningPoint={mockTurningPoint}
          onClose={() => {}}
          onSave={() => {}}
        />,
      );

      // Check that title field exists with label and correct value
      const titleLabel = screen.getByLabelText(/title/i);
      expect(titleLabel).toBeInTheDocument();
      const titleInput = screen.getByDisplayValue("title");
      expect(titleInput).toBeInTheDocument();

      // Check that notes field exists with label and correct value
      const notesLabel = screen.getByLabelText(/notes/i);
      expect(notesLabel).toBeInTheDocument();
      const notesInput = screen.getByDisplayValue("notes");
      expect(notesInput).toBeInTheDocument();

      // Check that plotLine field exists with label and correct value
      const plotLineLabel = screen.getByLabelText(/plot line/i);
      expect(plotLineLabel).toBeInTheDocument();
      const plotLineInput = screen.getByDisplayValue("plotLine");
      expect(plotLineInput).toBeInTheDocument();
    });
  });

  describe("Rendering with mockEmptyTurningPoint", () => {
    it("should render title, notes, and plotLine fields with labels and empty text fields", () => {
      renderWithProviders(
        <TurningPointModal
          show={true}
          turningPoint={mockEmptyTurningPoint}
          onClose={() => {}}
          onSave={() => {}}
        />,
      );

      // Check that title field exists with label and empty value
      const titleLabel = screen.getByLabelText(/title/i);
      expect(titleLabel).toBeInTheDocument();
      const titleInput = screen.getByLabelText(/title/i);
      expect(titleInput).toHaveValue("");

      // Check that notes field exists with label and empty value
      const notesLabel = screen.getByLabelText(/notes/i);
      expect(notesLabel).toBeInTheDocument();
      const notesInput = screen.getByLabelText(/notes/i);
      expect(notesInput).toHaveValue("");

      // Check that plotLine field exists with label and empty value
      const plotLineLabel = screen.getByLabelText(/plot line/i);
      expect(plotLineLabel).toBeInTheDocument();
      const plotLineInput = screen.getByLabelText(/plot line/i);
      expect(plotLineInput).toHaveValue("");
    });
  });

  describe("Event Handler Tests", () => {
    it("should trigger save onBlur for title field", async () => {
      const mockSave = vi.fn();
      renderWithProviders(
        <TurningPointModal
          show={true}
          turningPoint={mockTurningPoint}
          onClose={() => {}}
          onSave={mockSave}
        />,
      );

      const titleInput = screen.getByLabelText(/title/i);
      fireEvent.blur(titleInput);

      expect(mockSave).toHaveBeenCalledTimes(1);
    });

    it("should trigger save onBlur for plotLine field", async () => {
      const mockSave = vi.fn();
      renderWithProviders(
        <TurningPointModal
          show={true}
          turningPoint={mockTurningPoint}
          onClose={() => {}}
          onSave={mockSave}
        />,
      );

      const plotLineInput = screen.getByLabelText(/plot line/i);
      fireEvent.blur(plotLineInput);

      expect(mockSave).toHaveBeenCalledTimes(1);
    });

    it("should trigger save onBlur for notes field", async () => {
      const mockSave = vi.fn();
      renderWithProviders(
        <TurningPointModal
          show={true}
          turningPoint={mockTurningPoint}
          onClose={() => {}}
          onSave={mockSave}
        />,
      );

      const notesInput = screen.getByLabelText(/notes/i);
      fireEvent.blur(notesInput);

      expect(mockSave).toHaveBeenCalledTimes(1);
    });

    it("should trigger save onKeyDown Enter for title field", async () => {
      const mockSave = vi.fn();
      renderWithProviders(
        <TurningPointModal
          show={true}
          turningPoint={mockTurningPoint}
          onClose={() => {}}
          onSave={mockSave}
        />,
      );

      const titleInput = screen.getByLabelText(/title/i);
      fireEvent.keyDown(titleInput, { key: "Enter", code: "Enter" });

      expect(mockSave).toHaveBeenCalledTimes(1);
    });

    it("should trigger save onKeyDown Enter for plotLine field", async () => {
      const mockSave = vi.fn();
      renderWithProviders(
        <TurningPointModal
          show={true}
          turningPoint={mockTurningPoint}
          onClose={() => {}}
          onSave={mockSave}
        />,
      );

      const plotLineInput = screen.getByLabelText(/plot line/i);
      fireEvent.keyDown(plotLineInput, { key: "Enter", code: "Enter" });

      expect(mockSave).toHaveBeenCalledTimes(1);
    });

    it("should trigger save onKeyDown Enter for notes field", async () => {
      const mockSave = vi.fn();
      renderWithProviders(
        <TurningPointModal
          show={true}
          turningPoint={mockTurningPoint}
          onClose={() => {}}
          onSave={mockSave}
        />,
      );

      const notesInput = screen.getByLabelText(/notes/i);
      fireEvent.keyDown(notesInput, { key: "Enter", code: "Enter" });

      expect(mockSave).toHaveBeenCalledTimes(1);
    });

    it("should not trigger save onKeyDown for non-Enter keys", async () => {
      const mockSave = vi.fn();
      renderWithProviders(
        <TurningPointModal
          show={true}
          turningPoint={mockTurningPoint}
          onClose={() => {}}
          onSave={mockSave}
        />,
      );

      const titleInput = screen.getByLabelText(/title/i);
      fireEvent.keyDown(titleInput, { key: "Escape", code: "Escape" });

      expect(mockSave).not.toHaveBeenCalled();
    });
  });

  describe("Validation Tests", () => {
    it("should enforce 100 character limit for title field", () => {
      const mockSave = vi.fn();
      renderWithProviders(
        <TurningPointModal
          show={true}
          turningPoint={mockEmptyTurningPoint}
          onClose={() => {}}
          onSave={mockSave}
        />,
      );

      const titleInput = screen.getByLabelText(/title/i);
      const longTitle = "a".repeat(101);

      // Set value directly to test maxLength attribute
      fireEvent.change(titleInput, { target: { value: longTitle } });

      // Should not exceed max length - the input should have max 100 chars
      expect(titleInput).toHaveValue(longTitle.slice(0, 100));
    });

    it("should enforce 200 character limit for plotLine field", () => {
      const mockSave = vi.fn();
      renderWithProviders(
        <TurningPointModal
          show={true}
          turningPoint={mockEmptyTurningPoint}
          onClose={() => {}}
          onSave={mockSave}
        />,
      );

      const plotLineInput = screen.getByLabelText(/plot line/i);
      const longPlotLine = "a".repeat(201);

      // Set value directly to test maxLength attribute
      fireEvent.change(plotLineInput, { target: { value: longPlotLine } });

      // Should not exceed max length - the input should have max 200 chars
      expect(plotLineInput).toHaveValue(longPlotLine.slice(0, 200));
    });

    it("should enforce 1000 character limit for notes field", () => {
      const mockSave = vi.fn();
      renderWithProviders(
        <TurningPointModal
          show={true}
          turningPoint={mockEmptyTurningPoint}
          onClose={() => {}}
          onSave={mockSave}
        />,
      );

      const notesInput = screen.getByLabelText(/notes/i);
      const longNotes = "a".repeat(1001);

      // Set value directly to test maxLength attribute
      fireEvent.change(notesInput, { target: { value: longNotes } });

      // Should not exceed max length - the input should have max 1000 chars
      expect(notesInput).toHaveValue(longNotes.slice(0, 1000));
    });

    it("should allow valid character lengths", () => {
      const mockSave = vi.fn();
      renderWithProviders(
        <TurningPointModal
          show={true}
          turningPoint={mockEmptyTurningPoint}
          onClose={() => {}}
          onSave={mockSave}
        />,
      );

      const titleInput = screen.getByLabelText(/title/i);
      const plotLineInput = screen.getByLabelText(/plot line/i);
      const notesInput = screen.getByLabelText(/notes/i);

      // Test exact max lengths using direct value setting
      fireEvent.change(titleInput, { target: { value: "a".repeat(100) } });
      fireEvent.change(plotLineInput, { target: { value: "b".repeat(200) } });
      fireEvent.change(notesInput, { target: { value: "c".repeat(1000) } });

      expect(titleInput).toHaveValue("a".repeat(100));
      expect(plotLineInput).toHaveValue("b".repeat(200));
      expect(notesInput).toHaveValue("c".repeat(1000));
    });
  });

  describe("State Update Tests", () => {
    it("should update local state when title field changes", async () => {
      const mockSave = vi.fn();
      renderWithProviders(
        <TurningPointModal
          show={true}
          turningPoint={mockEmptyTurningPoint}
          onClose={() => {}}
          onSave={mockSave}
        />,
      );

      const titleInput = screen.getByLabelText(/title/i);
      const newTitle = "Update"; // Short enough to not be truncated

      // Use fireEvent.change instead of userEvent.type for more reliable testing
      fireEvent.change(titleInput, { target: { value: newTitle } });

      expect(titleInput).toHaveValue(newTitle);

      // Trigger save to verify state was updated
      fireEvent.blur(titleInput);
      expect(mockSave).toHaveBeenCalledWith(
        expect.objectContaining({
          title: newTitle,
        }),
      );
    });

    it("should update local state when plotLine field changes", async () => {
      const mockSave = vi.fn();
      renderWithProviders(
        <TurningPointModal
          show={true}
          turningPoint={mockEmptyTurningPoint}
          onClose={() => {}}
          onSave={mockSave}
        />,
      );

      const plotLineInput = screen.getByLabelText(/plot line/i);
      const newPlotLine = "Update"; // Short enough to not be truncated

      // Use fireEvent.change instead of userEvent.type for more reliable testing
      fireEvent.change(plotLineInput, { target: { value: newPlotLine } });

      expect(plotLineInput).toHaveValue(newPlotLine);

      // Trigger save to verify state was updated
      fireEvent.blur(plotLineInput);
      expect(mockSave).toHaveBeenCalledWith(
        expect.objectContaining({
          plotLine: newPlotLine,
        }),
      );
    });

    it("should update local state when notes field changes", async () => {
      const mockSave = vi.fn();
      renderWithProviders(
        <TurningPointModal
          show={true}
          turningPoint={mockEmptyTurningPoint}
          onClose={() => {}}
          onSave={mockSave}
        />,
      );

      const notesInput = screen.getByLabelText(/notes/i);
      const newNotes = "Update"; // Short enough to not be truncated

      // Use fireEvent.change instead of userEvent.type for more reliable testing
      fireEvent.change(notesInput, { target: { value: newNotes } });

      expect(notesInput).toHaveValue(newNotes);

      // Trigger save to verify state was updated
      fireEvent.blur(notesInput);
      expect(mockSave).toHaveBeenCalledWith(
        expect.objectContaining({
          notes: newNotes,
        }),
      );
    });
  });

  describe("Edge Cases and Error Conditions", () => {
    it("should handle empty fields without errors", async () => {
      const mockSave = vi.fn();
      renderWithProviders(
        <TurningPointModal
          show={true}
          turningPoint={mockEmptyTurningPoint}
          onClose={() => {}}
          onSave={mockSave}
        />,
      );

      const titleInput = screen.getByLabelText(/title/i);
      const plotLineInput = screen.getByLabelText(/plot line/i);
      const notesInput = screen.getByLabelText(/notes/i);

      // Clear all fields (they're already empty)
      fireEvent.change(titleInput, { target: { value: "" } });
      fireEvent.change(plotLineInput, { target: { value: "" } });
      fireEvent.change(notesInput, { target: { value: "" } });

      // Trigger save - should still work with empty fields
      fireEvent.blur(titleInput);
      expect(mockSave).toHaveBeenCalled();
    });

    it("should not save when validation fails", async () => {
      const mockSave = vi.fn();

      // Create a turning point with invalid lengths
      const invalidTurningPoint: TurningPoint = {
        id: 3,
        title: "a".repeat(101), // Exceeds 100 char limit
        notes: "b".repeat(1001), // Exceeds 1000 char limit
        plotLine: "c".repeat(201), // Exceeds 200 char limit
        charactersInvolved: [],
        plotPoints: [],
      };

      renderWithProviders(
        <TurningPointModal
          show={true}
          turningPoint={invalidTurningPoint}
          onClose={() => {}}
          onSave={mockSave}
        />,
      );

      const titleInput = screen.getByLabelText(/title/i);
      fireEvent.blur(titleInput);

      // Should not save due to validation failure
      expect(mockSave).not.toHaveBeenCalled();
    });

    it("should handle special characters correctly", () => {
      const mockSave = vi.fn();
      renderWithProviders(
        <TurningPointModal
          show={true}
          turningPoint={mockEmptyTurningPoint}
          onClose={() => {}}
          onSave={mockSave}
        />,
      );

      const titleInput = screen.getByLabelText(/title/i);
      const specialChars = "Title with special chars: !@#$%^&*()_+-=";

      fireEvent.change(titleInput, { target: { value: specialChars } });
      fireEvent.blur(titleInput);

      expect(mockSave).toHaveBeenCalledWith(
        expect.objectContaining({
          title: specialChars,
        }),
      );
    });

    it("should handle whitespace correctly", () => {
      const mockSave = vi.fn();
      renderWithProviders(
        <TurningPointModal
          show={true}
          turningPoint={mockEmptyTurningPoint}
          onClose={() => {}}
          onSave={mockSave}
        />,
      );

      const titleInput = screen.getByLabelText(/title/i);
      const whitespaceTitle = "   Title with spaces   ";

      fireEvent.change(titleInput, { target: { value: whitespaceTitle } });
      fireEvent.blur(titleInput);

      expect(mockSave).toHaveBeenCalledWith(
        expect.objectContaining({
          title: whitespaceTitle,
        }),
      );
    });
  });

  describe("Plot Points Display Tests", () => {
    describe("Test Case 1: View turning point plotPoints", () => {
      const mockTurningPointWithPlotPoints: TurningPoint = {
        id: 4,
        title: "title",
        notes: "notes",
        plotLine: "plotLine",
        charactersInvolved: [],
        plotPoints: ["Plot Point 1", "Plot Point 2", "Plot Point 3"],
      };

      it("should display the correct list of plotPoints", () => {
        renderWithProviders(
          <TurningPointModal
            show={true}
            turningPoint={mockTurningPointWithPlotPoints}
            onClose={() => {}}
            onSave={() => {}}
          />,
        );

        // Check that the plotPoints list is rendered
        const plotPointsList = screen.getByTestId("plot-points-list");
        expect(plotPointsList).toBeInTheDocument();

        // Check that all plotPoints are displayed
        expect(screen.getByText("Plot Point 1")).toBeInTheDocument();
        expect(screen.getByText("Plot Point 2")).toBeInTheDocument();
        expect(screen.getByText("Plot Point 3")).toBeInTheDocument();
      });

      it("should show the 'Add Plot Point' text input", () => {
        renderWithProviders(
          <TurningPointModal
            show={true}
            turningPoint={mockTurningPoint}
            onClose={() => {}}
            onSave={() => {}}
          />,
        );

        const addPlotPointInput = screen.getByLabelText(/add plot point/i);
        expect(addPlotPointInput).toBeInTheDocument();
        expect(addPlotPointInput).toBeEnabled();
      });
    });

    describe("Test Case 2: Add plotPoint to turning point", () => {
      it("should add plotPoint by clicking elsewhere on the form", async () => {
        const mockSave = vi.fn();
        renderWithProviders(
          <TurningPointModal
            show={true}
            turningPoint={mockTurningPoint}
            onClose={() => {}}
            onSave={mockSave}
          />,
        );

        const addPlotPointInput = screen.getByLabelText(/add plot point/i);

        // Type a new plotPoint name
        fireEvent.change(addPlotPointInput, {
          target: { value: "New Plot Point" },
        });

        // Click elsewhere to trigger addition
        fireEvent.blur(addPlotPointInput);

        // Verify that the new plotPoint appears in the plotPoints list
        expect(screen.getByText("New Plot Point")).toBeInTheDocument();

        // Check that the input field clears after successful addition
        expect(addPlotPointInput).toHaveValue("");

        // Verify save was called with updated plotPoints
        expect(mockSave).toHaveBeenCalledWith(
          expect.objectContaining({
            plotPoints: ["New Plot Point"],
          }),
        );
      });

      it("should add plotPoint by pressing Enter key", async () => {
        const mockSave = vi.fn();
        renderWithProviders(
          <TurningPointModal
            show={true}
            turningPoint={mockTurningPoint}
            onClose={() => {}}
            onSave={mockSave}
          />,
        );

        const addPlotPointInput = screen.getByLabelText(/add plot point/i);

        // Type a new plotPoint name
        fireEvent.change(addPlotPointInput, {
          target: { value: "Another Plot Point" },
        });

        // Press Enter to trigger addition
        fireEvent.keyDown(addPlotPointInput, { key: "Enter", code: "Enter" });

        // Verify that the new plotPoint appears in the plotPoints list
        expect(screen.getByText("Another Plot Point")).toBeInTheDocument();

        // Check that the input field clears after successful addition
        expect(addPlotPointInput).toHaveValue("");

        // Verify save was called with updated plotPoints
        expect(mockSave).toHaveBeenCalledWith(
          expect.objectContaining({
            plotPoints: ["Another Plot Point"],
          }),
        );
      });
    });

    describe("Test Case 3: Prevent duplicate plotPoints", () => {
      const mockTurningPointWithPlotPoints: TurningPoint = {
        id: 5,
        title: "title",
        notes: "notes",
        plotLine: "plotLine",
        charactersInvolved: [],
        plotPoints: ["Existing Plot Point"],
      };

      it("should not add duplicate plotPoint", async () => {
        const mockSave = vi.fn();
        renderWithProviders(
          <TurningPointModal
            show={true}
            turningPoint={mockTurningPointWithPlotPoints}
            onClose={() => {}}
            onSave={mockSave}
          />,
        );

        const addPlotPointInput = screen.getByLabelText(/add plot point/i);

        // Try to add a plotPoint that already exists
        fireEvent.change(addPlotPointInput, {
          target: { value: "Existing Plot Point" },
        });

        // Click elsewhere to trigger addition
        fireEvent.blur(addPlotPointInput);

        // Verify that the duplicate plotPoint is not added
        const plotPointItems = screen.getAllByText("Existing Plot Point");
        expect(plotPointItems).toHaveLength(1); // Only the original one

        // Verify save was not called
        expect(mockSave).not.toHaveBeenCalled();
      });
    });

    describe("Test Case 4: Prevent whitespace-only strings", () => {
      it("should not add whitespace-only strings", async () => {
        const mockSave = vi.fn();
        renderWithProviders(
          <TurningPointModal
            show={true}
            turningPoint={mockTurningPoint}
            onClose={() => {}}
            onSave={mockSave}
          />,
        );

        const addPlotPointInput = screen.getByLabelText(/add plot point/i);

        // Try to add only spaces
        fireEvent.change(addPlotPointInput, { target: { value: "   " } });

        // Trigger the blur event to test the validation
        fireEvent.blur(addPlotPointInput);

        // Verify that whitespace-only strings are not added
        expect(screen.queryByText("   ")).not.toBeInTheDocument();

        // Verify save was not called
        expect(mockSave).not.toHaveBeenCalled();
      });

      it("should not add strings with only tabs", async () => {
        const mockSave = vi.fn();
        renderWithProviders(
          <TurningPointModal
            show={true}
            turningPoint={mockTurningPoint}
            onClose={() => {}}
            onSave={mockSave}
          />,
        );

        const addPlotPointInput = screen.getByLabelText(/add plot point/i);

        // Try to add only tabs
        fireEvent.change(addPlotPointInput, { target: { value: "\t\t" } });

        // Trigger blur event to attempt addition
        fireEvent.blur(addPlotPointInput);

        // Verify that tab-only strings are not added
        expect(screen.queryByText("\t\t")).not.toBeInTheDocument();

        // Verify save was not called
        expect(mockSave).not.toHaveBeenCalled();
      });
    });

    describe("Edge Cases", () => {
      it("should handle plotPoints with special characters correctly", () => {
        const mockSave = vi.fn();
        renderWithProviders(
          <TurningPointModal
            show={true}
            turningPoint={mockTurningPoint}
            onClose={() => {}}
            onSave={mockSave}
          />,
        );

        const addPlotPointInput = screen.getByLabelText(/add plot point/i);

        // Add plotPoint with special characters using fireEvent for more reliable testing
        fireEvent.change(addPlotPointInput, {
          target: { value: "Plot-Point-1" },
        });

        // Press Enter to trigger addition using fireEvent
        fireEvent.keyDown(addPlotPointInput, { key: "Enter", code: "Enter" });

        // Verify that special characters are handled correctly
        expect(screen.getByText("Plot-Point-1")).toBeInTheDocument();

        expect(mockSave).toHaveBeenCalledWith(
          expect.objectContaining({
            plotPoints: ["Plot-Point-1"],
          }),
        );
      });

      it("should handle very long plotPoints", async () => {
        const mockSave = vi.fn();
        renderWithProviders(
          <TurningPointModal
            show={true}
            turningPoint={mockTurningPoint}
            onClose={() => {}}
            onSave={mockSave}
          />,
        );

        const addPlotPointInput = screen.getByLabelText(/add plot point/i);

        // Create a very long plotPoint name
        const longPlotPoint = "Very Long Plot Point Name " + "X".repeat(100);

        fireEvent.change(addPlotPointInput, {
          target: { value: longPlotPoint },
        });

        // Press Enter to trigger addition
        fireEvent.keyDown(addPlotPointInput, { key: "Enter", code: "Enter" });

        // Verify that long names are displayed properly
        expect(screen.getByText(longPlotPoint)).toBeInTheDocument();

        expect(mockSave).toHaveBeenCalledWith(
          expect.objectContaining({
            plotPoints: [longPlotPoint],
          }),
        );
      });

      it("should handle quickly adding multiple plotPoints in succession", async () => {
        const mockSave = vi.fn();
        renderWithProviders(
          <TurningPointModal
            show={true}
            turningPoint={mockTurningPoint}
            onClose={() => {}}
            onSave={mockSave}
          />,
        );

        const addPlotPointInput = screen.getByLabelText(/add plot point/i);

        // Quickly add multiple plotPoints
        fireEvent.change(addPlotPointInput, {
          target: { value: "Plot Point 1" },
        });
        fireEvent.keyDown(addPlotPointInput, { key: "Enter", code: "Enter" });

        fireEvent.change(addPlotPointInput, {
          target: { value: "Plot Point 2" },
        });
        fireEvent.keyDown(addPlotPointInput, { key: "Enter", code: "Enter" });

        fireEvent.change(addPlotPointInput, {
          target: { value: "Plot Point 3" },
        });
        fireEvent.keyDown(addPlotPointInput, { key: "Enter", code: "Enter" });

        // Verify that all plotPoints are added correctly
        expect(screen.getByText("Plot Point 1")).toBeInTheDocument();
        expect(screen.getByText("Plot Point 2")).toBeInTheDocument();
        expect(screen.getByText("Plot Point 3")).toBeInTheDocument();

        // Verify save was called multiple times with correct data
        expect(mockSave).toHaveBeenCalledTimes(3);

        // Check final state
        expect(mockSave).toHaveBeenLastCalledWith(
          expect.objectContaining({
            plotPoints: ["Plot Point 1", "Plot Point 2", "Plot Point 3"],
          }),
        );
      });
    });
  });

  describe("Character List Display Tests", () => {
    describe("Test Case 1: View turning point characters", () => {
      it("should display the correct list of characters", () => {
        renderWithProviders(
          <TurningPointModal
            show={true}
            turningPoint={mockTurningPointWithCharacters}
            onClose={() => {}}
            onSave={() => {}}
          />,
        );

        // Check that the character list is rendered
        const characterList = screen.getByTestId("characters-involved-list");
        expect(characterList).toBeInTheDocument();

        // Check that all characters are displayed
        expect(screen.getByText("Alice")).toBeInTheDocument();
        expect(screen.getByText("Bob")).toBeInTheDocument();
        expect(screen.getByText("Charlie")).toBeInTheDocument();
      });

      it("should show the 'Add Character' text input", () => {
        renderWithProviders(
          <TurningPointModal
            show={true}
            turningPoint={mockTurningPoint}
            onClose={() => {}}
            onSave={() => {}}
          />,
        );

        const addCharacterInput = screen.getByLabelText(/add character/i);
        expect(addCharacterInput).toBeInTheDocument();
        expect(addCharacterInput).toBeEnabled();
      });
    });

    describe("Test Case 2: Auto-complete character names", () => {
      it("should trigger auto-complete when typing 2+ characters", async () => {
        renderWithProviders(
          <TurningPointModal
            show={true}
            turningPoint={mockTurningPoint}
            onClose={() => {}}
            onSave={() => {}}
          />,
          {
            preloadedState: {
              adventure: {
                adventures: [mockAdventure],
                selectedAdventureId: 1,
              },
            },
          },
        );

        const addCharacterInput = screen.getByLabelText(/add character/i);

        // Type 2 characters to trigger auto-complete
        fireEvent.change(addCharacterInput, { target: { value: "Al" } });

        // Check that auto-complete dropdown appears
        const autoCompleteDropdown = screen.getByTestId(
          "character-auto-complete",
        );
        expect(autoCompleteDropdown).toBeInTheDocument();

        // Check that matching characters are shown
        expect(screen.getByText("Alice")).toBeInTheDocument();
        expect(screen.queryByText("Bob")).not.toBeInTheDocument();
      });

      it("should not show auto-complete for single character input", async () => {
        renderWithProviders(
          <TurningPointModal
            show={true}
            turningPoint={mockTurningPoint}
            onClose={() => {}}
            onSave={() => {}}
          />,
          {
            preloadedState: {
              adventure: {
                adventures: [mockAdventure],
                selectedAdventureId: 1,
              },
            },
          },
        );

        const addCharacterInput = screen.getByLabelText(/add character/i);

        // Type only 1 character
        fireEvent.change(addCharacterInput, { target: { value: "A" } });

        // Check that auto-complete dropdown does not appear
        expect(
          screen.queryByTestId("character-auto-complete"),
        ).not.toBeInTheDocument();
      });

      it("should update auto-complete as user types more characters", async () => {
        renderWithProviders(
          <TurningPointModal
            show={true}
            turningPoint={mockTurningPoint}
            onClose={() => {}}
            onSave={() => {}}
          />,
          {
            preloadedState: {
              adventure: {
                adventures: [mockAdventure],
                selectedAdventureId: 1,
              },
            },
          },
        );

        const addCharacterInput = screen.getByLabelText(/add character/i);

        // Type initial characters
        fireEvent.change(addCharacterInput, { target: { value: "Al" } });

        // Should show Alice
        expect(screen.getByText("Alice")).toBeInTheDocument();

        // Type more characters to narrow down
        fireEvent.change(addCharacterInput, { target: { value: "Ali" } });

        // Should still show Alice but not other matches
        expect(screen.getByText("Alice")).toBeInTheDocument();
        expect(screen.queryByText("Charlie")).not.toBeInTheDocument();
      });
    });

    describe("Test Case 3: Add character to turning point", () => {
      it("should add character from auto-complete dropdown", async () => {
        const mockSave = vi.fn();
        renderWithProviders(
          <TurningPointModal
            show={true}
            turningPoint={mockTurningPoint}
            onClose={() => {}}
            onSave={mockSave}
          />,
          {
            preloadedState: {
              adventure: {
                adventures: [mockAdventure],
                selectedAdventureId: 1,
              },
            },
          },
        );

        const addCharacterInput = screen.getByLabelText(/add character/i);

        // Type first two characters to trigger auto-complete
        fireEvent.change(addCharacterInput, { target: { value: "Al" } });

        // Verify auto-complete dropdown appears
        const autoCompleteDropdown = screen.getByTestId(
          "character-auto-complete",
        );
        expect(autoCompleteDropdown).toBeInTheDocument();

        // Click on "Alice" from the dropdown
        const aliceOption = screen.getByText("Alice");
        fireEvent.mouseDown(aliceOption);

        // Verify that the full character name "Alice" is added, not just "Al"
        expect(screen.getByText("Alice")).toBeInTheDocument();

        // Check that the input field clears after successful addition
        expect(addCharacterInput).toHaveValue("");

        // Verify save was called with the full character name
        expect(mockSave).toHaveBeenCalledWith(
          expect.objectContaining({
            charactersInvolved: ["Alice"],
          }),
        );
      });

      it("should add character by clicking elsewhere on the form", async () => {
        const mockSave = vi.fn();
        renderWithProviders(
          <TurningPointModal
            show={true}
            turningPoint={mockTurningPoint}
            onClose={() => {}}
            onSave={mockSave}
          />,
        );

        const addCharacterInput = screen.getByLabelText(/add character/i);

        // Type a new character name
        fireEvent.change(addCharacterInput, { target: { value: "Diana" } });

        // Click elsewhere to trigger addition
        fireEvent.blur(addCharacterInput);

        // Verify that the new character appears in the characters list
        expect(screen.getByText("Diana")).toBeInTheDocument();

        // Check that the input field clears after successful addition
        expect(addCharacterInput).toHaveValue("");

        // Verify save was called with updated characters
        expect(mockSave).toHaveBeenCalledWith(
          expect.objectContaining({
            charactersInvolved: ["Diana"],
          }),
        );
      });

      it("should add character by pressing Enter key", async () => {
        const mockSave = vi.fn();
        renderWithProviders(
          <TurningPointModal
            show={true}
            turningPoint={mockTurningPoint}
            onClose={() => {}}
            onSave={mockSave}
          />,
        );

        const addCharacterInput = screen.getByLabelText(/add character/i);

        // Type a new character name
        fireEvent.change(addCharacterInput, { target: { value: "Eve" } });

        // Press Enter to trigger addition
        fireEvent.keyDown(addCharacterInput, { key: "Enter", code: "Enter" });

        // Verify that the new character appears in the characters list
        expect(screen.getByText("Eve")).toBeInTheDocument();

        // Check that the input field clears after successful addition
        expect(addCharacterInput).toHaveValue("");

        // Verify save was called with updated characters
        expect(mockSave).toHaveBeenCalledWith(
          expect.objectContaining({
            charactersInvolved: ["Eve"],
          }),
        );
      });
    });

    describe("Test Case 4: Prevent duplicate characters", () => {
      it("should not add duplicate character", async () => {
        const mockSave = vi.fn();
        renderWithProviders(
          <TurningPointModal
            show={true}
            turningPoint={mockTurningPointWithCharacters}
            onClose={() => {}}
            onSave={mockSave}
          />,
        );

        const addCharacterInput = screen.getByLabelText(/add character/i);

        // Try to add a character that already exists
        fireEvent.change(addCharacterInput, { target: { value: "Alice" } });

        // Click elsewhere to trigger addition
        fireEvent.blur(addCharacterInput);

        // Verify that the duplicate character is not added
        const characterItems = screen.getAllByText("Alice");
        expect(characterItems).toHaveLength(1); // Only the original one

        // Verify save was not called
        expect(mockSave).not.toHaveBeenCalled();
      });
    });

    describe("Test Case 5: Prevent whitespace-only strings", () => {
      it("should not add whitespace-only strings", async () => {
        const mockSave = vi.fn();
        renderWithProviders(
          <TurningPointModal
            show={true}
            turningPoint={mockTurningPoint}
            onClose={() => {}}
            onSave={mockSave}
          />,
        );

        const addCharacterInput = screen.getByLabelText(/add character/i);

        // Try to add only spaces
        fireEvent.change(addCharacterInput, { target: { value: "   " } });

        // Trigger the blur event to test the validation
        fireEvent.blur(addCharacterInput);

        // Verify that whitespace-only strings are not added
        expect(screen.queryByText("   ")).not.toBeInTheDocument();

        // Verify save was not called
        expect(mockSave).not.toHaveBeenCalled();

        // Note: Focus behavior is harder to test with fireEvent, but the main functionality works
        // The component logic prevents whitespace-only strings from being added
      });

      it("should not add strings with only tabs", async () => {
        const mockSave = vi.fn();
        renderWithProviders(
          <TurningPointModal
            show={true}
            turningPoint={mockTurningPoint}
            onClose={() => {}}
            onSave={mockSave}
          />,
        );

        const addCharacterInput = screen.getByLabelText(/add character/i);

        // Try to add only tabs
        fireEvent.change(addCharacterInput, { target: { value: "\t\t" } });

        // Trigger blur event to attempt addition
        fireEvent.blur(addCharacterInput);

        // Verify that tab-only strings are not added
        expect(screen.queryByText("\t\t")).not.toBeInTheDocument();

        // Verify save was not called
        expect(mockSave).not.toHaveBeenCalled();
      });
    });

    describe("Edge Cases", () => {
      describe("Test Case 6: Empty adventure character list", () => {
        it("should handle auto-complete when no characters exist in adventure", async () => {
          const emptyAdventure: Adventure = {
            id: 2,
            title: "Empty Adventure",
            description: "No characters",
            characters: [],
            plotLines: [],
            themes: [],
            notes: "",
            turningPoints: [],
          };

          renderWithProviders(
            <TurningPointModal
              show={true}
              turningPoint={mockTurningPoint}
              onClose={() => {}}
              onSave={() => {}}
            />,
            {
              preloadedState: {
                adventure: {
                  adventures: [emptyAdventure],
                  selectedAdventureId: 2,
                },
              },
            },
          );

          const addCharacterInput = screen.getByLabelText(/add character/i);

          // Type characters to trigger auto-complete
          fireEvent.change(addCharacterInput, { target: { value: "Al" } });

          // When no characters exist in adventure, auto-complete should not appear
          expect(
            screen.queryByTestId("character-auto-complete"),
          ).not.toBeInTheDocument();
        });
      });

      describe("Test Case 7: Special characters in names", () => {
        it("should handle characters with special characters correctly", () => {
          const mockSave = vi.fn();
          renderWithProviders(
            <TurningPointModal
              show={true}
              turningPoint={mockTurningPoint}
              onClose={() => {}}
              onSave={mockSave}
            />,
          );

          const addCharacterInput = screen.getByLabelText(/add character/i);

          // Add character with special characters using fireEvent for more reliable testing
          fireEvent.change(addCharacterInput, { target: { value: "O'Brien" } });

          // Press Enter to trigger addition using fireEvent
          fireEvent.keyDown(addCharacterInput, { key: "Enter", code: "Enter" });

          // Verify that special characters are handled correctly
          expect(screen.getByText("O'Brien")).toBeInTheDocument();

          expect(mockSave).toHaveBeenCalledWith(
            expect.objectContaining({
              charactersInvolved: ["O'Brien"],
            }),
          );
        });

        it("should handle characters with hyphens", () => {
          const mockSave = vi.fn();
          renderWithProviders(
            <TurningPointModal
              show={true}
              turningPoint={mockTurningPoint}
              onClose={() => {}}
              onSave={mockSave}
            />,
          );

          const addCharacterInput = screen.getByLabelText(/add character/i);

          // Add character with hyphen using fireEvent for more reliable testing
          fireEvent.change(addCharacterInput, {
            target: { value: "Mary-Jane" },
          });

          // Press Enter to trigger addition using fireEvent
          fireEvent.keyDown(addCharacterInput, { key: "Enter", code: "Enter" });

          // Verify that hyphens are handled correctly
          expect(screen.getByText("Mary-Jane")).toBeInTheDocument();

          expect(mockSave).toHaveBeenCalledWith(
            expect.objectContaining({
              charactersInvolved: ["Mary-Jane"],
            }),
          );
        });
      });

      describe("Test Case 8: Maximum character limit", () => {
        it("should handle very long character names", async () => {
          const mockSave = vi.fn();
          renderWithProviders(
            <TurningPointModal
              show={true}
              turningPoint={mockTurningPoint}
              onClose={() => {}}
              onSave={mockSave}
            />,
          );

          const addCharacterInput = screen.getByLabelText(/add character/i);

          // Create a very long character name
          const longName = "Very Long Character Name " + "X".repeat(100);

          fireEvent.change(addCharacterInput, { target: { value: longName } });

          // Press Enter to trigger addition
          fireEvent.keyDown(addCharacterInput, { key: "Enter", code: "Enter" });

          // Verify that long names are displayed properly
          expect(screen.getByText(longName)).toBeInTheDocument();

          expect(mockSave).toHaveBeenCalledWith(
            expect.objectContaining({
              charactersInvolved: [longName],
            }),
          );
        });
      });

      describe("Test Case 10: Multiple rapid additions", () => {
        it("should handle quickly adding multiple characters in succession", async () => {
          const mockSave = vi.fn();
          renderWithProviders(
            <TurningPointModal
              show={true}
              turningPoint={mockTurningPoint}
              onClose={() => {}}
              onSave={mockSave}
            />,
          );

          const addCharacterInput = screen.getByLabelText(/add character/i);

          // Quickly add multiple characters
          fireEvent.change(addCharacterInput, { target: { value: "Frank" } });
          fireEvent.keyDown(addCharacterInput, { key: "Enter", code: "Enter" });

          fireEvent.change(addCharacterInput, { target: { value: "Grace" } });
          fireEvent.keyDown(addCharacterInput, { key: "Enter", code: "Enter" });

          fireEvent.change(addCharacterInput, { target: { value: "Henry" } });
          fireEvent.keyDown(addCharacterInput, { key: "Enter", code: "Enter" });

          // Verify that all characters are added correctly
          expect(screen.getByText("Frank")).toBeInTheDocument();
          expect(screen.getByText("Grace")).toBeInTheDocument();
          expect(screen.getByText("Henry")).toBeInTheDocument();

          // Verify save was called multiple times with correct data
          expect(mockSave).toHaveBeenCalledTimes(3);

          // Check final state
          expect(mockSave).toHaveBeenLastCalledWith(
            expect.objectContaining({
              charactersInvolved: ["Frank", "Grace", "Henry"],
            }),
          );
        });
      });
    });
  });
});
