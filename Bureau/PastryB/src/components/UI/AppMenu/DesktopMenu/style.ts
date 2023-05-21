import styled from "@emotion/styled";
import Link from "next/link";

// Style
export const StyledUl = styled.ul({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "2rem",
  fontSize: "1.2rem", 
  fontStyle: "none"   
});

export const StyledLi = styled.li({
  "&:hover": {
    color: "white",
    backgroundColor: "brown",
  }
});

export const StyledLink = styled(Link)({
  display: "inline-block",
  color: "inherit",
  textDecoration: "none",  
  padding: "1rem",
});
