import { describe, it, expect } from "vitest";
import { screen, within } from "@testing-library/react";
import { renderWithProviders, userEvent } from "../test/utils";
import { AdventureDropdown } from "./AdventureDropdown";
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

// Helper function to render dropdown with specific state
function renderDropdown(
  adventures: Adventure[],
  selectedId: number | null = null,
) {
  const preloadedState = {
    adventure: {
      adventures,
      selectedAdventureId: selectedId,
    },
  };

  return renderWithProviders(<AdventureDropdown />, { preloadedState });
}

describe("AdventureDropdown", () => {
  describe("Rendering", () => {
    it("should render without crashing", () => {
      const { container } = renderDropdown([]);
      expect(container).toBeTruthy();
    });

    it('should display "Select Adventure" by default', () => {
      renderDropdown([createMockAdventure()]);
      const dropdown = screen.getByTestId("adventure-dropdown");
      expect(
        within(dropdown).getByText("Select Adventure"),
      ).toBeInTheDocument();
    });

    it("should render all adventures", async () => {
      const adventures = [
        createMockAdventure({ id: 1, title: "Quest 1" }),
        createMockAdventure({ id: 2, title: "Quest 2" }),
      ];

      renderDropdown(adventures);

      const dropdown = screen.getByTestId("adventure-dropdown");

      // Open dropdown
      const dropdownButton = within(dropdown).getByRole("button");
      await userEvent.click(dropdownButton);

      // Verify items appear
      expect(await within(dropdown).findByText("Quest 1")).toBeInTheDocument();
      expect(within(dropdown).getByText("Quest 2")).toBeInTheDocument();
    });

    it('should show "Untitled Adventure" for empty titles', async () => {
      const adventures = [createMockAdventure({ id: 1, title: "" })];
      renderDropdown(adventures);

      const dropdown = screen.getByTestId("adventure-dropdown");
      const dropdownButton = within(dropdown).getByRole("button");
      await userEvent.click(dropdownButton);

      expect(
        await within(dropdown).findByText("Untitled Adventure"),
      ).toBeInTheDocument();
    });
  });

  describe("State Selection", () => {
    it("should display selected adventure title", () => {
      const adventures = [createMockAdventure({ id: 1, title: "My Quest" })];
      renderDropdown(adventures, 1);

      const dropdown = screen.getByTestId("adventure-dropdown");
      expect(within(dropdown).getByText("My Quest")).toBeInTheDocument();
    });

    it('should fall back to "Select Adventure" when null', () => {
      const adventures = [createMockAdventure({ id: 1, title: "Quest" })];
      renderDropdown(adventures, null);

      const dropdown = screen.getByTestId("adventure-dropdown");
      expect(
        within(dropdown).getByText("Select Adventure"),
      ).toBeInTheDocument();
    });

    it("should handle empty title in selected adventure", () => {
      const adventures = [createMockAdventure({ id: 1, title: "" })];
      renderDropdown(adventures, 1);

      const dropdown = screen.getByTestId("adventure-dropdown");
      expect(
        within(dropdown).getByText("Untitled Adventure"),
      ).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("should dispatch setSelectedAdventure on click", async () => {
      const adventures = [createMockAdventure({ id: 2, title: "Quest 1" })];
      const { store } = renderDropdown(adventures);

      const dropdown = screen.getByTestId("adventure-dropdown");
      const dropdownButton = within(dropdown).getByRole("button");
      await userEvent.click(dropdownButton);

      const item = await within(dropdown).findByText("Quest 1");
      await userEvent.click(item);

      expect(store.getState().adventure.selectedAdventureId).toBe(2);
    });

    it("should dispatch with correct adventure ID", async () => {
      const adventures = [createMockAdventure({ id: 5, title: "Quest 5" })];
      const { store } = renderDropdown(adventures);

      const dropdown = screen.getByTestId("adventure-dropdown");
      const dropdownButton = within(dropdown).getByRole("button");
      await userEvent.click(dropdownButton);

      const item = await within(dropdown).findByText("Quest 5");
      await userEvent.click(item);

      expect(store.getState().adventure.selectedAdventureId).toBe(5);
    });

    it("should allow selecting different adventures", async () => {
      const adventures = [
        createMockAdventure({ id: 1, title: "Quest 1" }),
        createMockAdventure({ id: 2, title: "Quest 2" }),
      ];
      const { store } = renderDropdown(adventures);

      const dropdown = screen.getByTestId("adventure-dropdown");
      const dropdownButton = within(dropdown).getByRole("button");

      // Select first adventure
      await userEvent.click(dropdownButton);
      const item1 = await within(dropdown).findByText("Quest 1");
      await userEvent.click(item1);
      expect(store.getState().adventure.selectedAdventureId).toBe(1);

      // Select second adventure
      await userEvent.click(dropdownButton);
      const item2 = await within(dropdown).findByText("Quest 2");
      await userEvent.click(item2);
      expect(store.getState().adventure.selectedAdventureId).toBe(2);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty adventures array", () => {
      renderDropdown([]);
      const dropdown = screen.getByTestId("adventure-dropdown");
      expect(
        within(dropdown).getByText("Select Adventure"),
      ).toBeInTheDocument();
    });

    it("should handle single adventure", async () => {
      const adventures = [createMockAdventure({ id: 1, title: "Solo Quest" })];
      renderDropdown(adventures);

      const dropdown = screen.getByTestId("adventure-dropdown");
      const dropdownButton = within(dropdown).getByRole("button");
      await userEvent.click(dropdownButton);

      expect(
        await within(dropdown).findByText("Solo Quest"),
      ).toBeInTheDocument();
    });

    it("should handle many adventures", async () => {
      const adventures = Array.from({ length: 10 }, (_, i) =>
        createMockAdventure({ id: i + 1, title: `Quest ${i + 1}` }),
      );
      renderDropdown(adventures);

      const dropdown = screen.getByTestId("adventure-dropdown");
      const dropdownButton = within(dropdown).getByRole("button");
      await userEvent.click(dropdownButton);

      // Verify first and last
      expect(await within(dropdown).findByText("Quest 1")).toBeInTheDocument();
      expect(within(dropdown).getByText("Quest 10")).toBeInTheDocument();
    });
  });

  describe("Delete Functionality", () => {
    it("should render delete button for each adventure", async () => {
      const adventures = [
        createMockAdventure({ id: 1, title: "Quest 1" }),
        createMockAdventure({ id: 2, title: "Quest 2" }),
      ];
      renderDropdown(adventures);

      const dropdown = screen.getByTestId("adventure-dropdown");
      const dropdownButton = within(dropdown).getByRole("button");
      await userEvent.click(dropdownButton);

      // Wait for dropdown to open
      await within(dropdown).findByText("Quest 1");

      // Find all delete buttons (by aria-label)
      const deleteButtons = within(dropdown).getAllByLabelText(/delete/i);
      expect(deleteButtons).toHaveLength(2);
    });

    it("should open modal with correct title when delete is clicked", async () => {
      const adventures = [
        createMockAdventure({ id: 1, title: "My Epic Quest" }),
      ];
      renderDropdown(adventures);

      const dropdown = screen.getByTestId("adventure-dropdown");
      const dropdownButton = within(dropdown).getByRole("button");
      await userEvent.click(dropdownButton);

      await within(dropdown).findByText("My Epic Quest");

      const deleteButton = within(dropdown).getByLabelText(/delete/i);
      await userEvent.click(deleteButton);

      // Modal should open with adventure title (modal is outside dropdown scope)
      expect(
        await screen.findByText(
          /Are you sure you want to delete 'My Epic Quest'\?/,
        ),
      ).toBeInTheDocument();
    });

    it("should close modal without deletion when cancel is clicked", async () => {
      const adventures = [createMockAdventure({ id: 1, title: "Quest 1" })];
      const { store } = renderDropdown(adventures, 1);

      const dropdown = screen.getByTestId("adventure-dropdown");
      const dropdownButton = within(dropdown).getByRole("button");
      await userEvent.click(dropdownButton);

      // Wait for menu to be visible
      await within(dropdown).findByRole("menu");

      const deleteButton = within(dropdown).getByLabelText(/delete/i);
      await userEvent.click(deleteButton);

      // Modal opens (modal is outside dropdown scope)
      const cancelButton = await screen.findByRole("button", {
        name: /cancel/i,
      });
      await userEvent.click(cancelButton);

      // Modal should close (Delete Adventure header should not be visible)
      expect(screen.queryByText("Delete Adventure")).not.toBeInTheDocument();

      // Adventure should still exist
      expect(store.getState().adventure.adventures).toHaveLength(1);
      expect(store.getState().adventure.adventures[0].id).toBe(1);
    });

    it("should delete adventure from state when confirm is clicked", async () => {
      const adventures = [
        createMockAdventure({ id: 1, title: "Quest 1" }),
        createMockAdventure({ id: 2, title: "Quest 2" }),
      ];
      const { store } = renderDropdown(adventures, 1);

      const dropdown = screen.getByTestId("adventure-dropdown");
      const dropdownButton = within(dropdown).getByRole("button");
      await userEvent.click(dropdownButton);

      // Wait for menu to be visible
      await within(dropdown).findByRole("menu");

      // Click delete on first adventure
      const deleteButtons = within(dropdown).getAllByLabelText(/delete/i);
      await userEvent.click(deleteButtons[0]);

      // Confirm deletion (modal is outside dropdown scope)
      const confirmButton = await screen.findByRole("button", {
        name: /^delete$/i,
      });
      await userEvent.click(confirmButton);

      // Adventure should be deleted
      const state = store.getState().adventure;
      expect(state.adventures).toHaveLength(1);
      expect(state.adventures[0].id).toBe(2);
    });

    it("should not select adventure when delete button is clicked (event propagation)", async () => {
      const adventures = [
        createMockAdventure({ id: 1, title: "Quest 1" }),
        createMockAdventure({ id: 2, title: "Quest 2" }),
      ];
      const { store } = renderDropdown(adventures, 1);

      const dropdown = screen.getByTestId("adventure-dropdown");
      const dropdownButton = within(dropdown).getByRole("button");
      await userEvent.click(dropdownButton);

      // Wait for menu to be visible
      await within(dropdown).findByRole("menu");

      // Click delete on second adventure (not selected)
      const deleteButtons = within(dropdown).getAllByLabelText(/delete/i);
      await userEvent.click(deleteButtons[1]);

      // Selected adventure should remain unchanged
      expect(store.getState().adventure.selectedAdventureId).toBe(1);
    });

    it("should close modal after successful deletion", async () => {
      const adventures = [
        createMockAdventure({ id: 1, title: "Quest 1" }),
        createMockAdventure({ id: 2, title: "Quest 2" }),
      ];
      renderDropdown(adventures, 1);

      const dropdown = screen.getByTestId("adventure-dropdown");
      const dropdownButton = within(dropdown).getByRole("button");
      await userEvent.click(dropdownButton);

      // Wait for menu to be visible
      await within(dropdown).findByRole("menu");

      const deleteButtons = within(dropdown).getAllByLabelText(/delete/i);
      await userEvent.click(deleteButtons[0]);

      // Confirm deletion (modal is outside dropdown scope)
      const confirmButton = await screen.findByRole("button", {
        name: /^delete$/i,
      });
      await userEvent.click(confirmButton);

      // Modal should close
      expect(screen.queryByText("Delete Adventure")).not.toBeInTheDocument();
    });

    it("should select next adventure after deleting selected adventure", async () => {
      const adventures = [
        createMockAdventure({ id: 1, title: "Quest 1" }),
        createMockAdventure({ id: 2, title: "Quest 2" }),
        createMockAdventure({ id: 3, title: "Quest 3" }),
      ];
      const { store } = renderDropdown(adventures, 2);

      const dropdown = screen.getByTestId("adventure-dropdown");
      const dropdownButton = within(dropdown).getByRole("button");
      await userEvent.click(dropdownButton);

      // Wait for menu to be visible
      await within(dropdown).findByRole("menu");

      // Delete the selected adventure (Quest 2)
      const deleteButtons = within(dropdown).getAllByLabelText(/delete/i);
      await userEvent.click(deleteButtons[1]); // Quest 2

      // Confirm deletion (modal is outside dropdown scope)
      const confirmButton = await screen.findByRole("button", {
        name: /^delete$/i,
      });
      await userEvent.click(confirmButton);

      // Should auto-select first remaining adventure
      const state = store.getState().adventure;
      expect(state.adventures).toHaveLength(2);
      expect(state.selectedAdventureId).toBe(1);
    });

    it("should display 'Untitled Adventure' in modal for empty title", async () => {
      const adventures = [createMockAdventure({ id: 1, title: "" })];
      renderDropdown(adventures);

      const dropdown = screen.getByTestId("adventure-dropdown");
      const dropdownButton = within(dropdown).getByRole("button");
      await userEvent.click(dropdownButton);

      await within(dropdown).findByText("Untitled Adventure");

      const deleteButton = within(dropdown).getByLabelText(/delete/i);
      await userEvent.click(deleteButton);

      // Modal text (modal is outside dropdown scope)
      expect(
        await screen.findByText(
          /Are you sure you want to delete 'Untitled Adventure'\?/,
        ),
      ).toBeInTheDocument();
    });

    it("should create new adventure when deleting the last one", async () => {
      const adventures = [createMockAdventure({ id: 1, title: "Solo Quest" })];
      const { store } = renderDropdown(adventures, 1);

      const dropdown = screen.getByTestId("adventure-dropdown");
      const dropdownButton = within(dropdown).getByRole("button");
      await userEvent.click(dropdownButton);

      // Wait for menu to be visible
      await within(dropdown).findByRole("menu");

      const deleteButton = within(dropdown).getByLabelText(/delete/i);
      await userEvent.click(deleteButton);

      // Confirm deletion (modal is outside dropdown scope)
      const confirmButton = await screen.findByRole("button", {
        name: /^delete$/i,
      });
      await userEvent.click(confirmButton);

      // Should auto-create new adventure
      const state = store.getState().adventure;
      expect(state.adventures).toHaveLength(1);
      expect(state.adventures[0].id).toBe(2); // New ID
      expect(state.selectedAdventureId).toBe(2);
    });
  });
});
