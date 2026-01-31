import type { Adventure } from "../types/Adventure";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import {
  setSelectedAdventure,
  newAdventure,
  deleteAdventure,
} from "../slices/adventureSlice";
import { Dropdown, DropdownItem } from "flowbite-react";
import { TrashBin } from "flowbite-react-icons/outline";
import DeleteAdventureModal from "./DeleteAdventureModal";

export const AdventureDropdown: React.FC = () => {
  const adventures: Adventure[] = useSelector(
    (state: RootState) => state.adventure.adventures,
  );
  const selectedAdventureId = useSelector(
    (state: RootState) => state.adventure.selectedAdventureId,
  );
  const dispatch = useDispatch();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [adventureToDelete, setAdventureToDelete] = useState<number | null>(
    null,
  );

  const handleSelect = (adventureId: number) => {
    dispatch(setSelectedAdventure(adventureId));
  };

  const handleNewAdventure = () => {
    dispatch(newAdventure());
  };

  const handleDeleteClick = (e: React.MouseEvent, adventureId: number) => {
    e.stopPropagation();
    setAdventureToDelete(adventureId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (adventureToDelete !== null) {
      dispatch(deleteAdventure(adventureToDelete));
    }
    setDeleteModalOpen(false);
    setAdventureToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setAdventureToDelete(null);
  };

  const selectedAdventure = adventures.find(
    (adv) => adv.id === selectedAdventureId,
  );
  const label = selectedAdventure
    ? selectedAdventure.title || "Untitled Adventure"
    : "Select Adventure";

  const adventureTitleToDelete =
    adventures.find((adv) => adv.id === adventureToDelete)?.title || "";

  return (
    <div data-testid="adventure-dropdown">
      <Dropdown label={label} inline>
        {adventures.map((adventure) => (
          <DropdownItem
            key={adventure.id}
            onClick={() => handleSelect(adventure.id)}
          >
            <div className="flex w-full items-center justify-between gap-2">
              <span>{adventure.title || "Untitled Adventure"}</span>
              <button
                onClick={(e) => handleDeleteClick(e, adventure.id)}
                className="p-1 text-red-600 hover:text-red-800"
                aria-label={`Delete ${adventure.title || "Untitled Adventure"}`}
              >
                <TrashBin className="h-4 w-4" />
              </button>
            </div>
          </DropdownItem>
        ))}
        <DropdownItem key={-999} onClick={handleNewAdventure}>
          + New Adventure
        </DropdownItem>
      </Dropdown>
      <DeleteAdventureModal
        isOpen={deleteModalOpen}
        adventureTitle={adventureTitleToDelete}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};
