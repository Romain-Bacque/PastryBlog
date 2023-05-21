// hook import
import React, { useState, useCallback, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
// component import
import { Button, Typography, Container } from "@mui/material";
import Input from "../../Input";
import AuthContainerThemeProvider from "../AuthContainerThemeProvider";
// action creator import
import useInput from "../../../hooks/use-input";
import useLoading from "../../../hooks/use-loading";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useMyMutation from "../../../hooks/use-mutation";
import { sendEmailForLink } from "../../../utils/ajax-requests";

// Component
const ForgetPassword: React.FC<{ csrfToken: string }> = ({ csrfToken }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [alertMessage, setAlertMessage] = useState<string>("");
  const {
    value: emailValue,
    isValid: emailIsValid,
    isTouched: emailIsTouched,
    changeHandler: emailChangeHandler,
    blurHandler: emailBlurHandler,
    resetHandler: emailResetHandler,
  } = useInput();
  const handleLoading = useLoading();
  const {
    errorMessage: emailLinkErrorMessage,
    useMutation: useEmailLinkMutation,
  } = useMyMutation(sendEmailForLink, null, () => {
    emailResetHandler();
    setAlertMessage("Lien de réinitialisation envoyé avec succès !");
  });
  const { status: emailLinkStatus, mutate: emailLinkMutate } =
    useEmailLinkMutation;

  const isFormValid = emailIsValid;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!isFormValid) return;

    emailLinkMutate({ email: emailValue, csrfToken });
  };

  // reset password link status snackbar
  useEffect(() => {
    handleLoading(emailLinkStatus, alertMessage, emailLinkErrorMessage);
  }, [emailLinkStatus, alertMessage, emailLinkErrorMessage]);

  // redirect user if he is logged
  useEffect(() => {
    if (session) router.replace("/");
  });

  return (
    <AuthContainerThemeProvider>
      <Container component="form" onSubmit={handleSubmit}>
        <Typography component="h2" variant="h4" color="gray">
          Réinitialisation Du Mot De Passe
        </Typography>
        <Input
          label="Entrer l'email :"
          className={!emailIsValid && emailIsTouched ? "form__input--red" : ""}
          input={{
            readOnly: false,
            id: "email",
            type: "email",
            value: emailValue,
            onChange: emailChangeHandler,
            onBlur: emailBlurHandler,
            placeholder: "Taper l'email ici",
          }}
          name="email"
          errorMessage={{
            isVisible: !emailIsValid && emailIsTouched,
            text: "Adresse mail incorrecte",
          }}
        />
        <Button sx={{ m: "auto" }} type="submit" variant="contained">
          Envoyer un lien de réinitialisation
        </Button>
      </Container>
    </AuthContainerThemeProvider>
  );
};

export default ForgetPassword;
