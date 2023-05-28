// hook import
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
// component import
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuList from "@mui/material/MenuList";
import { Button, IconButton } from "@mui/material";
// other import
import { StyledMenuItem, StyledMenuRounded } from "./style";
import { Paths } from "../types";
import { signOut, useSession } from "next-auth/react";

// Component
function MobileMenu() {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setOpen(false);
  };

  const handleLink = (path: Paths) => {
    router.replace(path);
    setOpen(false);
  };

  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  const handleAuth = () => {
    if (!session?.user) {
      router.replace("/auth");
    } else signOut({ callbackUrl: process.env.NEXT_PUBLIC_HOST_NAME + "/" });
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (anchorRef.current && prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <IconButton ref={anchorRef} onClick={() => setOpen(true)} size="large">
        <StyledMenuRounded fontSize="large" />
      </IconButton>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom-start" ? "left top" : "left bottom",
            }}
          >
            <Paper
              component="nav"
              sx={{ padding: "1.5rem 6rem 1.5rem 3.5rem" }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  onKeyDown={handleListKeyDown}
                  onClick={() => setOpen(false)}
                >
                  <StyledMenuItem onClick={() => handleLink(Paths.HOME)}>
                    Accueil
                  </StyledMenuItem>
                  <StyledMenuItem onClick={() => handleLink(Paths.RECIPES)}>
                    Mes Recettes
                  </StyledMenuItem>
                  {session && (
                    <StyledMenuItem onClick={() => handleLink(Paths.FAVORITES)}>
                      Favories
                    </StyledMenuItem>
                  )}
                  <StyledMenuItem onClick={() => handleLink(Paths.CONTACT)}>
                    Contact
                  </StyledMenuItem>
                  <StyledMenuItem onClick={() => handleLink(Paths.ABOUT)}>
                    A propos
                  </StyledMenuItem>
                  <Button variant="outlined" onClick={handleAuth}>
                    {!session?.user ? "Se connecter" : "Se déconnecter"}
                  </Button>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}

export default MobileMenu;
