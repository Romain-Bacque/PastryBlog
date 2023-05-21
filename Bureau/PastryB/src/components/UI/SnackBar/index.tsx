// component import
import Stack from "@mui/material/Stack";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
// styled component import
import { StyledMuiAlert } from "./style";
import { CustomSnackbarProps } from "./types";
import { AlertProps } from "@mui/material";
import { ForwardedRef, forwardRef } from "react";

// Child Component
const Alert = forwardRef(
  (props: AlertProps, ref: ForwardedRef<HTMLDivElement>) => (
    <StyledMuiAlert elevation={6} ref={ref} variant="filled" {...props} />
  )
);

// Component
const CustomSnackbar: React.FC<CustomSnackbarProps> = ({
  isOpen,
  message,
  status,
  onClose,
}) => {
  const handleClose = (_: any, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") {
      return;
    }
    onClose();
  };

  return (
    <Stack spacing={2}>
      <Snackbar
        sx={{ opacity: "0.85" }}
        open={isOpen}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={status ? status : undefined}>
          {message}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default CustomSnackbar;
