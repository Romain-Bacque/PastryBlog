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
