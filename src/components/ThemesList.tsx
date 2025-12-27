import type { Adventure, ThemeValues } from "../types/Adventure";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import { updateAdventure } from "../slices/adventureSlice";
import { Label } from "flowbite-react";
import SortableList, { SortableItem } from "react-easy-sort";
import { arrayMoveImmutable } from "array-move";

export const ThemesList: React.FC = () => {
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

  const formatThemeName = (theme: ThemeValues): string => {
    return theme.charAt(0).toUpperCase() + theme.slice(1);
  };

  const handleSortEnd = (oldIndex: number, newIndex: number) => {
    if (!currentAdventure) {
      console.warn("No adventure selected");
      return;
    }

    if (oldIndex === newIndex) {
      return; // No change needed
    }

    if (
      oldIndex < 0 ||
      oldIndex >= currentAdventure.themes.length ||
      newIndex < 0 ||
      newIndex >= currentAdventure.themes.length
    ) {
      console.warn("Invalid index for theme reordering");
      return;
    }

    // Create new themes array with updated order
    const newThemes = arrayMoveImmutable(
      currentAdventure.themes,
      oldIndex,
      newIndex,
    );

    // Create updated adventure object
    const updatedAdventure: Adventure = {
      ...currentAdventure,
      themes: newThemes,
    };

    // Dispatch to Redux
    dispatch(updateAdventure(updatedAdventure));
  };

  return (
    <div className="w-full">
      <div className="mb-2">
        <Label>Themes</Label>
      </div>
      <SortableList
        onSortEnd={handleSortEnd}
        className="space-y-2"
        draggedItemClassName="opacity-50"
      >
        {currentAdventure?.themes.map((theme, index) => (
          <SortableItem key={theme + index}>
            <div className="cursor-move rounded-md bg-gray-100 px-3 py-2 text-sm transition-colors select-none hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">
              {formatThemeName(theme)}
            </div>
          </SortableItem>
        ))}
      </SortableList>
    </div>
  );
};
