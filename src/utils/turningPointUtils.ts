import type { TurningPoint } from "../types/Adventure";

export function getNextTurningPointId(turningPoints: TurningPoint[]): number {
  if (turningPoints.length === 0) {
    return 1;
  }
  const maxId = Math.max(...turningPoints.map((tp) => tp.id));
  return maxId + 1;
}
