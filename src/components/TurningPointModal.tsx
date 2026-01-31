import type { TurningPoint, Adventure } from "../types/Adventure";
import {
  Modal,
  Label,
  TextInput,
  Textarea,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "flowbite-react";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteTurningPoint } from "../slices/adventureSlice";
import TurningPointModalCharacters from "./TurningPointModalCharacters";

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
  const dispatch = useDispatch();
  const [localTurningPoint, setLocalTurningPoint] =
    useState<TurningPoint>(turningPoint);
  const [newPlotPoint, setNewPlotPoint] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

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

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    if (adventure && turningPoint.id) {
      dispatch(
        deleteTurningPoint({
          adventureId: adventure.id,
          turningPointId: turningPoint.id,
        }),
      );
    }
    setShowDeleteConfirmation(false);
    onClose();
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    // Return focus to delete button after state update
    setTimeout(() => {
      deleteButtonRef.current?.focus();
    }, 0);
  };

  // Handle Escape key to close confirmation dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showDeleteConfirmation) {
        handleCancelDelete();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showDeleteConfirmation]);

  if (!show) return null;

  return (
    <div data-testid="turning-point-modal">
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
            <TurningPointModalCharacters
              charactersInvolved={localTurningPoint.charactersInvolved}
              onSave={(updated) => {
                const updatedTurningPoint = {
                  ...localTurningPoint,
                  charactersInvolved: updated.charactersInvolved,
                };
                setLocalTurningPoint(updatedTurningPoint);
                onSave(updatedTurningPoint);
              }}
            />

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
        <ModalFooter>
          {turningPoint.id > 0 && (
            <button
              ref={deleteButtonRef}
              data-testid="turning-point-delete-button"
              aria-label="Delete turning point"
              onClick={handleDeleteClick}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleDeleteClick();
                }
              }}
              className="cursor-pointer text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              Delete
            </button>
          )}
        </ModalFooter>
        {/* Delete Confirmation Dialog */}
        {showDeleteConfirmation && (
          <div
            data-testid="delete-confirmation-backdrop"
            className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black"
            onClick={handleCancelDelete}
          >
            <div
              data-testid="delete-confirmation-dialog"
              role="dialog"
              aria-label="Delete turning point confirmation"
              className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="mb-4 text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this turning point?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  data-testid="delete-cancel-button"
                  aria-label="Cancel delete"
                  onClick={handleCancelDelete}
                  className="rounded bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  data-testid="delete-confirm-button"
                  aria-label="Confirm delete"
                  onClick={handleConfirmDelete}
                  className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
