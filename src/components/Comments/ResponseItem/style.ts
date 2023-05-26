import styled from "@emotion/styled";
import { DeleteForever, Edit } from "@mui/icons-material";
import { Box, Stack, StackProps } from "@mui/material";

export const StyledBox = styled(Stack)<StackProps>({
  position: "relative",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  gap: "1rem",
  padding: "2rem 0",
});
export const IconsContainer = styled(Box)({
  position: "absolute",
  top: "0rem",
  left: "-2rem",
  display: "flex",
  justifyContent: "space-between",
  gap: "0.6rem",
});
export const StyledDeleteIcon = styled(DeleteForever)({
  cursor: "pointer",
});
export const StyledEditIcon = styled(Edit)({
  cursor: "pointer",
});
