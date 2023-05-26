import { HttpStateKind, SnackbarSeverityKind } from "../../../global/types";

// interfaces
export interface StatutMessage {
  message: string;
  alertKind: null | SnackbarSeverityKind;
  show: boolean;
}
export interface LoaderAndAlertProps {
  absolutePosition?: boolean;
  statut: "error" | "idle" | "loading" | "success";
  message: {
    errorMessage: string | null | undefined;
    successMessage: string | null | undefined;
  };
}
