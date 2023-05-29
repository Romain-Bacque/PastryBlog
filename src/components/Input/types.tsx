import { AutocompleteRenderInputParams } from "@mui/material";
import {
  ChangeEventHandler,
  FocusEventHandler,
  InputHTMLAttributes,
} from "react";

// interfaces
// InputHTMLAttributes<HTMLInputElement> represents all HTML Input Element attributes, other attributes are not authorized
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: JSX.Element;
  className: string;
  label?: string;
  input: {
    params?: AutocompleteRenderInputParams,
    readOnly?: boolean;
    rows?: number;
    id: string;
    type: "text" | "password" | "email" | "textarea" | "tel";
    value: string;
    onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onBlur: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    placeholder?: string;
  };
  errorMessage?: {
    isVisible: boolean;
    text: string;
  };
}
