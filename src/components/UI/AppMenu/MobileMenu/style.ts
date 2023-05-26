import styled from "@emotion/styled";
import { MenuRounded } from "@mui/icons-material";
import { MenuItem, MenuItemProps } from "@mui/material";

// Style
export const StyledMenuItem = styled(MenuItem)<MenuItemProps>({
  textTransform: "capitalize",
  margin: "1rem 0",
  fontSize: "1.2rem",
  color: "rgb(75, 75, 75)",
});
export const StyledMenuRounded = styled(MenuRounded)({
  fontSize: "2.5rem",
});