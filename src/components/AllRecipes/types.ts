import { Recipe, Tag } from "../../global/types";

// interfaces
export interface AllRecipesProps {
  recipes: Recipe[];
  categories: Tag[];
  isFavoritesPage?: boolean | null | undefined;
}
