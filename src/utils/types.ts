export interface DeleteComment {
  commentKind: "comments" | "responses";
  commentId: string;
  pastryId: string;
}
export interface UpdatedResponse {
  text: string;
  date: string;
}
export interface UserFavorite {
  userId: string;
  recipeId: string;
}
export interface getUserFavoritesResponse {
  favorites: string[];
}
