import axios from "axios";
import { DeleteComment, UpdatedResponse } from "./types";
import {
  Comment,
  ForgotPassword,
  ResetPassword,
  Response,
  UserRegister,
} from "../global/types";

// Axios configuration
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HOST_NAME + "/api/",
  withCredentials: true, // authorize cookie sending to server
});

// User Requests
export async function signUp(reqBody: UserRegister) {
  const { username, email, password, csrfToken } = reqBody;

  await instance.post(
    `/auth/signup`,
    {
      username,
      email,
      password,
    },
    {
      headers: { "csrf-token": csrfToken },
    }
  );
}

// password recover link
export async function sendEmailForLink(reqBody: ForgotPassword) {
  const { email, csrfToken } = reqBody;

  await instance.post(
    `/auth/forgot-password`,
    {
      email,
    },
    {
      headers: { "csrf-token": csrfToken },
    }
  );
}

// reset password
export async function resetPassword(reqBody: ResetPassword) {
  const { id, token, password, csrfToken } = reqBody;

  await instance.patch(
    `/auth/reset-password?i=${id}&t=${token}`,
    {
      password,
    },
    {
      headers: { "csrf-token": csrfToken },
    }
  );
}

// Comment & Response Requests
export async function getPageCommentsById(pastryId: string, pageParam: number) {
  const response = await instance.get(`/comments/${pastryId}/${pageParam}`);

  return response.data?.comments;
}

export async function addComment(reqBody: Comment) {
  const response = await instance.post(`/comments`, reqBody);

  return response.data?.comment;
}

export async function addResponse(params: {
  commentId: string;
  pastryId: string;
  reqBody: Response;
}) {
  const { commentId, pastryId, reqBody } = params;

  const response = await instance.post(
    `/responses/${commentId}/${pastryId}`,
    reqBody
  );

  return response.data?.response;
}

export async function deleteComment(params: DeleteComment) {
  const { commentKind, commentId, pastryId } = params;

  const response = await instance.delete(
    `/${commentKind}/${commentId}/${pastryId}`
  );

  return response.data?.comments;
}

export async function updateResponse({
  reqBody,
  id,
}: {
  reqBody: UpdatedResponse;
  id: string;
}) {
  await instance.patch(`/responses/${id}`, reqBody);
}
