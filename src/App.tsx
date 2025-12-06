import { DarkThemeToggle, Navbar, NavbarBrand } from "flowbite-react";
import { AdventureDropdown } from "./components/AdventureDropdown";

export default function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-24 dark:bg-gray-900">
      <div className="absolute inset-0 size-full">
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
          <div className="relative h-full w-full select-none">
            <img
              className="absolute right-0 min-w-dvh dark:hidden"
              alt="Pattern Light"
              src="/pattern-light.svg"
            />
            <img
              className="absolute right-0 hidden min-w-dvh dark:block"
              alt="Pattern Dark"
              src="/pattern-dark.svg"
            />
          </div>
        </Navbar>
      </div>
    </main>
  );
}
