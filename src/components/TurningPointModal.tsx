import type { TurningPoint } from "../types/Adventure";
import {
  Modal,
  Label,
  TextInput,
  ModalHeader,
  ModalBody,
} from "flowbite-react";

interface TurningPointModalProps {
  show: boolean;
  turningPoint: TurningPoint;
  onClose: () => void;
}

export default function TurningPointModal({
  show,
  turningPoint,
  onClose,
}: TurningPointModalProps) {
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
              value={turningPoint.title}
              readOnly
            />
          </div>

          {/* Notes Field */}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="turning-point-notes">Notes</Label>
            </div>
            <TextInput
              id="turning-point-notes"
              type="text"
              value={turningPoint.notes}
              readOnly
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
              value={turningPoint.plotLine}
              readOnly
            />
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}
