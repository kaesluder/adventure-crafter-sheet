import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../test/utils";
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
        <TurningPointModal show={true} turningPoint={mockTurningPoint} />,
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
        <TurningPointModal show={true} turningPoint={mockEmptyTurningPoint} />,
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
});
