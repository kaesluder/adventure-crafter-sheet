import type { Adventure } from "../types/Adventure";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import { updateAdventure } from "../slices/adventureSlice";
import { Label, TextInput } from "flowbite-react";

export const AdventureTitle: React.FC = () => {
  const adventures: Adventure[] = useSelector(
    (state: RootState) => state.adventure.adventures,
  );
  const selectedAdventureId = useSelector(
    (state: RootState) => state.adventure.selectedAdventureId,
  );

  const currentAdventure = adventures.find(
    (adv) => adv.id === selectedAdventureId,
  );

  const dispatch = useDispatch();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentAdventure) return;

    const updatedAdventure: Adventure = {
      ...currentAdventure,
      title: e.target.value,
    };

    dispatch(updateAdventure(updatedAdventure));
  };

  return (
    <div className="w-full">
      <div className="mb-2">
        <Label htmlFor="adventure-title">Adventure Title</Label>
      </div>
      <TextInput
        id="adventure-title"
        type="text"
        placeholder="Enter adventure title"
        value={currentAdventure?.title || ""}
        onChange={handleTitleChange}
        disabled={!currentAdventure}
      />
    </div>
  );
};
