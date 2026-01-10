import type { TurningPoint } from "../types/Adventure";
import {
  Modal,
  Label,
  TextInput,
  Textarea,
  ModalHeader,
  ModalBody,
} from "flowbite-react";
import { useState } from "react";

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
        </div>
      </ModalBody>
    </Modal>
  );
}
