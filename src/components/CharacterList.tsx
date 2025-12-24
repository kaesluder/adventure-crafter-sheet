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

  return (
    <div className="w-full">
      <div className="mb-2">
        <Label>Characters</Label>
      </div>
      <List>
        {currentAdventure?.characters.map((character) => (
          <ListItem key={character}>{character}</ListItem>
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
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer relative z-10 hover:bg-blue-600"
        >
          Add Character
        </button>
      </div>
    </div>
  );
};
