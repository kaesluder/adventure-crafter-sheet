import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders, userEvent } from "../test/utils";
import type { TurningPoint } from "../types/Adventure";
import TurningPointModal from "./TurningPointModal";

const mockTurningPoint: TurningPoint = {
  id: 1,
  title: "title",
  notes: "notes",
  plotLine: "plotLine",
  charactersInvolved: [],
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
      await userEvent.clear(titleInput);
      await userEvent.clear(plotLineInput);
      await userEvent.clear(notesInput);

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
});
