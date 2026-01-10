import { describe, it, expect } from "vitest";
import { getNextTurningPointId } from "./turningPointUtils";
import type { TurningPoint } from "../types/Adventure";

describe("getNextTurningPointId", () => {
  it("should return 1 for empty array", () => {
    const result = getNextTurningPointId([]);
    expect(result).toBe(1);
  });

  it("should return max id + 1 for array with one turning point", () => {
    const turningPoints: TurningPoint[] = [
      {
        id: 5,
        title: "Test",
        notes: "",
        plotLine: "",
        charactersInvolved: [],
        plotPoints: [],
      },
    ];
    const result = getNextTurningPointId(turningPoints);
    expect(result).toBe(6);
  });

  it("should return max id + 1 for array with multiple turning points", () => {
    const turningPoints: TurningPoint[] = [
      {
        id: 1,
        title: "First",
        notes: "",
        plotLine: "",
        charactersInvolved: [],
        plotPoints: [],
      },
      {
        id: 5,
        title: "Second",
        notes: "",
        plotLine: "",
        charactersInvolved: [],
        plotPoints: [],
      },
      {
        id: 3,
        title: "Third",
        notes: "",
        plotLine: "",
        charactersInvolved: [],
        plotPoints: [],
      },
    ];
    const result = getNextTurningPointId(turningPoints);
    expect(result).toBe(6);
  });

  it("should handle turning points with non-sequential ids", () => {
    const turningPoints: TurningPoint[] = [
      {
        id: 10,
        title: "Test",
        notes: "",
        plotLine: "",
        charactersInvolved: [],
        plotPoints: [],
      },
      {
        id: 100,
        title: "Test2",
        notes: "",
        plotLine: "",
        charactersInvolved: [],
        plotPoints: [],
      },
    ];
    const result = getNextTurningPointId(turningPoints);
    expect(result).toBe(101);
  });
});
