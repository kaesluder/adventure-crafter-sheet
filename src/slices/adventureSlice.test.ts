import { describe, it, expect } from "vitest";
import adventureReducer, {
  addAdventure,
  newAdventure,
  updateAdventure,
  deleteAdventure,
  addTurningPoint,
  updateTurningPoint,
} from "./adventureSlice";
import type { Adventure, TurningPoint } from "../types/Adventure";

describe("adventureSlice", () => {
  const initialState = {
    selectedAdventureId: 1,
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
      const adventure: Adventure = {
        id: 2,
        title: "New Adventure",
        description: "A new adventure description",
        characters: ["Hero", "Villain"],
        plotLines: ["Main plot"],
        themes: ["theme1", "theme2", "theme3", "theme4", "theme5"],
        notes: "Some notes",
        turningPoints: [],
      };

      const actual = adventureReducer(initialState, addAdventure(adventure));

      expect(actual.adventures).toHaveLength(2);
      expect(actual.adventures[1]).toEqual(adventure);
    });
  });

  describe("newAdventure", () => {
    it("should create a new adventure with auto-incremented ID", () => {
      const actual = adventureReducer(initialState, newAdventure());

      expect(actual.adventures).toHaveLength(2);
      expect(actual.adventures[1].id).toBe(2);
      expect(actual.adventures[1].title).toBe("");
      expect(actual.adventures[1].description).toBe("");
      expect(actual.adventures[1].characters).toEqual([]);
      expect(actual.adventures[1].plotLines).toEqual([]);
      expect(actual.adventures[1].themes).toEqual(["", "", "", "", ""]);
      expect(actual.adventures[1].notes).toBe("");
      expect(actual.adventures[1].turningPoints).toEqual([]);
    });

    it("should set the new adventure as selected", () => {
      const actual = adventureReducer(initialState, newAdventure());

      expect(actual.selectedAdventureId).toBe(2);
    });

    it("should generate correct ID when adventures have gaps", () => {
      const stateWithGaps = {
        selectedAdventureId: null,
        adventures: [
          initialState.adventures[0],
          { ...initialState.adventures[0], id: 5 },
          { ...initialState.adventures[0], id: 3 },
        ],
      };

      const actual = adventureReducer(stateWithGaps, newAdventure());

      expect(actual.adventures).toHaveLength(4);
      expect(actual.adventures[3].id).toBe(6); // Max ID (5) + 1
      expect(actual.selectedAdventureId).toBe(6);
    });

    it("should handle creating multiple new adventures sequentially", () => {
      let state = adventureReducer(initialState, newAdventure());
      expect(state.adventures).toHaveLength(2);
      expect(state.adventures[1].id).toBe(2);
      expect(state.selectedAdventureId).toBe(2);

      state = adventureReducer(state, newAdventure());
      expect(state.adventures).toHaveLength(3);
      expect(state.adventures[2].id).toBe(3);
      expect(state.selectedAdventureId).toBe(3);

      state = adventureReducer(state, newAdventure());
      expect(state.adventures).toHaveLength(4);
      expect(state.adventures[3].id).toBe(4);
      expect(state.selectedAdventureId).toBe(4);
    });

    it("should start from ID 1 when adventures array is empty", () => {
      const emptyState = {
        selectedAdventureId: null,
        adventures: [],
      };

      const actual = adventureReducer(emptyState, newAdventure());

      expect(actual.adventures).toHaveLength(1);
      expect(actual.adventures[0].id).toBe(1);
      expect(actual.selectedAdventureId).toBe(1);
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
        updateAdventure(updatedAdventure),
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
        updateAdventure(updatedAdventure),
      );

      expect(actual).toEqual(initialState);
    });
  });

  describe("deleteAdventure", () => {
    it("should delete an adventure by id", () => {
      const stateWithMultipleAdventures = {
        selectedAdventureId: null,
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

  describe("updateTurningPoint", () => {
    it("should update an existing turning point", () => {
      const initialTurningPoint: TurningPoint = {
        id: 1,
        title: "Original Event",
        notes: "Original notes",
        plotLine: "Original plot",
        charactersInvolved: ["Hero"],
        plotPoints: ["Point 1"],
      };

      const stateWithTurningPoint = adventureReducer(
        initialState,
        addTurningPoint({ adventureId: 1, turningPoint: initialTurningPoint }),
      );

      const updatedTurningPoint: TurningPoint = {
        id: 1,
        title: "Updated Event",
        notes: "Updated notes",
        plotLine: "Updated plot",
        charactersInvolved: ["Hero", "Villain"],
        plotPoints: ["Point 1", "Point 2", "Point 3"],
      };

      const actual = adventureReducer(
        stateWithTurningPoint,
        updateTurningPoint({
          adventureId: 1,
          turningPointId: 1,
          turningPoint: updatedTurningPoint,
        }),
      );

      expect(actual.adventures[0].turningPoints).toHaveLength(1);
      expect(actual.adventures[0].turningPoints[0]).toEqual(
        updatedTurningPoint,
      );
    });

    it("should not modify state if adventure id is not found", () => {
      const turningPoint: TurningPoint = {
        id: 1,
        title: "Event",
        notes: "Notes",
        plotLine: "Plot",
        charactersInvolved: ["Hero"],
        plotPoints: ["Point 1"],
      };

      const stateWithTurningPoint = adventureReducer(
        initialState,
        addTurningPoint({ adventureId: 1, turningPoint }),
      );

      const updatedTurningPoint: TurningPoint = {
        id: 1,
        title: "Updated Event",
        notes: "Updated notes",
        plotLine: "Updated plot",
        charactersInvolved: ["Villain"],
        plotPoints: ["Point 2"],
      };

      const actual = adventureReducer(
        stateWithTurningPoint,
        updateTurningPoint({
          adventureId: 999,
          turningPointId: 1,
          turningPoint: updatedTurningPoint,
        }),
      );

      expect(actual).toEqual(stateWithTurningPoint);
    });

    it("should not modify state if turning point id is not found", () => {
      const turningPoint: TurningPoint = {
        id: 1,
        title: "Event",
        notes: "Notes",
        plotLine: "Plot",
        charactersInvolved: ["Hero"],
        plotPoints: ["Point 1"],
      };

      const stateWithTurningPoint = adventureReducer(
        initialState,
        addTurningPoint({ adventureId: 1, turningPoint }),
      );

      const updatedTurningPoint: TurningPoint = {
        id: 999,
        title: "Updated Event",
        notes: "Updated notes",
        plotLine: "Updated plot",
        charactersInvolved: ["Villain"],
        plotPoints: ["Point 2"],
      };

      const actual = adventureReducer(
        stateWithTurningPoint,
        updateTurningPoint({
          adventureId: 1,
          turningPointId: 999,
          turningPoint: updatedTurningPoint,
        }),
      );

      expect(actual).toEqual(stateWithTurningPoint);
    });

    it("should update only the specified turning point when multiple exist", () => {
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

      const updatedTurningPoint2: TurningPoint = {
        id: 2,
        title: "Updated Event 2",
        notes: "Updated second event",
        plotLine: "Updated Plot B",
        charactersInvolved: ["Villain", "Sidekick"],
        plotPoints: ["Point 2", "Point 3"],
      };

      const actual = adventureReducer(
        state,
        updateTurningPoint({
          adventureId: 1,
          turningPointId: 2,
          turningPoint: updatedTurningPoint2,
        }),
      );

      expect(actual.adventures[0].turningPoints).toHaveLength(2);
      expect(actual.adventures[0].turningPoints[0]).toEqual(turningPoint1);
      expect(actual.adventures[0].turningPoints[1]).toEqual(
        updatedTurningPoint2,
      );
    });
  });
});
