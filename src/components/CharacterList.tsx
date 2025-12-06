import type { Adventure } from "../types/Adventure";
import React from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import {
  setSelectedAdventure,
  newAdventure,
  updateAdventure,
} from "../slices/adventureSlice";
import { List, ListItem, TextInput } from "flowbite-react";

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
    <div>
      <List>
        {currentAdventure?.characters.map((character) => (
          <ListItem key={character}>{character}</ListItem>
        ))}
      </List>
      <div style={{ marginTop: "1rem" }}>
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
          style={{
            marginTop: "0.5rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "0.375rem",
            cursor: "pointer",
            position: "relative",
            zIndex: 10
          }}
        >
          Add Character
        </button>
      </div>
    </div>
  );
};
