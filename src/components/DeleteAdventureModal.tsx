import { Button } from "flowbite-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Delete Adventure
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
            aria-label="Close modal"
          >
            {/* X icon for closing modal */}
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className="p-6">
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            Are you sure you want to delete '{displayTitle}'?
          </p>
        </div>
        <div className="flex gap-2 justify-end p-4 border-t border-gray-200 dark:border-gray-700">
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
