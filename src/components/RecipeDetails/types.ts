import { Recipe } from "../../global/types";

// aliases
export type RecipeDetailsProps = Omit<Recipe, "categories"> & {
  content?: string;
};
export type Type = RecipeDetailsProps;
