import { DarkThemeToggle, Navbar, NavbarBrand } from "flowbite-react";
import { AdventureDropdown } from "./components/AdventureDropdown";
import { AdventureTitle } from "./components/AdventureTitle";
import { AdventureDescription } from "./components/AdventureDescription";
import { CharacterList } from "./components/CharacterList";
import { PlotLineList } from "./components/PlotLineList";
import { ThemesList } from "./components/ThemesList";

export default function App() {
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
      </div>
    </main>
  );
}
