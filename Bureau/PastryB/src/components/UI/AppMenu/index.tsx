import { useEffect, useState } from "react";

import MobileMenu from "./MobileMenu";
import DesktopMenu from "./DesktopMenu";

const AppMenu: React.FC = () => {
  const [desktopMenu, setDesktopMenu] = useState(false);

  useEffect(() => {
    const handleShowDoubleView = () => {
      setDesktopMenu(window.innerWidth > 960 ? true : false);
    };

    window.addEventListener("resize", handleShowDoubleView);
    handleShowDoubleView();

    return () => {
      window.removeEventListener("resize", handleShowDoubleView);
    };
  }, []);

  return (
    <>
      {!desktopMenu && <MobileMenu />}
      {desktopMenu && <DesktopMenu />}
    </>
  );
};

export default AppMenu;
