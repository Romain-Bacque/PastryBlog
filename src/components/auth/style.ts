import styled from "@emotion/styled";
import Link from "next/link";

// Style
export const ResetPasswordLink = styled(Link)({
  display: "block",
  fontSize: "1rem",
  width: "fit-content",
  color: "#c45d32",
  textDecoration: "none",
  marginBottom: "1rem",
  "&:hover": {
    textDecoration: "underline",
  },
});
export const ResetNotRegisteredLink = styled(Link)({
  display: "inline-block",
  marginTop: "1rem",
  fontSize: "0.8rem",
  fontWeight: 700,
  textTransform: "uppercase",
  width: "fit-content",
  color: "#c45d32",
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
  },
});
