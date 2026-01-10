import { DarkThemeToggle, Navbar, NavbarBrand } from "flowbite-react";
import { AdventureDropdown } from "./components/AdventureDropdown";
import { AdventureTitle } from "./components/AdventureTitle";
import { AdventureDescription } from "./components/AdventureDescription";
import { CharacterList } from "./components/CharacterList";
import { PlotLineList } from "./components/PlotLineList";
import { ThemesList } from "./components/ThemesList";
import { TurningPointCards } from "./components/TurningPointCards";
import TurningPointModal from "./components/TurningPointModal";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "./store";
import type { TurningPoint } from "./types/Adventure";
import {
  addTurningPoint,
  updateTurningPoint,
  deleteTurningPoint,
} from "./slices/adventureSlice";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTurningPoint, setCurrentTurningPoint] =
    useState<TurningPoint | null>(null);
  const [isNewTurningPoint, setIsNewTurningPoint] = useState(false);
  const dispatch = useDispatch();

  const adventures = useSelector(
    (state: RootState) => state.adventure.adventures,
  );
  const selectedAdventureId = useSelector(
    (state: RootState) => state.adventure.selectedAdventureId,
  );

  const currentAdventure = adventures.find(
    (adv) => adv.id === selectedAdventureId,
  );

  const handleCardClick = (turningPointId: number) => {
    const turningPoint = currentAdventure?.turningPoints.find(
      (tp) => tp.id === turningPointId,
    );
    if (turningPoint) {
      setCurrentTurningPoint(turningPoint);
      setIsNewTurningPoint(false);
      setIsModalOpen(true);
    }
  };

  const handleAddNew = () => {
    // Create a new empty turning point
    const newTurningPoint: TurningPoint = {
      id: Date.now(), // Use timestamp as temporary ID
      title: "",
      notes: "",
      plotLine: "",
      charactersInvolved: [],
      plotPoints: [],
    };
    setCurrentTurningPoint(newTurningPoint);
    setIsNewTurningPoint(true);
    setIsModalOpen(true);
  };

  const handleSave = (turningPoint: TurningPoint) => {
    if (!selectedAdventureId) return;

    if (isNewTurningPoint) {
      // This is a new turning point
      const newTurningPoint = {
        ...turningPoint,
        id: Date.now(), // Generate a new unique ID
      };
      dispatch(
        addTurningPoint({
          adventureId: selectedAdventureId,
          turningPoint: newTurningPoint,
        }),
      );
    } else {
      // This is an existing turning point
      dispatch(
        updateTurningPoint({
          adventureId: selectedAdventureId,
          turningPointId: turningPoint.id,
          turningPoint,
        }),
      );
    }

    setIsModalOpen(false);
    setIsNewTurningPoint(false);
  };

  const handleDelete = (turningPointId: number) => {
    if (!selectedAdventureId) return;

    dispatch(
      deleteTurningPoint({
        adventureId: selectedAdventureId,
        turningPointId,
      }),
    );

    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <main className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
      <div className="w-full">
        <Navbar fluid>
          <NavbarBrand href="/">
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              Adventure Crafter Sheet
            </span>
          </NavbarBrand>
          <div className="flex flex-1 justify-center dark:text-white">
            <AdventureDropdown />
          </div>
          <div className="flex items-center">
            <DarkThemeToggle />
          </div>
        </Navbar>
      </div>
      <div className="container mx-auto max-w-7xl flex-1 px-4 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <AdventureTitle />
          <AdventureDescription />
          <ThemesList />
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CharacterList />
          <PlotLineList />
        </div>
        <div className="mt-6">
          <TurningPointCards
            onClick={handleCardClick}
            onAddNew={handleAddNew}
          />
        </div>
      </div>

      <TurningPointModal
        isOpen={isModalOpen}
        turningPoint={
          currentTurningPoint || {
            id: 0,
            title: "",
            notes: "",
            plotLine: "",
            charactersInvolved: [],
            plotPoints: [],
          }
        }
        onSave={handleSave}
        onDelete={handleDelete}
        onCancel={handleCancel}
      />
    </main>
  );
}
