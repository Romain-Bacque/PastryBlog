import styled from "@emotion/styled";
import Image, { ImageProps } from "next/image";
import {
  Container,
  ContainerProps,
  Typography,
  TypographyProps,
} from "@mui/material";
import { ExtendedMuiProps } from "../../global/types";

export const StyledContainer = styled(Container)<ContainerProps>({
  width: 800,
  maxWidth: "90%",
});

export const StyledTitle = styled(Typography)<
  ExtendedMuiProps<TypographyProps>
>({
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

export const StyledDate = styled(Typography)<TypographyProps>({
  fontSize: "1.2rem",
  color: "gray",
});

export const StyledImage = styled(Image)<ImageProps>({
  width: "100%",
  margin: "1rem 0",
});

export const StyledDescription = styled(Typography)<TypographyProps>({
  color: "brown",
});
