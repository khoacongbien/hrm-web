import { NavigationComponent } from "./navigation-component";
import AvartarComponent from "./avartar-component";
import LogoComponent from "./logo-component";

export default async function NavbarComponent() {
  return (
    <nav className="flex items-center justify-between px-3 text-gray-500 shadow h-14">
      {/* LEFT MENU  */}
      <LogoComponent />

      {/* CENTER MENU */}
      <NavigationComponent />

      {/* RIGHT MENU */}
      <AvartarComponent />
    </nav>
  );
}
