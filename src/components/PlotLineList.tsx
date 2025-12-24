import type { Adventure } from "../types/Adventure";
import React from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import { updateAdventure } from "../slices/adventureSlice";
import { Label, List, ListItem, TextInput } from "flowbite-react";

export const PlotLineList: React.FC = () => {
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

  const [newPlotLine, setNewPlotLine] = useState("");

  const handleAddPlotLine = (e?: React.MouseEvent | React.FormEvent) => {
    console.log("handleAddPlotLine triggered", e?.type);
    e?.preventDefault();
    e?.stopPropagation();

    if (newPlotLine.trim() === "" || !currentAdventure) {
      console.log("Early return", {
        isEmpty: newPlotLine.trim() === "",
        noAdventure: !currentAdventure,
      });
      return;
    }

    const updatedPlotLines = [
      ...currentAdventure.plotLines,
      newPlotLine.trim(),
    ];
    const updatedAdventure: Adventure = {
      ...currentAdventure,
      plotLines: updatedPlotLines,
    };

    console.log("Dispatching update");
    dispatch(updateAdventure(updatedAdventure));
    setNewPlotLine("");
  };

  return (
    <div className="w-full">
      <div className="mb-2">
        <Label>Plot Lines</Label>
      </div>
      <List>
        {currentAdventure?.plotLines.map((plotLine) => (
          <ListItem key={plotLine}>{plotLine}</ListItem>
        ))}
      </List>
      <div className="mt-4">
        <TextInput
          placeholder="Add a new plot line"
          value={newPlotLine}
          onChange={(e) => setNewPlotLine(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddPlotLine(e);
            }
          }}
        />
        <button
          type="button"
          onClick={(e) => {
            console.log("Button clicked!");
            handleAddPlotLine(e);
          }}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer relative z-10 hover:bg-blue-600"
        >
          Add Plot Line
        </button>
      </div>
    </div>
  );
};
