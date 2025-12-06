import type { Adventure } from "../types/Adventure";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import { setSelectedAdventure } from "../slices/adventureSlice";
import { Dropdown, DropdownItem } from "flowbite-react";

export const AdventureDropdown: React.FC = () => {
  const adventures: Adventure[] = useSelector(
    (state: RootState) => state.adventure.adventures,
  );
  const selectedAdventureId = useSelector(
    (state: RootState) => state.adventure.selectedAdventureId,
  );
  const dispatch = useDispatch();

  const handleSelect = (adventureId: number) => {
    dispatch(setSelectedAdventure(adventureId));
  };

  const selectedAdventure = adventures.find(
    (adv) => adv.id === selectedAdventureId,
  );
  const label = selectedAdventure
    ? selectedAdventure.title || "Untitled Adventure"
    : "Select Adventure";

  return (
    <Dropdown label={label} inline>
      {adventures.map((adventure) => (
        <DropdownItem
          key={adventure.id}
          onClick={() => handleSelect(adventure.id)}
        >
          {adventure.title || "Untitled Adventure"}
        </DropdownItem>
      ))}
    </Dropdown>
  );
};
