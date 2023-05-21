export interface DeleteComment {
  commentKind: "comments" | "responses";
  commentId: string;
  pastryId: string;
}
export interface UpdatedResponse {
  text: string;
  date: string;
}
