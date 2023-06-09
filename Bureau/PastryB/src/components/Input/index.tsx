import classes from "./style.module.css";
// others import
import ErrorIcon from "@mui/icons-material/Error";
// types import
import { InputProps } from "./types";
import { Box } from "@mui/material";

// component
const Input: React.FC<InputProps> = ({
  icon,
  className,
  label,
  input,
  errorMessage,
  children,
}) => {
  return (
    <Box position="relative" width="100%">
      <label className={classes.form__label} htmlFor={input.id}>
        {label}
      </label>
      <div className={classes["form__input-container"]}>
        {input.type !== "textarea" && (
          <div className={classes["form__input-container"]}>
            <input
              className={`${classes.form__input} ${classes[className]}`}
              {...input}
            />
            {icon}
            {errorMessage?.isVisible && (
              <div className={classes["form__error-message"]}>
                <ErrorIcon />
                <p>{errorMessage.text}</p>
              </div>
            )}
          </div>
        )}
        {input.type === "textarea" && (
          <textarea
            className={`${classes.form__input} ${classes[className]}`}
            {...input}
          />
        )}
      </div>
      {children}
    </Box>
  );
};

export default Input;
