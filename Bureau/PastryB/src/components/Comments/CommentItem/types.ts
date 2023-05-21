// interfaces
export interface CommentsItemProps {
  _id: string;
  name: string;
  date: string;
  text: string;
  responses: { _id: string; date: string; text: string; commentId: string }[];
  onClick: (arg: string) => void;
  onDelete: (commentKind: "comments" | "responses", commentId: string) => void;
}
