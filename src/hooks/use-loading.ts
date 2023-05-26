import { useDispatch } from "react-redux";
import { loadingActions } from "../store/loading";

interface HandleLoading {
  (
    statut: "error" | "idle" | "loading" | "success",
    successMessage: string | null,
    errorMessage: string | null
  ): void;
}

const useLoading = (): HandleLoading => {
  const dispatch = useDispatch();

  const handleLoading: HandleLoading = (
    statut,
    successMessage,
    errorMessage
  ) => {
    if (!statut || statut === "idle") return;

    dispatch(loadingActions.setStatut(statut));
    dispatch(
      loadingActions.setMessage({
        success: successMessage,
        error: errorMessage,
      })
    );
  };

  return handleLoading;
};

export default useLoading;
