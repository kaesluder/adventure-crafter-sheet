import { describe, it, expect } from "vitest";
import adventureReducer, {
  addAdventure,
  updateAdventure,
  deleteAdventure,
  addTurningPoint,
} from "./adventureSlice";
import type { Adventure, TurningPoint } from "../types/Adenture";

describe("adventureSlice", () => {
  const initialState = {
    adventures: [
      {
        id: 1,
        title: "",
        description: "",
        characters: [],
        plotLines: [],
        themes: ["", "", "", "", ""],
        notes: "",
        turningPoints: [],
      },
    ],
  };

  it("should return the initial state", () => {
    expect(adventureReducer(undefined, { type: "unknown" })).toEqual(
      initialState,
    );
  });

  describe("addAdventure", () => {
    it("should add a new adventure to the state", () => {
      const newAdventure: Adventure = {
        id: 2,
        title: "New Adventure",
        description: "A new adventure description",
        characters: ["Hero", "Villain"],
        plotLines: ["Main plot"],
        themes: ["theme1", "theme2", "theme3", "theme4", "theme5"],
        notes: "Some notes",
        turningPoints: [],
      };

      const actual = adventureReducer(initialState, addAdventure(newAdventure));

      expect(actual.adventures).toHaveLength(2);
      expect(actual.adventures[1]).toEqual(newAdventure);
    });
  });

  describe("updateAdventure", () => {
    it("should update an existing adventure", () => {
      const updatedAdventure: Adventure = {
        id: 1,
        title: "Updated Title",
        description: "Updated description",
        characters: ["New character"],
        plotLines: ["New plot"],
        themes: ["new1", "new2", "new3", "new4", "new5"],
        notes: "Updated notes",
        turningPoints: [],
      };

      const actual = adventureReducer(
        initialState,
        updateAdventure({ id: 1, ...updatedAdventure }),
      );

      expect(actual.adventures[0]).toEqual(updatedAdventure);
    });

    it("should not modify state if adventure id is not found", () => {
      const updatedAdventure: Adventure = {
        id: 999,
        title: "Non-existent",
        description: "Should not be added",
        characters: [],
        plotLines: [],
        themes: ["", "", "", "", ""],
        notes: "",
        turningPoints: [],
      };

      const actual = adventureReducer(
        initialState,
        updateAdventure({ id: 999, ...updatedAdventure }),
      );

      expect(actual).toEqual(initialState);
    });
  });

  describe("deleteAdventure", () => {
    it("should delete an adventure by id", () => {
      const stateWithMultipleAdventures = {
        adventures: [
          initialState.adventures[0],
          {
            id: 2,
            title: "Adventure 2",
            description: "Second adventure",
            characters: [],
            plotLines: [],
            themes: ["", "", "", "", ""],
            notes: "",
            turningPoints: [],
          },
        ],
      };

      const actual = adventureReducer(
        stateWithMultipleAdventures,
        deleteAdventure(2),
      );

      expect(actual.adventures).toHaveLength(1);
      expect(actual.adventures[0].id).toBe(1);
    });

    it("should not modify state if adventure id is not found", () => {
      const actual = adventureReducer(initialState, deleteAdventure(999));

      expect(actual).toEqual(initialState);
    });
  });

  describe("addTurningPoint", () => {
    it("should add a turning point to an existing adventure", () => {
      const turningPoint: TurningPoint = {
        id: 1,
        title: "Major Event",
        notes: "Something important happens",
        plotLine: "Main plot",
        charactersInvolved: ["Hero", "Villain"],
        plotPoints: ["Point 1", "Point 2"],
      };

      const actual = adventureReducer(
        initialState,
        addTurningPoint({ adventureId: 1, turningPoint }),
      );

      expect(actual.adventures[0].turningPoints).toHaveLength(1);
      expect(actual.adventures[0].turningPoints[0]).toEqual(turningPoint);
    });

    it("should not modify state if adventure id is not found", () => {
      const turningPoint: TurningPoint = {
        id: 1,
        title: "Major Event",
        notes: "Something important happens",
        plotLine: "Main plot",
        charactersInvolved: ["Hero"],
        plotPoints: ["Point 1"],
      };

      const actual = adventureReducer(
        initialState,
        addTurningPoint({ adventureId: 999, turningPoint }),
      );

      expect(actual).toEqual(initialState);
    });

    it("should add multiple turning points to an adventure", () => {
      const turningPoint1: TurningPoint = {
        id: 1,
        title: "Event 1",
        notes: "First event",
        plotLine: "Plot A",
        charactersInvolved: ["Hero"],
        plotPoints: ["Point 1"],
      };

      const turningPoint2: TurningPoint = {
        id: 2,
        title: "Event 2",
        notes: "Second event",
        plotLine: "Plot B",
        charactersInvolved: ["Villain"],
        plotPoints: ["Point 2"],
      };

      let state = adventureReducer(
        initialState,
        addTurningPoint({ adventureId: 1, turningPoint: turningPoint1 }),
      );

      state = adventureReducer(
        state,
        addTurningPoint({ adventureId: 1, turningPoint: turningPoint2 }),
      );

      expect(state.adventures[0].turningPoints).toHaveLength(2);
      expect(state.adventures[0].turningPoints[0]).toEqual(turningPoint1);
      expect(state.adventures[0].turningPoints[1]).toEqual(turningPoint2);
    });
  });
});
