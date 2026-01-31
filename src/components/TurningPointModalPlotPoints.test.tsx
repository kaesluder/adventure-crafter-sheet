import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../test/utils";
import type { TurningPoint } from "../types/Adventure";
import TurningPointModalPlotPoints from "./TurningPointModalPlotPoints";

const mockTurningPoint: TurningPoint = {
  id: 1,
  title: "title",
  notes: "notes",
  plotLine: "plotLine",
  charactersInvolved: [],
  plotPoints: [],
};

const mockTurningPointWithPlotPoints: TurningPoint = {
  id: 4,
  title: "title",
  notes: "notes",
  plotLine: "plotLine",
  charactersInvolved: [],
  plotPoints: ["Plot Point 1", "Plot Point 2", "Plot Point 3"],
};

const mockTurningPointWithExistingPlotPoint: TurningPoint = {
  id: 5,
  title: "title",
  notes: "notes",
  plotLine: "plotLine",
  charactersInvolved: [],
  plotPoints: ["Existing Plot Point"],
};

describe("TurningPointModalPlotPoints", () => {
  describe("Rendering", () => {
    it("should display the correct list of plotPoints", () => {
      renderWithProviders(
        <TurningPointModalPlotPoints
          plotPoints={mockTurningPointWithPlotPoints.plotPoints}
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
        <TurningPointModalPlotPoints
          plotPoints={mockTurningPoint.plotPoints}
          onSave={() => {}}
        />,
      );

      const addPlotPointInput = screen.getByLabelText(/add plot point/i);
      expect(addPlotPointInput).toBeInTheDocument();
      expect(addPlotPointInput).toBeEnabled();
    });
  });

  describe("Add Plot Point", () => {
    it("should add plotPoint by clicking elsewhere on the form", async () => {
      const mockSave = vi.fn();
      renderWithProviders(
        <TurningPointModalPlotPoints
          plotPoints={mockTurningPoint.plotPoints}
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
        <TurningPointModalPlotPoints
          plotPoints={mockTurningPoint.plotPoints}
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

    it("should not add duplicate plotPoint", async () => {
      const mockSave = vi.fn();
      renderWithProviders(
        <TurningPointModalPlotPoints
          plotPoints={mockTurningPointWithExistingPlotPoint.plotPoints}
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

    it("should not add whitespace-only strings", async () => {
      const mockSave = vi.fn();
      renderWithProviders(
        <TurningPointModalPlotPoints
          plotPoints={mockTurningPoint.plotPoints}
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

    it("should handle plotPoints with special characters correctly", () => {
      const mockSave = vi.fn();
      renderWithProviders(
        <TurningPointModalPlotPoints
          plotPoints={mockTurningPoint.plotPoints}
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

    it("should handle quickly adding multiple plotPoints in succession", async () => {
      const mockSave = vi.fn();
      renderWithProviders(
        <TurningPointModalPlotPoints
          plotPoints={mockTurningPoint.plotPoints}
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

  describe("State Synchronization", () => {
    it("should sync local state when prop changes", () => {
      const mockSave = vi.fn();
      const { rerender } = renderWithProviders(
        <TurningPointModalPlotPoints
          plotPoints={["Initial Plot Point"]}
          onSave={mockSave}
        />,
      );

      // Verify initial plot point is displayed
      expect(screen.getByText("Initial Plot Point")).toBeInTheDocument();

      // Rerender with new plot points
      rerender(
        <TurningPointModalPlotPoints
          plotPoints={["Updated Plot Point 1", "Updated Plot Point 2"]}
          onSave={mockSave}
        />,
      );

      // Verify new plot points are displayed
      expect(screen.getByText("Updated Plot Point 1")).toBeInTheDocument();
      expect(screen.getByText("Updated Plot Point 2")).toBeInTheDocument();
      expect(screen.queryByText("Initial Plot Point")).not.toBeInTheDocument();
    });
  });
});
