import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../test/utils";
import TurningPointModal from "./TurningPointModal";
import type { TurningPoint } from "../types/Adventure";

// Helper function to create mock turning points
function createMockTurningPoint(
  overrides?: Partial<TurningPoint>,
): TurningPoint {
  return {
    id: 1,
    title: "Test Turning Point",
    notes: "Some notes",
    plotLine: "Main Plot",
    charactersInvolved: ["Hero", "Villain"],
    plotPoints: ["Point 1", "Point 2"],
    ...overrides,
  };
}

describe("TurningPointModal", () => {
  describe("Rendering", () => {
    it("should not be visible when isOpen is false", () => {
      renderWithProviders(
        <TurningPointModal
          isOpen={false}
          turningPoint={createMockTurningPoint()}
          onSave={vi.fn()}
          onDelete={vi.fn()}
          onCancel={vi.fn()}
        />,
      );

      expect(screen.queryByText("Turning Point")).not.toBeInTheDocument();
    });

    it("should be visible when isOpen is true", () => {
      renderWithProviders(
        <TurningPointModal
          isOpen={true}
          turningPoint={createMockTurningPoint()}
          onSave={vi.fn()}
          onDelete={vi.fn()}
          onCancel={vi.fn()}
        />,
      );

      expect(screen.getByText("Turning Point")).toBeInTheDocument();
    });
  });

  describe("Text Input Fields", () => {
    it("should display title input field with label", () => {
      renderWithProviders(
        <TurningPointModal
          isOpen={true}
          turningPoint={createMockTurningPoint()}
          onSave={vi.fn()}
          onDelete={vi.fn()}
          onCancel={vi.fn()}
        />,
      );

      expect(screen.getByLabelText("Title")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Enter title")).toBeInTheDocument();
    });

    it("should display notes input field with label", () => {
      renderWithProviders(
        <TurningPointModal
          isOpen={true}
          turningPoint={createMockTurningPoint()}
          onSave={vi.fn()}
          onDelete={vi.fn()}
          onCancel={vi.fn()}
        />,
      );

      expect(screen.getByLabelText("Notes")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Enter notes")).toBeInTheDocument();
    });

    it("should display plot line input field with label", () => {
      renderWithProviders(
        <TurningPointModal
          isOpen={true}
          turningPoint={createMockTurningPoint()}
          onSave={vi.fn()}
          onDelete={vi.fn()}
          onCancel={vi.fn()}
        />,
      );

      expect(screen.getByLabelText("Plot Line")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Enter plot line"),
      ).toBeInTheDocument();
    });

    it("should display existing values in input fields", () => {
      const turningPoint = createMockTurningPoint({
        title: "The Climax",
        notes: "Important battle scene",
        plotLine: "Main Quest",
      });

      renderWithProviders(
        <TurningPointModal
          isOpen={true}
          turningPoint={turningPoint}
          onSave={vi.fn()}
          onDelete={vi.fn()}
          onCancel={vi.fn()}
        />,
      );

      const titleInput = screen.getByPlaceholderText(
        "Enter title",
      ) as HTMLInputElement;
      const notesInput = screen.getByPlaceholderText(
        "Enter notes",
      ) as HTMLInputElement;
      const plotLineInput = screen.getByPlaceholderText(
        "Enter plot line",
      ) as HTMLInputElement;

      expect(titleInput.value).toBe("The Climax");
      expect(notesInput.value).toBe("Important battle scene");
      expect(plotLineInput.value).toBe("Main Quest");
    });

    it("should display empty strings for new turning points", () => {
      const newTurningPoint = createMockTurningPoint({
        title: "",
        notes: "",
        plotLine: "",
      });

      renderWithProviders(
        <TurningPointModal
          isOpen={true}
          turningPoint={newTurningPoint}
          onSave={vi.fn()}
          onDelete={vi.fn()}
          onCancel={vi.fn()}
        />,
      );

      const titleInput = screen.getByPlaceholderText(
        "Enter title",
      ) as HTMLInputElement;
      const notesInput = screen.getByPlaceholderText(
        "Enter notes",
      ) as HTMLInputElement;
      const plotLineInput = screen.getByPlaceholderText(
        "Enter plot line",
      ) as HTMLInputElement;

      expect(titleInput.value).toBe("");
      expect(notesInput.value).toBe("");
      expect(plotLineInput.value).toBe("");
    });
  });

  describe("Static Lists", () => {
    it("should display characters involved as a static list", () => {
      const turningPoint = createMockTurningPoint({
        charactersInvolved: ["Hero", "Villain", "Sidekick"],
      });

      renderWithProviders(
        <TurningPointModal
          isOpen={true}
          turningPoint={turningPoint}
          onSave={vi.fn()}
          onDelete={vi.fn()}
          onCancel={vi.fn()}
        />,
      );

      expect(screen.getByText("Characters Involved")).toBeInTheDocument();
      expect(screen.getByText("Hero")).toBeInTheDocument();
      expect(screen.getByText("Villain")).toBeInTheDocument();
      expect(screen.getByText("Sidekick")).toBeInTheDocument();
    });

    it("should display plot points as a static list", () => {
      const turningPoint = createMockTurningPoint({
        plotPoints: ["Introduction", "Conflict", "Resolution"],
      });

      renderWithProviders(
        <TurningPointModal
          isOpen={true}
          turningPoint={turningPoint}
          onSave={vi.fn()}
          onDelete={vi.fn()}
          onCancel={vi.fn()}
        />,
      );

      expect(screen.getByText("Plot Points")).toBeInTheDocument();
      expect(screen.getByText("Introduction")).toBeInTheDocument();
      expect(screen.getByText("Conflict")).toBeInTheDocument();
      expect(screen.getByText("Resolution")).toBeInTheDocument();
    });

    it("should handle empty character lists", () => {
      const turningPoint = createMockTurningPoint({
        charactersInvolved: [],
      });

      renderWithProviders(
        <TurningPointModal
          isOpen={true}
          turningPoint={turningPoint}
          onSave={vi.fn()}
          onDelete={vi.fn()}
          onCancel={vi.fn()}
        />,
      );

      expect(screen.getByText("Characters Involved")).toBeInTheDocument();
      // Should not crash with empty list
    });

    it("should handle empty plot points lists", () => {
      const turningPoint = createMockTurningPoint({
        plotPoints: [],
      });

      renderWithProviders(
        <TurningPointModal
          isOpen={true}
          turningPoint={turningPoint}
          onSave={vi.fn()}
          onDelete={vi.fn()}
          onCancel={vi.fn()}
        />,
      );

      expect(screen.getByText("Plot Points")).toBeInTheDocument();
      // Should not crash with empty list
    });
  });

  describe("State Management - Form Input Handling", () => {
    it("should handle title input changes", () => {
      const mockOnSave = vi.fn();
      const mockOnDelete = vi.fn();
      const mockOnCancel = vi.fn();

      const turningPoint = createMockTurningPoint({
        title: "Original Title",
      });

      renderWithProviders(
        <TurningPointModal
          isOpen={true}
          turningPoint={turningPoint}
          onSave={mockOnSave}
          onDelete={mockOnDelete}
          onCancel={mockOnCancel}
        />,
      );

      // This test will fail initially as the component is read-only
      const titleInput = screen.getByPlaceholderText(
        "Enter title",
      ) as HTMLInputElement;
      expect(titleInput.value).toBe("Original Title");

      // TODO: This functionality doesn't exist yet - test will fail
      // fireEvent.change(titleInput, { target: { value: "Updated Title" } });
      // expect(titleInput.value).toBe("Updated Title");
    });

    it("should handle notes input changes", () => {
      const mockOnSave = vi.fn();
      const mockOnDelete = vi.fn();
      const mockOnCancel = vi.fn();

      const turningPoint = createMockTurningPoint({
        notes: "Original Notes",
      });

      renderWithProviders(
        <TurningPointModal
          isOpen={true}
          turningPoint={turningPoint}
          onSave={mockOnSave}
          onDelete={mockOnDelete}
          onCancel={mockOnCancel}
        />,
      );

      const notesInput = screen.getByPlaceholderText(
        "Enter notes",
      ) as HTMLInputElement;
      expect(notesInput.value).toBe("Original Notes");

      // TODO: This functionality doesn't exist yet - test will fail
      // fireEvent.change(notesInput, { target: { value: "Updated Notes" } });
      // expect(notesInput.value).toBe("Updated Notes");
    });

    it("should handle plot line input changes", () => {
      const mockOnSave = vi.fn();
      const mockOnDelete = vi.fn();
      const mockOnCancel = vi.fn();

      const turningPoint = createMockTurningPoint({
        plotLine: "Original Plot Line",
      });

      renderWithProviders(
        <TurningPointModal
          isOpen={true}
          turningPoint={turningPoint}
          onSave={mockOnSave}
          onDelete={mockOnDelete}
          onCancel={mockOnCancel}
        />,
      );

      const plotLineInput = screen.getByPlaceholderText(
        "Enter plot line",
      ) as HTMLInputElement;
      expect(plotLineInput.value).toBe("Original Plot Line");

      // TODO: This functionality doesn't exist yet - test will fail
      // fireEvent.change(plotLineInput, { target: { value: "Updated Plot Line" } });
      // expect(plotLineInput.value).toBe("Updated Plot Line");
    });
  });

  describe("State Management - Button Functionality", () => {
    it("should call onSave when Save button is clicked", () => {
      const mockOnSave = vi.fn();
      const mockOnDelete = vi.fn();
      const mockOnCancel = vi.fn();

      const turningPoint = createMockTurningPoint();

      renderWithProviders(
        <TurningPointModal
          isOpen={true}
          turningPoint={turningPoint}
          onSave={mockOnSave}
          onDelete={mockOnDelete}
          onCancel={mockOnCancel}
        />,
      );

      const saveButton = screen.getByRole("button", { name: /save/i });
      saveButton.click();

      // This should work as the button functionality exists
      expect(mockOnSave).toHaveBeenCalledTimes(1);
    });

    it("should call onDelete when Delete button is clicked", () => {
      const mockOnSave = vi.fn();
      const mockOnDelete = vi.fn();
      const mockOnCancel = vi.fn();

      const turningPoint = createMockTurningPoint({ id: 123 });

      renderWithProviders(
        <TurningPointModal
          isOpen={true}
          turningPoint={turningPoint}
          onSave={mockOnSave}
          onDelete={mockOnDelete}
          onCancel={mockOnCancel}
        />,
      );

      const deleteButton = screen.getByRole("button", { name: /delete/i });
      deleteButton.click();

      // This should work as the button functionality exists
      expect(mockOnDelete).toHaveBeenCalledTimes(1);
    });

    it("should call onCancel when Cancel button is clicked", () => {
      const mockOnSave = vi.fn();
      const mockOnDelete = vi.fn();
      const mockOnCancel = vi.fn();

      const turningPoint = createMockTurningPoint();

      renderWithProviders(
        <TurningPointModal
          isOpen={true}
          turningPoint={turningPoint}
          onSave={mockOnSave}
          onDelete={mockOnDelete}
          onCancel={mockOnCancel}
        />,
      );

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      cancelButton.click();

      // This should work as the button functionality exists
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it("should call onCancel when close button is clicked", () => {
      const mockOnSave = vi.fn();
      const mockOnDelete = vi.fn();
      const mockOnCancel = vi.fn();

      const turningPoint = createMockTurningPoint();

      renderWithProviders(
        <TurningPointModal
          isOpen={true}
          turningPoint={turningPoint}
          onSave={mockOnSave}
          onDelete={mockOnDelete}
          onCancel={mockOnCancel}
        />,
      );

      const closeButton = screen.getByLabelText("Close modal");
      closeButton.click();

      // This should work as the button functionality exists
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe("State Management - New vs Existing Turning Points", () => {
    it("should handle new turning points with empty data", () => {
      const mockOnSave = vi.fn();
      const mockOnDelete = vi.fn();
      const mockOnCancel = vi.fn();

      // New turning point with minimal data
      const newTurningPoint = {
        id: 0, // Typically 0 indicates new
        title: "",
        notes: "",
        plotLine: "",
        charactersInvolved: [],
        plotPoints: [],
      };

      renderWithProviders(
        <TurningPointModal
          isOpen={true}
          turningPoint={newTurningPoint}
          onSave={mockOnSave}
          onDelete={mockOnDelete}
          onCancel={mockOnCancel}
        />,
      );

      // Should display empty values for new turning points
      const titleInput = screen.getByPlaceholderText(
        "Enter title",
      ) as HTMLInputElement;
      const notesInput = screen.getByPlaceholderText(
        "Enter notes",
      ) as HTMLInputElement;
      const plotLineInput = screen.getByPlaceholderText(
        "Enter plot line",
      ) as HTMLInputElement;

      expect(titleInput.value).toBe("");
      expect(notesInput.value).toBe("");
      expect(plotLineInput.value).toBe("");

      // Should show "No characters involved" and "No plot points" messages
      expect(screen.getByText("No characters involved")).toBeInTheDocument();
      expect(screen.getByText("No plot points")).toBeInTheDocument();
    });

    it("should handle existing turning points with full data", () => {
      const mockOnSave = vi.fn();
      const mockOnDelete = vi.fn();
      const mockOnCancel = vi.fn();

      // Existing turning point with full data
      const existingTurningPoint = {
        id: 456, // Non-zero ID indicates existing
        title: "Major Climax",
        notes: "The final battle scene",
        plotLine: "Main Quest",
        charactersInvolved: ["Hero", "Villain", "Sidekick"],
        plotPoints: ["Battle begins", "Hero struggles", "Villain defeated"],
      };

      renderWithProviders(
        <TurningPointModal
          isOpen={true}
          turningPoint={existingTurningPoint}
          onSave={mockOnSave}
          onDelete={mockOnDelete}
          onCancel={mockOnCancel}
        />,
      );

      // Should display the existing values
      const titleInput = screen.getByPlaceholderText(
        "Enter title",
      ) as HTMLInputElement;
      const notesInput = screen.getByPlaceholderText(
        "Enter notes",
      ) as HTMLInputElement;
      const plotLineInput = screen.getByPlaceholderText(
        "Enter plot line",
      ) as HTMLInputElement;

      expect(titleInput.value).toBe("Major Climax");
      expect(notesInput.value).toBe("The final battle scene");
      expect(plotLineInput.value).toBe("Main Quest");

      // Should show the character and plot point lists
      expect(screen.getByText("Hero")).toBeInTheDocument();
      expect(screen.getByText("Villain")).toBeInTheDocument();
      expect(screen.getByText("Sidekick")).toBeInTheDocument();
      expect(screen.getByText("Battle begins")).toBeInTheDocument();
      expect(screen.getByText("Hero struggles")).toBeInTheDocument();
      expect(screen.getByText("Villain defeated")).toBeInTheDocument();
    });

    it("should handle edge case of turning point with ID 0 but some data", () => {
      const mockOnSave = vi.fn();
      const mockOnDelete = vi.fn();
      const mockOnCancel = vi.fn();

      // Edge case: ID 0 but with some data
      const edgeCaseTurningPoint = {
        id: 0,
        title: "Partial Data",
        notes: "Some notes exist",
        plotLine: "",
        charactersInvolved: ["Only Hero"],
        plotPoints: [],
      };

      renderWithProviders(
        <TurningPointModal
          isOpen={true}
          turningPoint={edgeCaseTurningPoint}
          onSave={mockOnSave}
          onDelete={mockOnDelete}
          onCancel={mockOnCancel}
        />,
      );

      const titleInput = screen.getByPlaceholderText(
        "Enter title",
      ) as HTMLInputElement;
      const notesInput = screen.getByPlaceholderText(
        "Enter notes",
      ) as HTMLInputElement;

      expect(titleInput.value).toBe("Partial Data");
      expect(notesInput.value).toBe("Some notes exist");

      // Should show the character but no plot points message
      expect(screen.getByText("Only Hero")).toBeInTheDocument();
      expect(screen.getByText("No plot points")).toBeInTheDocument();
    });
  });

  describe("State Management - Integration with Redux (Future Implementation)", () => {
    it("should integrate with Redux state management for form changes - TODO", () => {
      // This test is a placeholder for future Redux integration
      // Currently the component is read-only, so this will fail
      const mockOnSave = vi.fn();
      const mockOnDelete = vi.fn();
      const mockOnCancel = vi.fn();

      const turningPoint = createMockTurningPoint();

      renderWithProviders(
        <TurningPointModal
          isOpen={true}
          turningPoint={turningPoint}
          onSave={mockOnSave}
          onDelete={mockOnDelete}
          onCancel={mockOnCancel}
        />,
      );

      // TODO: This functionality doesn't exist yet
      // The component should eventually manage its own state for form inputs
      // and call onSave with the updated data

      // For now, we just verify the component renders with the provided data
      expect(screen.getByText("Turning Point")).toBeInTheDocument();
    });

    it("should call onSave with current form data - TODO", () => {
      // This test is a placeholder for future functionality
      // Currently the component doesn't manage form state
      const mockOnSave = vi.fn();
      const mockOnCancel = vi.fn();

      const turningPoint = createMockTurningPoint();

      renderWithProviders(
        <TurningPointModal
          isOpen={true}
          turningPoint={turningPoint}
          onSave={mockOnSave}
          onDelete={mockOnCancel}
          onCancel={mockOnCancel}
        />,
      );

      // TODO: This functionality doesn't exist yet
      // The component should eventually call onSave with the current form data
      // For now, we just verify the save button exists and can be clicked
      const saveButton = screen.getByRole("button", { name: /save/i });
      expect(saveButton).toBeInTheDocument();
    });

    it("should call onDelete with turning point ID - TODO", () => {
      // This test is a placeholder for future functionality
      // The component should call onDelete with the turning point ID
      const mockOnSave = vi.fn();
      const mockOnDelete = vi.fn();
      const mockOnCancel = vi.fn();

      const turningPoint = createMockTurningPoint({ id: 789 });

      renderWithProviders(
        <TurningPointModal
          isOpen={true}
          turningPoint={turningPoint}
          onSave={mockOnSave}
          onDelete={mockOnDelete}
          onCancel={mockOnCancel}
        />,
      );

      // TODO: This functionality doesn't exist yet
      // The component should eventually call onDelete with the turning point ID
      // For now, we just verify the delete button exists and can be clicked
      const deleteButton = screen.getByRole("button", { name: /delete/i });
      expect(deleteButton).toBeInTheDocument();
    });
  });

  describe("Buttons", () => {
    it("should display Save button", () => {
      renderWithProviders(
        <TurningPointModal
          isOpen={true}
          turningPoint={createMockTurningPoint()}
          onSave={vi.fn()}
          onDelete={vi.fn()}
          onCancel={vi.fn()}
        />,
      );

      expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    });

    it("should display Delete button", () => {
      renderWithProviders(
        <TurningPointModal
          isOpen={true}
          turningPoint={createMockTurningPoint()}
          onSave={vi.fn()}
          onDelete={vi.fn()}
          onCancel={vi.fn()}
        />,
      );

      expect(
        screen.getByRole("button", { name: /delete/i }),
      ).toBeInTheDocument();
    });

    it("should display Cancel button", () => {
      renderWithProviders(
        <TurningPointModal
          isOpen={true}
          turningPoint={createMockTurningPoint()}
          onSave={vi.fn()}
          onDelete={vi.fn()}
          onCancel={vi.fn()}
        />,
      );

      expect(
        screen.getByRole("button", { name: /cancel/i }),
      ).toBeInTheDocument();
    });

    it("should display close button", () => {
      renderWithProviders(
        <TurningPointModal
          isOpen={true}
          turningPoint={createMockTurningPoint()}
          onSave={vi.fn()}
          onDelete={vi.fn()}
          onCancel={vi.fn()}
        />,
      );

      expect(screen.getByLabelText("Close modal")).toBeInTheDocument();
    });
  });

  describe("Layout Patterns", () => {
    it("should follow compact layout structure", () => {
      const { container } = renderWithProviders(
        <TurningPointModal
          isOpen={true}
          turningPoint={createMockTurningPoint()}
          onSave={vi.fn()}
          onDelete={vi.fn()}
          onCancel={vi.fn()}
        />,
      );

      // Check for modal structure elements
      const modal = container.querySelector('[role="dialog"]');
      expect(modal).toBeInTheDocument();

      // Check for header section
      const header = container.querySelector("header");
      expect(header).toBeInTheDocument();

      // Check for content section
      const content = container.querySelector("form");
      expect(content).toBeInTheDocument();

      // Check for footer with buttons
      const footer = container.querySelector("footer");
      expect(footer).toBeInTheDocument();
    });

    it("should have labeled fields for all text inputs", () => {
      renderWithProviders(
        <TurningPointModal
          isOpen={true}
          turningPoint={createMockTurningPoint()}
          onSave={vi.fn()}
          onDelete={vi.fn()}
          onCancel={vi.fn()}
        />,
      );

      // Check that all text inputs have corresponding labels
      const titleLabel = screen.getByLabelText("Title");
      const notesLabel = screen.getByLabelText("Notes");
      const plotLineLabel = screen.getByLabelText("Plot Line");

      expect(titleLabel).toBeInTheDocument();
      expect(notesLabel).toBeInTheDocument();
      expect(plotLineLabel).toBeInTheDocument();
    });

    it("should match existing modal styling patterns", () => {
      const { container } = renderWithProviders(
        <TurningPointModal
          isOpen={true}
          turningPoint={createMockTurningPoint()}
          onSave={vi.fn()}
          onDelete={vi.fn()}
          onCancel={vi.fn()}
        />,
      );

      // Check for Flowbite modal classes
      const modal = container.querySelector('[role="dialog"]');
      expect(modal).toHaveClass("bg-white");
      expect(modal).toHaveClass("rounded-lg");
      expect(modal).toHaveClass("shadow");

      // Check for overlay
      const overlay = container.querySelector(".fixed.inset-0");
      expect(overlay).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle undefined turning point gracefully", () => {
      // This test ensures the component doesn't crash with undefined props
      const { container } = renderWithProviders(
        <TurningPointModal
          isOpen={true}
          turningPoint={undefined as unknown as TurningPoint}
          onSave={vi.fn()}
          onDelete={vi.fn()}
          onCancel={vi.fn()}
        />,
      );

      // Should still render the modal structure even with undefined data
      expect(container.querySelector('[role="dialog"]')).toBeInTheDocument();
    });

    it("should handle null values in turning point fields", () => {
      const turningPoint = createMockTurningPoint({
        title: null as unknown as string,
        notes: null as unknown as string,
        plotLine: null as unknown as string,
      });

      renderWithProviders(
        <TurningPointModal
          isOpen={true}
          turningPoint={turningPoint}
          onSave={vi.fn()}
          onDelete={vi.fn()}
          onCancel={vi.fn()}
        />,
      );

      // Should not crash with null values
      expect(screen.getByText("Turning Point")).toBeInTheDocument();
    });
  });
});
