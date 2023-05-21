// hook import
import { useDispatch, useSelector } from "react-redux";
import React, { useCallback, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
// component import
import { Typography, Button, Container } from "@mui/material";
import Input from "../../Input";
import AuthContainerThemeProvider from "../AuthContainerThemeProvider";
// action creator import
import { resetPassword } from "../../../actions";
import useInput from "../../../hooks/use-input";

let isResetting = false;

// Component
const Register: React.FC = () => {
  const {
    value: passwordValue,
    isValid: passwordIsValid,
    isTouched: passwordIsTouched,
    changeHandler: passwordChangeHandler,
    blurHandler: passwordBlurHandler,
    resetHandler: passwordResetHandler,
  } = useInput();
  const {
    value: confirmPasswordValue,
    isValid: confirmPasswordIsValid,
    isTouched: confirmPasswordIsTouched,
    changeHandler: confirmPasswordChangeHandler,
    blurHandler: confirmPasswordBlurHandler,
    resetHandler: confirmPasswordResetHandler,
  } = useInput();

  const isLogged = useSelector((state) => state.user.isLogged);
  const loading = useSelector((state) => state.loading);
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const [inputStatus, setInputStatus] = useState({
    password: { isValid: false, value: "" },
    confirmPassword: { isValid: false, value: "" },
  });

  const isFormValid =
    inputStatus.password.isValid && inputStatus.confirmPassword.isValid;

  const handleRegister = (event: React.FormEvent) => {
    event.preventDefault();
    if (!isFormValid) return;

    const action = resetPassword(
      params.id,
      params.token,
      inputStatus.password.value
    );

    dispatch(action);
    isResetting = true;
  };

  const handleInputChange = useCallback((name: string, status: string) => {
    setInputStatus((prevState) => ({
      ...prevState,
      [name]: status,
    }));
  }, []);

  // if user password is successfully reinitialized
  useEffect(() => {
    if (loading.status === "success" && isResetting) {
      isResetting = false;
      navigate("/signin");
    }
  }, [loading]);

  return (
    <>
      {/* If user is connected, then we redirect to home page */}
      {isLogged && <Navigate to="/" />}
      <AuthContainerThemeProvider>
        <Container component="form" onSubmit={handleRegister}>
          <Typography component="h2" variant="h3" color="gray">
            Réinitialiser votre mot de passe
          </Typography>
          <Input
            label="Entrer le nouveau mot de passe :"
            className={
              !passwordIsValid && passwordIsTouched ? "form__input--red" : ""
            }
            input={{
              readOnly: false,
              id: "password",
              type: "password",
              value: passwordValue,
              onChange: passwordChangeHandler,
              onBlur: passwordBlurHandler,
              placeholder: "Taper le mot de passe ici",
            }}
            name="password"
          />
          <Input
            label="Confirmer le mot de passe :"
            className={
              !confirmPasswordIsValid && confirmPasswordIsTouched
                ? "form__input--red"
                : ""
            }
            input={{
              id: "confirmPassword",
              type: "password",
              value: confirmPasswordValue,
              onChange: confirmPasswordChangeHandler,
              onBlur: confirmPasswordBlurHandler,
              placeholder: "Confirmer le mot de passe ici",
            }}
            name="confirmPassword"
            valueToMatch={inputStatus.password.value}
            onInputChange={handleInputChange}
          />
          <Button type="submit">Réinitialiser le mot de passe</Button>
        </Container>
      </AuthContainerThemeProvider>
    </>
  );
};

export default Register;
