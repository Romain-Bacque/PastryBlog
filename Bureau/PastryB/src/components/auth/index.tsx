// hook import
import React, { FormEventHandler, useEffect, useState } from "react";
import useInput from "../../hooks/use-input";
import { signIn, useSession } from "next-auth/react";
// component import
import { Button, Typography, Container, Box, Divider } from "@mui/material";
import Input from "../Input";
import AuthContainerThemeProvider from "./AuthContainerThemeProvider";
// other import
import { ResetNotRegisteredLink, ResetPasswordLink } from "./style";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import useMyMutation from "../../hooks/use-mutation";
import useLoading from "../../hooks/use-loading";
import { signUp } from "../../utils/ajax-requests";
import dynamic from "next/dynamic";
import GoogleButton from "react-google-button";

// react-password-checklist module is called only in CSR, when it is needed
const ReactPasswordChecklist = dynamic(
  () => import("react-password-checklist"),
  {
    ssr: false, // react-password-checklist is not called on server-side
  }
);

// Component
const Auth: React.FC<{ csrfToken: string }> = ({ csrfToken }) => {
  const handleLoading = useLoading();
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [isPasswordMasked, setIsPasswordMasked] = useState(true);
  const [isRegistered, setIsRegistered] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();
  const {
    value: usernameValue,
    isValid: usernameIsValid,
    isTouched: usernameIsTouched,
    changeHandler: usernameChangeHandler,
    blurHandler: usernameBlurHandler,
    resetHandler: usernameResetHandler,
  } = useInput();
  const {
    value: emailValue,
    isValid: emailIsValid,
    isTouched: emailIsTouched,
    changeHandler: emailChangeHandler,
    blurHandler: emailBlurHandler,
    resetHandler: emailResetHandler,
  } = useInput();
  const {
    value: passwordValue,
    isValid: passwordIsValid,
    isTouched: passwordIsTouched,
    changeHandler: passwordChangeHandler,
    blurHandler: passwordBlurHandler,
    resetHandler: passwordResetHandler,
  } = useInput();

  const { errorMessage: loginErrorMessage, useMutation: useLoginMutation } =
    useMyMutation(
      async (args) => {
        const res = await signIn(...args);

        if (!res?.ok) throw { status: res?.status };
      },
      null,
      () => router.replace("/")
    );
  const { status: loginStatus, mutate: loginMutate } = useLoginMutation;

  const {
    errorMessage: registerErrorMessage,
    useMutation: useRegisterMutation,
  } = useMyMutation(signUp, null, () => {
    usernameResetHandler();
    emailResetHandler();
    passwordResetHandler();
    setAlertMessage("Vous êtes enregistré avec succès !");
  });
  const { status: registerStatus, mutate: registerMutate } =
    useRegisterMutation;

  const isFormValid = isRegistered
    ? emailIsValid && passwordIsValid
    : usernameIsValid && emailIsValid && passwordIsValid;

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (!isFormValid) return;

    if (isRegistered) {
      loginMutate([
        "credentials",
        {
          email: emailValue,
          password: passwordValue,
          csrfToken,
          redirect: false,
        },
      ]);
    } else {
      // signing up
      registerMutate({
        username: usernameValue,
        email: emailValue,
        password: passwordValue,
        csrfToken,
      });
    }
  };

  const handleAuthChoice = (event: React.MouseEvent) => {
    event.preventDefault();

    usernameResetHandler();
    emailResetHandler();
    passwordResetHandler();
    setIsPasswordMasked(true);
    setIsRegistered(!isRegistered);
  };

  // signIn snackbar
  useEffect(() => {
    handleLoading(loginStatus, "Bienvenue !", loginErrorMessage);
  }, [loginStatus, alertMessage, loginErrorMessage]);

  // signUp snackbar
  useEffect(() => {
    handleLoading(registerStatus, alertMessage, registerErrorMessage);
  }, [registerStatus, alertMessage, registerErrorMessage]);

  // redirect user if he is logged
  useEffect(() => {
    if (session) router.replace("/");
  });

  return (
    <>
      {/* If user is connected, then we redirect to home page */}
      <AuthContainerThemeProvider>
        <Container component="form" onSubmit={handleSubmit}>
          <Typography component="h2" variant="h4" color="gray">
            {isRegistered ? "Se Connecter" : "S'inscrire"}
          </Typography>
          {!isRegistered && (
            <Input
              label="Entrer le nom d'utilisateur :"
              className={
                !usernameIsValid && usernameIsTouched ? "form__input--red" : ""
              }
              input={{
                readOnly: false,
                id: "username",
                type: "text",
                value: usernameValue,
                onChange: usernameChangeHandler,
                onBlur: usernameBlurHandler,
                placeholder: "Taper le nom d'utilsateur ici",
              }}
              name="username"
              errorMessage={{
                isVisible: !usernameIsValid && usernameIsTouched,
                text: "Entrée incorrecte",
              }}
            />
          )}
          <Input
            label="Entrer l'email :"
            className={
              !emailIsValid && emailIsTouched ? "form__input--red" : ""
            }
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
          {isRegistered && (
            <ResetPasswordLink href="/auth/forgot-password">
              Mot de passe perdu
            </ResetPasswordLink>
          )}
          <Button sx={{ margin: "auto" }} type="submit" variant="contained">
            {isRegistered ? "Se connecter" : "S'inscrire"}
          </Button>
          <Divider sx={{ m: 2 }} />
          <GoogleButton
            label={`${
              isRegistered ? "Se connecter" : "S'inscrire"
            } avec Google`}
            type="light"
            style={{ margin: "auto", width: "90%" }}
            onClick={() => signIn("google")}
          />
          <Box textAlign="center">
            <ResetNotRegisteredLink onClick={handleAuthChoice} href="">
              {isRegistered
                ? "Vous n'avez pas de compte ?"
                : "Vous avez un compte ?"}
            </ResetNotRegisteredLink>
          </Box>
        </Container>
      </AuthContainerThemeProvider>
    </>
  );
};

export default Auth;
