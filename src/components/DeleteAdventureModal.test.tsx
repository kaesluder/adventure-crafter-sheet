import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders, userEvent } from "../test/utils";
import DeleteAdventureModal from "./DeleteAdventureModal";

describe("DeleteAdventureModal", () => {
  describe("Rendering", () => {
    it("should not be visible when isOpen is false", () => {
      renderWithProviders(
        <DeleteAdventureModal
          isOpen={false}
          adventureTitle="Test Adventure"
          onConfirm={vi.fn()}
          onCancel={vi.fn()}
        />,
      );

      expect(screen.queryByText("Delete Adventure")).not.toBeInTheDocument();
    });

    it("should be visible when isOpen is true", () => {
      renderWithProviders(
        <DeleteAdventureModal
          isOpen={true}
          adventureTitle="Test Adventure"
          onConfirm={vi.fn()}
          onCancel={vi.fn()}
        />,
      );

      expect(screen.getByText("Delete Adventure")).toBeInTheDocument();
    });

    it("should display adventure title in confirmation message", () => {
      renderWithProviders(
        <DeleteAdventureModal
          isOpen={true}
          adventureTitle="My Epic Quest"
          onConfirm={vi.fn()}
          onCancel={vi.fn()}
        />,
      );

      expect(
        screen.getByText(/Are you sure you want to delete 'My Epic Quest'\?/),
      ).toBeInTheDocument();
    });

    it("should display 'Untitled Adventure' for empty title", () => {
      renderWithProviders(
        <DeleteAdventureModal
          isOpen={true}
          adventureTitle=""
          onConfirm={vi.fn()}
          onCancel={vi.fn()}
        />,
      );

      expect(
        screen.getByText(
          /Are you sure you want to delete 'Untitled Adventure'\?/,
        ),
      ).toBeInTheDocument();
    });

    it("should display 'Untitled Adventure' for whitespace-only title", () => {
      renderWithProviders(
        <DeleteAdventureModal
          isOpen={true}
          adventureTitle="   "
          onConfirm={vi.fn()}
          onCancel={vi.fn()}
        />,
      );

      expect(
        screen.getByText(
          /Are you sure you want to delete 'Untitled Adventure'\?/,
        ),
      ).toBeInTheDocument();
    });
  });

  describe("Button Interactions", () => {
    it("should call onCancel when Cancel button is clicked", async () => {
      const onCancel = vi.fn();

      renderWithProviders(
        <DeleteAdventureModal
          isOpen={true}
          adventureTitle="Test Adventure"
          onConfirm={vi.fn()}
          onCancel={onCancel}
        />,
      );

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      await userEvent.click(cancelButton);

      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it("should call onConfirm when Delete button is clicked", async () => {
      const onConfirm = vi.fn();

      renderWithProviders(
        <DeleteAdventureModal
          isOpen={true}
          adventureTitle="Test Adventure"
          onConfirm={onConfirm}
          onCancel={vi.fn()}
        />,
      );

      const deleteButton = screen.getByRole("button", { name: /delete/i });
      await userEvent.click(deleteButton);

      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it("should call onCancel when close button is clicked", async () => {
      const onCancel = vi.fn();

      renderWithProviders(
        <DeleteAdventureModal
          isOpen={true}
          adventureTitle="Test Adventure"
          onConfirm={vi.fn()}
          onCancel={onCancel}
        />,
      );

      const closeButton = screen.getByLabelText("Close modal");
      await userEvent.click(closeButton);

      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it("should not call onConfirm when Cancel button is clicked", async () => {
      const onConfirm = vi.fn();

      renderWithProviders(
        <DeleteAdventureModal
          isOpen={true}
          adventureTitle="Test Adventure"
          onConfirm={onConfirm}
          onCancel={vi.fn()}
        />,
      );

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      await userEvent.click(cancelButton);

      expect(onConfirm).not.toHaveBeenCalled();
    });

    it("should not call onCancel when Delete button is clicked", async () => {
      const onCancel = vi.fn();

      renderWithProviders(
        <DeleteAdventureModal
          isOpen={true}
          adventureTitle="Test Adventure"
          onConfirm={vi.fn()}
          onCancel={onCancel}
        />,
      );

      const deleteButton = screen.getByRole("button", { name: /delete/i });
      await userEvent.click(deleteButton);

      expect(onCancel).not.toHaveBeenCalled();
    });
  });

  describe("Modal Content", () => {
    it("should display header text 'Delete Adventure'", () => {
      renderWithProviders(
        <DeleteAdventureModal
          isOpen={true}
          adventureTitle="Test Adventure"
          onConfirm={vi.fn()}
          onCancel={vi.fn()}
        />,
      );

      expect(screen.getByText("Delete Adventure")).toBeInTheDocument();
    });

    it("should render both Cancel and Delete buttons", () => {
      renderWithProviders(
        <DeleteAdventureModal
          isOpen={true}
          adventureTitle="Test Adventure"
          onConfirm={vi.fn()}
          onCancel={vi.fn()}
        />,
      );

      expect(
        screen.getByRole("button", { name: /cancel/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /delete/i }),
      ).toBeInTheDocument();
    });
  });
});
