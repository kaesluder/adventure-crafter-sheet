import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../test/utils";
import type { TurningPoint, Adventure } from "../types/Adventure";
import TurningPointModalCharacters from "./TurningPointModalCharacters";

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

describe("TurningPointModalCharacters", () => {
  describe("Test Case 1: View turning point characters", () => {
    it("should display the correct list of characters", () => {
      renderWithProviders(
        <TurningPointModalCharacters
          charactersInvolved={mockTurningPointWithCharacters.charactersInvolved}
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
        <TurningPointModalCharacters
          charactersInvolved={mockTurningPoint.charactersInvolved}
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
        <TurningPointModalCharacters
          charactersInvolved={mockTurningPoint.charactersInvolved}
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
        <TurningPointModalCharacters
          charactersInvolved={mockTurningPoint.charactersInvolved}
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
        <TurningPointModalCharacters
          charactersInvolved={mockTurningPoint.charactersInvolved}
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
        <TurningPointModalCharacters
          charactersInvolved={mockTurningPoint.charactersInvolved}
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
        <TurningPointModalCharacters
          charactersInvolved={mockTurningPoint.charactersInvolved}
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
        <TurningPointModalCharacters
          charactersInvolved={mockTurningPoint.charactersInvolved}
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
        <TurningPointModalCharacters
          charactersInvolved={mockTurningPointWithCharacters.charactersInvolved}
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
        <TurningPointModalCharacters
          charactersInvolved={mockTurningPoint.charactersInvolved}
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
    });
  });

  describe("Edge Cases", () => {
    describe("Test Case 7: Special characters in names", () => {
      it("should handle characters with special characters correctly", () => {
        const mockSave = vi.fn();
        renderWithProviders(
          <TurningPointModalCharacters
            charactersInvolved={mockTurningPoint.charactersInvolved}
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
          <TurningPointModalCharacters
            charactersInvolved={mockTurningPoint.charactersInvolved}
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

    describe("Test Case 10: Multiple rapid additions", () => {
      it("should handle quickly adding multiple characters in succession", async () => {
        const mockSave = vi.fn();
        renderWithProviders(
          <TurningPointModalCharacters
            charactersInvolved={mockTurningPoint.charactersInvolved}
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
