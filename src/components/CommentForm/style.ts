import styled from "@emotion/styled";
import { Container, ContainerProps } from "@mui/material";

export const StyledContainer = styled(Container)<ContainerProps>({
  width: 800,
  maxWidth: "90%",
});

export const StyledLegend = styled.legend({
  textTransform: "capitalize",
  position: "relative",
  textAlign: "center",
  padding: "1rem",
  marginBottom: "2rem",
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

export const StyledButtonContainer = styled.div({
  textAlign: "center",
  marginBottom: "2rem",
});
