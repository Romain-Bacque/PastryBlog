import styled from "@emotion/styled";
import { Paper, PaperProps, Theme } from "@mui/material";
import { ExtendedMuiProps } from "../../../global/types";

// Style
export const StyledPaper = styled(Paper)<ExtendedMuiProps<PaperProps>>({
  display: "flex",
  justifyContent: "start",
  flexWrap: "wrap",
  listStyle: "none",
});
export const ListItem = styled.li({
  margin: "0.5rem",
});
