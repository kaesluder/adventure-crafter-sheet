import type { Adventure, TurningPoint } from "../types/Adventure";
import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { Card, List, ListItem } from "flowbite-react";

interface TurningPointCardsProps {
  onClick?: (id: number) => void;
  onAddNew?: () => void;
}

export const TurningPointCards: React.FC<TurningPointCardsProps> = ({
  onClick,
  onAddNew,
}) => {
  const adventures: Adventure[] = useSelector(
    (state: RootState) => state.adventure.adventures,
  );
  const selectedAdventureId = useSelector(
    (state: RootState) => state.adventure.selectedAdventureId,
  );

  const currentAdventure = adventures.find(
    (adv) => adv.id === selectedAdventureId,
  );

  const turningPoints = currentAdventure?.turningPoints || [];

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-4" data-testid="turning-point-list">
        {turningPoints.map((tp) => (
          <Card
            key={tp.id}
            data-testid={`turning-point-card-${tp.id}`}
            onClick={() => onClick?.(tp.id)}
            className="w-64 cursor-pointer hover:bg-gray-50"
          >
            <h5 className="text-xl font-bold tracking-tight text-gray-900">
              {tp.title || "Title"}
            </h5>
            <p className="text-sm text-gray-600">
              {tp.plotLine || "Plot Line"}
            </p>
            <List>
              {tp.plotPoints.map((point, index) => (
                <ListItem key={index}>{point}</ListItem>
              ))}
            </List>
          </Card>
        ))}
      </div>
      <button
        type="button"
        data-testid="new-turning-point-button"
        onClick={() => onAddNew?.()}
        className="mt-4 cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        New Turning Point
      </button>
    </div>
  );
};
