import { Button, Label, TextInput, Textarea } from "flowbite-react";
import { useState, useEffect } from "react";
import type { TurningPoint } from "../types/Adventure";

type TurningPointModalProps = {
  isOpen: boolean;
  turningPoint: TurningPoint;
  onSave: (turningPoint: TurningPoint) => void;
  onDelete: (turningPointId: number) => void;
  onCancel: () => void;
};

export default function TurningPointModal({
  isOpen,
  turningPoint,
  onSave,
  onDelete,
  onCancel,
}: TurningPointModalProps) {
  // Handle undefined or null turning point gracefully
  const safeTurningPoint = turningPoint || {
    id: 0,
    title: "",
    notes: "",
    plotLine: "",
    charactersInvolved: [],
    plotPoints: [],
  };

  // Local state for form data
  const [formData, setFormData] = useState<TurningPoint>(safeTurningPoint);

  // Update form data when turningPoint prop changes
  useEffect(() => {
    setFormData(safeTurningPoint);
  }, [turningPoint]);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle save with current form data
  const handleSave = () => {
    onSave(formData);
  };

  // Handle delete with turning point ID
  const handleDelete = () => {
    onDelete(formData.id);
  };

  if (!isOpen) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div
        className="mx-4 w-full max-w-2xl rounded-lg bg-white shadow shadow-xl dark:bg-gray-800"
        role="dialog"
      >
        <header className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Turning Point
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
            aria-label="Close modal"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </header>

        <form className="space-y-4 p-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <TextInput
                id="title"
                name="title"
                placeholder="Enter title"
                value={formData.title || ""}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="plotLine">Plot Line</Label>
              <TextInput
                id="plotLine"
                name="plotLine"
                placeholder="Enter plot line"
                value={formData.plotLine || ""}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Enter notes"
                rows={4}
                value={formData.notes || ""}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Characters Involved
              </h4>
              {safeTurningPoint.charactersInvolved &&
              safeTurningPoint.charactersInvolved.length > 0 ? (
                <ul className="list-inside list-disc space-y-1">
                  {safeTurningPoint.charactersInvolved.map(
                    (character, index) => (
                      <li
                        key={index}
                        className="text-gray-700 dark:text-gray-300"
                      >
                        {character}
                      </li>
                    ),
                  )}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No characters involved
                </p>
              )}
            </div>

            <div>
              <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Plot Points
              </h4>
              {safeTurningPoint.plotPoints &&
              safeTurningPoint.plotPoints.length > 0 ? (
                <ul className="list-inside list-disc space-y-1">
                  {safeTurningPoint.plotPoints.map((point, index) => (
                    <li
                      key={index}
                      className="text-gray-700 dark:text-gray-300"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No plot points
                </p>
              )}
            </div>
          </div>
        </form>

        <footer className="flex justify-end gap-2 border-t border-gray-200 p-4 dark:border-gray-700">
          <Button color="gray" onClick={onCancel}>
            Cancel
          </Button>
          <Button color="failure" onClick={handleDelete}>
            Delete
          </Button>
          <Button color="blue" onClick={handleSave}>
            Save
          </Button>
        </footer>
      </div>
    </div>
  );
}
