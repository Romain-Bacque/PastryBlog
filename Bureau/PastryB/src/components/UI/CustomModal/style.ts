import styled from "@emotion/styled";
import { Card, IconButton } from "@mui/material";

// Style
export const StyledIconButton = styled(IconButton)({
  position: "absolute",
  top: "0",
  right: "0",
});
export const StyledCard = styled(Card)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "500px",
  maxWidth: "90%",
  maxHeight: "95%",
  padding: "1.5rem",
});
