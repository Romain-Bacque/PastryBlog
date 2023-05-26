// hook import
import React, { useEffect, useState } from "react";
// component import
import { Typography, Button, Container } from "@mui/material";
import Input from "../../Input";
import AuthContainerThemeProvider from "../AuthContainerThemeProvider";
// other import
import useInput from "../../../hooks/use-input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import useMyMutation from "../../../hooks/use-mutation";
import useLoading from "../../../hooks/use-loading";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { resetPassword } from "../../../utils/ajax-requests";
import dynamic from "next/dynamic";

// react-password-checklist module is called only in CSR, when it is needed
const ReactPasswordChecklist = dynamic(
  () => import("react-password-checklist"),
  {
    ssr: false, // react-password-checklist is not called on server-side
  }
);
// Component
const ResetPassword: React.FC<{ csrfToken: string }> = ({ csrfToken }) => {
  const [isPasswordMasked, setIsPasswordMasked] = useState(true);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const router = useRouter();
  const { data: session } = useSession();
  const handleLoading = useLoading();
  const {
    value: passwordValue,
    isValid: passwordIsValid,
    isTouched: passwordIsTouched,
    changeHandler: passwordChangeHandler,
    blurHandler: passwordBlurHandler,
    resetHandler: passwordResetHandler,
  } = useInput();
  const {
    errorMessage: resetPasswordErrorMessage,
    useMutation: useResetPasswordMutation,
  } = useMyMutation(resetPassword, null, () => {
    passwordResetHandler();
    setAlertMessage("Mot de passe modifié avec succès !");
  });
  const { status: resetPasswordStatus, mutate: resetPasswordMutate } =
    useResetPasswordMutation;

  const isFormValid = passwordIsValid;

  const handleResetPassword = (event: React.FormEvent) => {
    event.preventDefault();

    if (!isFormValid) return;

    const { i: id, t: token } = router.query;

    resetPasswordMutate({ id, token, password: passwordValue, csrfToken });
  };

  // reset password status snackbar
  useEffect(() => {
    handleLoading(resetPasswordStatus, alertMessage, resetPasswordErrorMessage);
  }, [resetPasswordStatus, alertMessage, resetPasswordErrorMessage]);

  // redirect user if he is logged
  useEffect(() => {
    if (session) router.replace("/");
  });

  return (
    <>
      <AuthContainerThemeProvider>
        <Container component="form" onSubmit={handleResetPassword}>
          <Typography component="h2" variant="h3" color="gray">
            Réinitialiser votre mot de passe
          </Typography>
          <Input
            icon={
              <FontAwesomeIcon
                className="icon"
                onClick={() => setIsPasswordMasked((prevState) => !prevState)}
                icon={isPasswordMasked ? faEyeSlash : faEye}
              />
            }
            label="Entrer le mot de passe :"
            className={
              !passwordIsValid && passwordIsTouched ? "form__input--red" : ""
            }
            input={{
              readOnly: false,
              id: "password",
              type: `${isPasswordMasked ? "password" : "text"}`,
              value: passwordValue,
              onChange: passwordChangeHandler,
              onBlur: passwordBlurHandler,
              placeholder: "Taper le mot de passe ici",
            }}
            name="password"
          />
          {passwordIsTouched && (
            <ReactPasswordChecklist
              rules={[
                "minLength",
                "number",
                "lowercase",
                "capital",
                "specialChar",
              ]}
              minLength={10}
              value={passwordValue}
              messages={{
                minLength: "Au moins 10 caractères.",
                number: "Au moins 1 chiffre.",
                lowercase: "Au moins 1 minuscule.",
                capital: "Au moins 1 majuscule.",
                specialChar: "Au moins 1 caractère spécial.",
              }}
            />
          )}
          <Button type="submit">Réinitialiser le mot de passe</Button>
        </Container>
      </AuthContainerThemeProvider>
    </>
  );
};

export default ResetPassword;
