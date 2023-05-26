export interface Categorie {
  _id: string;
  tag: string;
}

export interface CategoryProps {
  categories: { _id: string; tag: string }[];
  onSelectedCategories: (arg: any) => void;
}
