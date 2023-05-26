// aliases
export interface CategoryType {
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
  tagId: string;
}

export interface AllRecipesProps {
  recipes: Recipe[];
  categories: CategoryType[];
}
