import { Tag } from "../../../global/types";

// interfaces
export interface RecipeFormProps {
  onCancel: () => void;
  commentId: string;
  pastryId: string;
}
export interface Response {
  _id: string;
  date: string;
  text: string;
  commentId: string;
}
export interface AddRecipeProps {
  categories: Tag[];
  csrfToken: string;
}
