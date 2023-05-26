// hooks import
import { useEffect, useState } from "react";
import { HttpStateKind, SnackbarSeverityKind } from "../../../global/types";
// components import
import Loader from "../Loader";
import CustomSnackbar from "../SnackBar";
// types import
import { LoaderAndAlertProps, StatutMessage } from "./types";

// constante & variable
const initialAlertState = {
  message: "",
  alertKind: null,
  show: false,
};

// component
const LoaderAndAlert: React.FC<LoaderAndAlertProps> = (props) => {
  const [alertStatut, setAlertStatut] =
    useState<StatutMessage>(initialAlertState);

  const { statut, message, absolutePosition } = props;

  useEffect(() => {
    if (statut === "success") {
      if (!message.successMessage) return setAlertStatut(initialAlertState);
      setAlertStatut({
        message: message.successMessage,
        alertKind: SnackbarSeverityKind.SUCCESS,
        show: true,
      });
    } else if (statut === "error") {
      if (!message.errorMessage) return setAlertStatut(initialAlertState);
      setAlertStatut({
        message: message.errorMessage,
        alertKind: SnackbarSeverityKind.ERROR,
        show: true,
      });
    }
  }, [statut, message.errorMessage, message.successMessage]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    // if Alert component is already shown, then we hide it
    if (alertStatut.show) {
      timer = setTimeout(() => {
        setAlertStatut((prevState) => ({ ...prevState, show: false }));
      }, 4000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [alertStatut.show]);

  return (
    <>
      {statut === "loading" && <Loader absolutePosition={absolutePosition} />}
      {(statut === "success" || statut === "error") && (
        <CustomSnackbar
          message={alertStatut.message}
          status={alertStatut.alertKind}
          isOpen={alertStatut.show}
          onClose={() =>
            setAlertStatut((prevState) => ({ ...prevState, show: false }))
          }
        />
      )}
    </>
  );
};

export default LoaderAndAlert;

LoaderAndAlert.defaultProps = {
  absolutePosition: false,
};
