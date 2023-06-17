import { Session } from "next-auth";

// enums
export enum HttpStateKind {
  PENDING = 1,
  SUCCESS,
  ERROR,
  IDLE,
}
export enum SnackbarSeverityKind {
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error",
}

// interfaces
export interface UserLogin {
  email: string;
  password: string;
}
export interface UserRegister extends UserLogin {
  username: string;
  csrfToken: string;
}
export interface ForgotPassword {
  email: string;
  csrfToken: string;
}
export interface ResetPassword {
  id: string;
  token: string;
  password: string;
  csrfToken: string;
}
export interface AlertMessageState {
  message: string;
  severity: SnackbarSeverityKind | null;
  isOpen: boolean;
}
export interface Tag {
  _id: string;
  tag: string;
}
export interface Recipe {
  _id: string;
  image?: string;
  title: string;
  date: string;
  description: string;
  content: string;
  categories: Tag[];
}
export interface Comment {
  _id: string;
  name: string;
  email: string;
  date: string;
  text: string;
  pastryId: string;
}
export interface Response {
  _id: string;
  date: string;
  text: string;
  commentId: string;
}
export interface ExtendedSession extends Session {
  user: {
    id?: string | null | undefined;
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
    role?: string | null | undefined;
  };
}
export interface Article {
  date: string;
  title: string;
  description: string;
  content: string;
};


// aliases
export type RecipeKeys = keyof Recipe;
export type ExtendedMuiProps<T> = T & {
  component?: React.ElementType | JSX.Element;
};
export type CommentsPages = {
  pageParams: Array<any>;
  pages: {
    _id: string;
    name: string;
    email: string;
    text: string;
    date: string;
    pastryId: string;
    responses?: Response[];
  }[];
};
