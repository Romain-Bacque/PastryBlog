import { Response } from "../../global/types";

// interfaces
export interface CommentsProps {
  pastryId: string;
}
export interface Comment {
  _id: string;
  name: string;
  date: string;
  email: string;
  text: string;
  pastryId: string;
  responses: Response[];
}
export interface CommentsRequestResponseData {
  comments: Comment[];
}
export interface ResponsesRequestResponseData {
  responses: Response[];
}
export interface MutationParams {
  commentKind: "comments" | "responses";
  commentId: string;
}
export interface CommentState {
  commentKind: "comments" | "responses" | null;
  commentId: string | null;
}
