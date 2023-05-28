import { Button } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Paths } from "../types";
import { StyledLink, StyledUl, StyledLi } from "./style";

const DesktopMenu: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleAuth = () => {
    if (!session?.user) {
      router.replace("/auth");
    } else signOut({ callbackUrl: process.env.NEXT_PUBLIC_HOST_NAME + "/" });
  };

  return (
    <nav>
      <StyledUl>
        <StyledLi>
          <StyledLink href={Paths.HOME}>Accueil</StyledLink>
        </StyledLi>
        <StyledLi>
          <StyledLink href={Paths.RECIPES}>Mes Recettes</StyledLink>
        </StyledLi>
        {session && (
          <StyledLi>
            <StyledLink href={Paths.FAVORITES}>Favories</StyledLink>
          </StyledLi>
        )}
        <StyledLi>
          <StyledLink href={Paths.ABOUT}>A Propos</StyledLink>
        </StyledLi>
        <StyledLi>
          <StyledLink href={Paths.CONTACT}>Contact</StyledLink>
        </StyledLi>
        <Button variant="outlined" onClick={handleAuth}>
          {!session?.user ? "Se connecter" : "Se déconnecter"}
        </Button>
      </StyledUl>
    </nav>
  );
};

export default DesktopMenu;
