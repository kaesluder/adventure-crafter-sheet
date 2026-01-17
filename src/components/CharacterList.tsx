import type { Adventure } from "../types/Adventure";
import React from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import { updateAdventure } from "../slices/adventureSlice";
import { Label, List, ListItem, TextInput } from "flowbite-react";

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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
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
