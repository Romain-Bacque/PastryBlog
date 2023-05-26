import styled from "@emotion/styled";
import { Toolbar, ToolbarProps } from "@mui/material";

export const StyledToolBar = styled(Toolbar)<ToolbarProps>({
  padding: "1rem",
  height: "7rem",
  borderBottom: "1px solid transparent",
  display: "flex",
  justifyContent: "space-between",
  transition: "border-bottom 0.2s linear",
  "&.scroll-active": {
    borderBottom: "1px solid rgb(231, 231, 231)",
  },
});
