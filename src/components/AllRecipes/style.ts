import styled from "@emotion/styled";
import { Typography, TypographyProps } from "@mui/material";
import { ExtendedMuiProps } from "../../global/types";

export const StyledTitle = styled(Typography)<ExtendedMuiProps<TypographyProps>>({
  textTransform: "capitalize",
  position: "relative",
  textAlign: "center",
  padding: "1rem",
  marginBottom: "4rem",
  fontSize: "2rem",
  "&:after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "100px",
    borderBottom: "2px solid black",
  },
});