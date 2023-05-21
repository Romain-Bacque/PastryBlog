// interfaces
export interface ResponseItemProps {
  _id: string;
  text: string;
  date: string;
  commentId: string;
  onDelete: (commentKind: "responses", commentId: string) => void;
}
export interface UpdatedResponse {
  text: string;
  date: string;
}
