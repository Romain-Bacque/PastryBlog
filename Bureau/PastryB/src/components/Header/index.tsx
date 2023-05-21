import { useEffect, useState } from "react";
import Link from "next/link";
import AppMenu from "../UI/AppMenu";
import { StyledToolBar } from "./style";
import { AppBar } from "@mui/material";

function Header() {
  const [scrollActive, setScrollActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrollActive(true);
      } else {
        setScrollActive(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <AppBar position="fixed" elevation={0}>
      <StyledToolBar className={scrollActive ? "scroll-active" : ""}>
        <Link href="/">Blog De Célia</Link>
        <AppMenu />
      </StyledToolBar>
    </AppBar>
  );
}

export default Header;
