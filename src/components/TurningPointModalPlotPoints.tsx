import { Label, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";

interface TurningPointModalPlotPointsProps {
  plotPoints: string[];
  onSave: (updatedTurningPoint: { plotPoints: string[] }) => void;
}

export default function TurningPointModalPlotPoints({
  plotPoints,
  onSave,
}: TurningPointModalPlotPointsProps) {
  const [localPlotPoints, setLocalPlotPoints] = useState<string[]>([]);
  const [newPlotPoint, setNewPlotPoint] = useState("");

  // Sync local state with prop when it changes
  useEffect(() => {
    setLocalPlotPoints(plotPoints);
  }, [plotPoints]);

  const handleAddPlotPoint = () => {
    const trimmedPlotPoint = newPlotPoint.trim();

    // Validate input
    if (!trimmedPlotPoint) {
      // Keep focus on input for correction
      return;
    }

    // Check for duplicates
    if (localPlotPoints.includes(trimmedPlotPoint)) {
      setNewPlotPoint("");
      return;
    }

    // Add plotPoint
    const updatedPlotPoints = [...localPlotPoints, trimmedPlotPoint];
    setLocalPlotPoints(updatedPlotPoints);
    onSave({
      plotPoints: updatedPlotPoints,
    });

    setNewPlotPoint("");
  };

  return (
    <div>
      <div className="mb-2 block">
        <Label htmlFor="turning-point-plotpoints">Plot Points</Label>
      </div>
      <div data-testid="plot-points-list" className="mb-4">
        {localPlotPoints.map((plotPoint, index) => (
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
  );
}
