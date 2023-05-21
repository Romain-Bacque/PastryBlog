import { SnackbarSeverityKind } from "../../../global/types";

export interface CustomSnackbarProps {
  isOpen: boolean;
  message: string;
  status: SnackbarSeverityKind | null;
  onClose: () => void;
}
