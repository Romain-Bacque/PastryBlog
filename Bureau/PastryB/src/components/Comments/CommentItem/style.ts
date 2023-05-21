import styled from "@emotion/styled";
import { DeleteForever } from "@mui/icons-material";
import { Stack, StackProps } from "@mui/material";

export const StyledBox = styled(Stack)<StackProps>({
  position: "relative",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "1rem",
});
export const StyledDeleteIcon = styled(DeleteForever)({
  position: "absolute",
  top: "-1rem",
  left: "-2rem",
  cursor: "pointer"
})