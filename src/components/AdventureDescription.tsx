import type { Adventure } from "../types/Adventure";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import { updateAdventure } from "../slices/adventureSlice";
import { Label, Textarea } from "flowbite-react";

export const AdventureDescription: React.FC = () => {
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

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    if (!currentAdventure) return;

    const updatedAdventure: Adventure = {
      ...currentAdventure,
      description: e.target.value,
    };

    dispatch(updateAdventure(updatedAdventure));
  };

  return (
    <div className="w-full">
      <div className="mb-2">
        <Label htmlFor="adventure-description">
          Adventure Description
        </Label>
      </div>
      <Textarea
        id="adventure-description"
        placeholder="Enter adventure description"
        value={currentAdventure?.description || ""}
        onChange={handleDescriptionChange}
        disabled={!currentAdventure}
        rows={4}
      />
    </div>
  );
};
