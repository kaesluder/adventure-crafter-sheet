import type { Adventure } from "../types/Adventure";
import { Label, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

interface TurningPointModalCharactersProps {
  charactersInvolved: string[];
  onSave: (updatedTurningPoint: { charactersInvolved: string[] }) => void;
}

export default function TurningPointModalCharacters({
  charactersInvolved,
  onSave,
}: TurningPointModalCharactersProps) {
  const [localCharacters, setLocalCharacters] = useState<string[]>([]);
  const [newCharacter, setNewCharacter] = useState("");
  const [filteredCharacters, setFilteredCharacters] = useState<string[]>([]);
  const [showAutoComplete, setShowAutoComplete] = useState(false);

  // Sync local state with prop when it changes
  useEffect(() => {
    setLocalCharacters(charactersInvolved);
  }, [charactersInvolved]);

  // Get adventure data from Redux store
  const adventure = useSelector((state: RootState) => {
    const selectedAdventureId = state.adventure.selectedAdventureId;
    return state.adventure.adventures.find(
      (a: Adventure) => a.id === selectedAdventureId,
    );
  });

  // Filter characters for auto-complete
  useEffect(() => {
    if (newCharacter.length >= 2 && adventure?.characters) {
      const filtered = adventure.characters.filter((character: string) =>
        character.toLowerCase().includes(newCharacter.toLowerCase()),
      );
      setFilteredCharacters(filtered);
      setShowAutoComplete(filtered.length > 0);
    } else {
      setShowAutoComplete(false);
    }
  }, [newCharacter, adventure?.characters]);

  const handleAddCharacter = () => {
    const trimmedCharacter = newCharacter.trim();

    // Validate input
    if (!trimmedCharacter) {
      return;
    }

    // Check for duplicates
    if (localCharacters.includes(trimmedCharacter)) {
      setNewCharacter("");
      return;
    }

    // Add character
    const updatedCharacters = [...localCharacters, trimmedCharacter];
    setLocalCharacters(updatedCharacters);
    onSave({
      charactersInvolved: updatedCharacters,
    });

    setNewCharacter("");
    setShowAutoComplete(false);
  };

  const handleSelectCharacter = (character: string) => {
    const trimmedCharacter = character.trim();

    // Validate input
    if (!trimmedCharacter) {
      return;
    }

    // Check for duplicates
    if (localCharacters.includes(trimmedCharacter)) {
      setNewCharacter("");
      setShowAutoComplete(false);
      return;
    }

    // Add character
    const updatedCharacters = [...localCharacters, trimmedCharacter];
    setLocalCharacters(updatedCharacters);
    onSave({
      charactersInvolved: updatedCharacters,
    });

    setNewCharacter("");
    setShowAutoComplete(false);
  };

  return (
    <div>
      <div className="mb-2 block">
        <Label htmlFor="turning-point-characters">Characters Involved</Label>
      </div>
      <div data-testid="characters-involved-list" className="mb-4">
        {localCharacters.map((character, index) => (
          <div
            key={index}
            data-testid={`character-${character}`}
            className="mr-2 mb-2 inline-block rounded bg-gray-200 px-2 py-1 whitespace-nowrap text-gray-800 dark:bg-gray-700 dark:text-gray-200"
          >
            {character}
          </div>
        ))}
      </div>

      {/* Add Character Input */}
      <div className="relative">
        <Label htmlFor="add-character-input" className="mb-2 block">
          Add Character
        </Label>
        <TextInput
          id="add-character-input"
          type="text"
          value={newCharacter}
          onChange={(e) => {
            setNewCharacter(e.target.value);
          }}
          onBlur={() => handleAddCharacter()}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddCharacter();
            }
          }}
          placeholder="Type character name..."
        />

        {/* Auto-complete Dropdown */}
        {showAutoComplete && filteredCharacters.length > 0 && (
          <div
            data-testid="character-auto-complete"
            className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800"
          >
            {filteredCharacters.map((character, index) => (
              <div
                key={index}
                className="cursor-pointer px-4 py-2 text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
                onMouseDown={(e) => {
                  // Prevent blur event from firing on the input
                  e.preventDefault();
                  handleSelectCharacter(character);
                }}
              >
                {character}
              </div>
            ))}
          </div>
        )}

        {showAutoComplete && filteredCharacters.length === 0 && (
          <div
            data-testid="character-auto-complete"
            className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800"
          >
            <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
              No characters found
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
