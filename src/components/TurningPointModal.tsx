import type { TurningPoint, Adventure } from "../types/Adventure";
import {
  Modal,
  Label,
  TextInput,
  Textarea,
  ModalHeader,
  ModalBody,
} from "flowbite-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

interface TurningPointModalProps {
  show: boolean;
  turningPoint: TurningPoint;
  onClose: () => void;
  onSave: (updatedTurningPoint: TurningPoint) => void;
}

export default function TurningPointModal({
  show,
  turningPoint,
  onClose,
  onSave,
}: TurningPointModalProps) {
  const [localTurningPoint, setLocalTurningPoint] =
    useState<TurningPoint>(turningPoint);
  const [newCharacter, setNewCharacter] = useState("");
  const [newPlotPoint, setNewPlotPoint] = useState("");
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [filteredCharacters, setFilteredCharacters] = useState<string[]>([]);

  // Get adventure data from Redux store
  const adventure = useSelector(
    (state: {
      adventure: { adventures: Adventure[]; selectedAdventureId: number };
    }) => {
      const selectedAdventureId = state.adventure.selectedAdventureId;
      return state.adventure.adventures.find(
        (a: Adventure) => a.id === selectedAdventureId,
      );
    },
  );

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

  const handleFieldChange = (
    field: keyof TurningPoint,
    value: string | string[],
  ) => {
    // Enforce field length limits by truncating values that exceed max length
    if (typeof value === "string") {
      if (field === "title" && value.length > 100) {
        value = value.slice(0, 100);
      } else if (field === "plotLine" && value.length > 200) {
        value = value.slice(0, 200);
      } else if (field === "notes" && value.length > 1000) {
        value = value.slice(0, 1000);
      }
    }
    setLocalTurningPoint((prev) => ({ ...prev, [field]: value }));
  };

  const isValid = () => {
    return (
      localTurningPoint.title.length <= 100 &&
      localTurningPoint.plotLine.length <= 200 &&
      localTurningPoint.notes.length <= 1000
    );
  };

  const handleSave = () => {
    if (isValid()) {
      onSave(localTurningPoint);
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  const handleAddCharacter = () => {
    const trimmedCharacter = newCharacter.trim();

    // Validate input
    if (!trimmedCharacter) {
      // Keep focus on input for correction
      return;
    }

    // Check for duplicates
    if (localTurningPoint.charactersInvolved.includes(trimmedCharacter)) {
      setNewCharacter("");
      return;
    }

    // Add character
    const updatedCharacters = [
      ...localTurningPoint.charactersInvolved,
      trimmedCharacter,
    ];
    const updatedTurningPoint = {
      ...localTurningPoint,
      charactersInvolved: updatedCharacters,
    };

    setLocalTurningPoint(updatedTurningPoint);
    setNewCharacter("");
    setShowAutoComplete(false);

    // Save the updated turning point
    onSave(updatedTurningPoint);
  };

  const handleAddPlotPoint = () => {
    const trimmedPlotPoint = newPlotPoint.trim();

    // Validate input
    if (!trimmedPlotPoint) {
      // Keep focus on input for correction
      return;
    }

    // Check for duplicates
    if (localTurningPoint.plotPoints.includes(trimmedPlotPoint)) {
      setNewPlotPoint("");
      return;
    }

    // Add plotPoint
    const updatedPlotPoints = [
      ...localTurningPoint.plotPoints,
      trimmedPlotPoint,
    ];
    const updatedTurningPoint = {
      ...localTurningPoint,
      plotPoints: updatedPlotPoints,
    };

    setLocalTurningPoint(updatedTurningPoint);
    setNewPlotPoint("");

    // Save the updated turning point
    onSave(updatedTurningPoint);
  };

  const handleSelectCharacter = (character: string) => {
    const trimmedCharacter = character.trim();

    // Validate input
    if (!trimmedCharacter) {
      return;
    }

    // Check for duplicates
    if (localTurningPoint.charactersInvolved.includes(trimmedCharacter)) {
      setNewCharacter("");
      setShowAutoComplete(false);
      return;
    }

    // Add character
    const updatedCharacters = [
      ...localTurningPoint.charactersInvolved,
      trimmedCharacter,
    ];
    const updatedTurningPoint = {
      ...localTurningPoint,
      charactersInvolved: updatedCharacters,
    };

    setLocalTurningPoint(updatedTurningPoint);
    setNewCharacter("");
    setShowAutoComplete(false);

    // Save the updated turning point
    onSave(updatedTurningPoint);
  };

  if (!show) return null;

  return (
    <Modal show={show} onClose={onClose}>
      <ModalHeader>Turning Point Details</ModalHeader>
      <ModalBody>
        <div className="space-y-4">
          {/* Title Field */}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="turning-point-title">Title</Label>
            </div>
            <TextInput
              id="turning-point-title"
              type="text"
              value={localTurningPoint.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Plot Line Field */}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="turning-point-plotline">Plot Line</Label>
            </div>
            <TextInput
              id="turning-point-plotline"
              type="text"
              value={localTurningPoint.plotLine}
              onChange={(e) => handleFieldChange("plotLine", e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Notes Field */}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="turning-point-notes">Notes</Label>
            </div>
            <Textarea
              id="turning-point-notes"
              value={localTurningPoint.notes}
              onChange={(e) => handleFieldChange("notes", e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              rows={4}
            />
          </div>

          {/* Characters Involved */}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="turning-point-characters">
                Characters Involved
              </Label>
            </div>
            <div data-testid="characters-involved-list" className="mb-4">
              {localTurningPoint.charactersInvolved.map((character, index) => (
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

          {/* Plot Points */}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="turning-point-plotpoints">Plot Points</Label>
            </div>
            <div data-testid="plot-points-list" className="mb-4">
              {localTurningPoint.plotPoints.map((plotPoint, index) => (
                <div
                  key={index}
                  data-testid={`plot-point-${plotPoint}`}
                  className="mr-2 mb-2 inline-block rounded bg-gray-200 px-2 py-1 whitespace-nowrap text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                >
                  {plotPoint}
                </div>
              ))}
            </div>

            {/* Add Plot Point Input */}
            <div className="relative">
              <Label htmlFor="add-plot-point-input" className="mb-2 block">
                Add Plot Point
              </Label>
              <TextInput
                id="add-plot-point-input"
                type="text"
                value={newPlotPoint}
                onChange={(e) => setNewPlotPoint(e.target.value)}
                onBlur={() => handleAddPlotPoint()}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddPlotPoint();
                  }
                }}
                placeholder="Type plot point..."
              />
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}
