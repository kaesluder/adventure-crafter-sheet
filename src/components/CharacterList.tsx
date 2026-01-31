import type { Adventure } from "../types/Adventure";
import React from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import { updateAdventure } from "../slices/adventureSlice";
import { Label, List, ListItem, TextInput } from "flowbite-react";
import { TrashBin } from "flowbite-react-icons/outline";

export const CharacterList: React.FC = () => {
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

  const [newCharacter, setNewCharacter] = useState("");

  const handleAddCharacter = (e?: React.MouseEvent | React.FormEvent) => {
    console.log("handleAddCharacter triggered", e?.type);
    e?.preventDefault();
    e?.stopPropagation();

    if (newCharacter.trim() === "" || !currentAdventure) {
      console.log("Early return", {
        isEmpty: newCharacter.trim() === "",
        noAdventure: !currentAdventure,
      });
      return;
    }

    const updatedCharacters = [
      ...currentAdventure.characters,
      newCharacter.trim(),
    ];
    const updatedAdventure: Adventure = {
      ...currentAdventure,
      characters: updatedCharacters,
    };

    console.log("Dispatching update");
    dispatch(updateAdventure(updatedAdventure));
    setNewCharacter("");
  };

  const handleDeleteCharacter = (indexToDelete: number) => {
    if (!currentAdventure) {
      return;
    }

    const updatedCharacters = currentAdventure.characters.filter(
      (_, index) => index !== indexToDelete,
    );
    const updatedAdventure: Adventure = {
      ...currentAdventure,
      characters: updatedCharacters,
    };

    dispatch(updateAdventure(updatedAdventure));
  };

  return (
    <div className="w-full">
      <div className="mb-2">
        <Label>Characters</Label>
      </div>
      <List>
        {currentAdventure?.characters.map((character, index) => (
          <ListItem
            key={character}
            className="flex items-center justify-between"
          >
            <span>{character}</span>
            <button
              type="button"
              onClick={() => handleDeleteCharacter(index)}
              className="text-red-500 hover:text-red-700"
              aria-label={`Delete ${character}`}
            >
              <TrashBin className="h-5 w-5" />
            </button>
          </ListItem>
        ))}
      </List>
      <div className="mt-4">
        <TextInput
          placeholder="Add a new character"
          value={newCharacter}
          onChange={(e) => setNewCharacter(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddCharacter(e);
            }
          }}
        />
        <button
          type="button"
          onClick={(e) => {
            console.log("Button clicked!");
            handleAddCharacter(e);
          }}
          className="relative z-10 mt-2 cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Add Character
        </button>
      </div>
    </div>
  );
};
