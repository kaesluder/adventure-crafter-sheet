import { DarkThemeToggle, Navbar, NavbarBrand } from "flowbite-react";
import { AdventureDropdown } from "./components/AdventureDropdown";
import { AdventureTitle } from "./components/AdventureTitle";
import { AdventureDescription } from "./components/AdventureDescription";
import { CharacterList } from "./components/CharacterList";
import { PlotLineList } from "./components/PlotLineList";
import { ThemesList } from "./components/ThemesList";
import { TurningPointCards } from "./components/TurningPointCards";
import TurningPointModal from "./components/TurningPointModal";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "./store";
import type { Adventure, TurningPoint } from "./types/Adventure";
import { setTurningPointEdit, setSelectedTurningPointId } from "./slices/appStateSlice";
import { addTurningPoint } from "./slices/adventureSlice";
import { getNextTurningPointId } from "./utils/turningPointUtils";

export default function App() {
  const dispatch = useDispatch();
  const adventures = useSelector((state: RootState) => state.adventure.adventures);
  const selectedAdventureId = useSelector((state: RootState) => state.adventure.selectedAdventureId);
  const turningPointEdit = useSelector((state: RootState) => state.appState.turningPointEdit);
  const selectedTurningPointId = useSelector((state: RootState) => state.appState.selectedTurningPointId);

  const currentAdventure = adventures.find(
    (adv: Adventure) => adv.id === selectedAdventureId,
  );

  const handleCardClick = (id: number) => {
    dispatch(setSelectedTurningPointId(id));
    dispatch(setTurningPointEdit(true));
  };

  const handleAddNew = () => {
    if (!currentAdventure) return;

    const newId = getNextTurningPointId(currentAdventure.turningPoints);
    const newTurningPoint = {
      id: newId,
      title: "",
      notes: "",
      plotLine: "",
      charactersInvolved: [],
      plotPoints: [],
    };

    dispatch(addTurningPoint({
      adventureId: currentAdventure.id,
      turningPoint: newTurningPoint,
    }));
    dispatch(setSelectedTurningPointId(newId));
    dispatch(setTurningPointEdit(true));
  };

  const handleCloseModal = () => {
    dispatch(setTurningPointEdit(false));
    dispatch(setSelectedTurningPointId(null));
  };

  const selectedTurningPoint = currentAdventure?.turningPoints.find(
    (tp: TurningPoint) => tp.id === selectedTurningPointId
  );

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
          <TurningPointCards onClick={handleCardClick} onAddNew={handleAddNew} />
        </div>
      </div>
      {turningPointEdit && selectedTurningPoint && (
        <TurningPointModal
          show={turningPointEdit}
          turningPoint={selectedTurningPoint}
          onClose={handleCloseModal}
        />
      )}
    </main>
  );
}
