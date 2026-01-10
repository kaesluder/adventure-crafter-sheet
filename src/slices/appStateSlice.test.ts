import { describe, it, expect } from "vitest";
import appStateReducer, { setTurningPointEdit, setSelectedTurningPointId } from "./appStateSlice";

describe("appStateSlice", () => {
  it("should set the turning point edit", () => {
    const initialState = {
      turningPointEdit: false,
      selectedTurningPointId: null,
    };

    const nextState = appStateReducer(
      initialState,
      setTurningPointEdit(true),
    );

    expect(nextState.turningPointEdit).toEqual(true);
    expect(nextState.selectedTurningPointId).toEqual(null);
  });

  it("should set the selected turning point id", () => {
    const initialState = {
      turningPointEdit: false,
      selectedTurningPointId: null,
    };

    const nextState = appStateReducer(
      initialState,
      setSelectedTurningPointId(5),
    );

    expect(nextState.selectedTurningPointId).toEqual(5);
    expect(nextState.turningPointEdit).toEqual(false);
  });

  it("should clear the selected turning point id", () => {
    const initialState = {
      turningPointEdit: true,
      selectedTurningPointId: 3,
    };

    const nextState = appStateReducer(
      initialState,
      setSelectedTurningPointId(null),
    );

    expect(nextState.selectedTurningPointId).toEqual(null);
  });
});
