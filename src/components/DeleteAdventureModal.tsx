import { Button } from "flowbite-react";
import { Close } from "flowbite-react-icons/outline";

interface DeleteAdventureModalProps {
  isOpen: boolean;
  adventureTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteAdventureModal({
  isOpen,
  adventureTitle,
  onConfirm,
  onCancel,
}: DeleteAdventureModalProps) {
  const displayTitle = adventureTitle.trim() || "Untitled Adventure";

  if (!isOpen) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="mx-4 w-full max-w-md rounded-lg bg-white shadow-xl dark:bg-gray-800">
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Delete Adventure
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
            aria-label="Close modal"
          >
            <Close className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            Are you sure you want to delete '{displayTitle}'?
          </p>
        </div>
        <div className="flex justify-end gap-2 border-t border-gray-200 p-4 dark:border-gray-700">
          <Button color="gray" onClick={onCancel}>
            Cancel
          </Button>
          <Button color="failure" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
