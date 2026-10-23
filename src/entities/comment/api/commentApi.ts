import { api } from "@/shared/api/client";
import type { Comment, CommentCreate, Reply } from "../model/types";

export async function getComments(portfolioId: number) {
  const { data } = await api.get<Comment[]>(`/portfolios/${portfolioId}/comments`);
  return data;
}

export async function createComment(portfolioId: number, input: CommentCreate) {
  // 요청 스키마는 xpercent/ypercent(소문자), 응답은 xPercent 라서 어느 쪽이든 받도록 둘 다 보낸다.
  const { data } = await api.post<Comment>(`/portfolios/${portfolioId}/comments`, {
    content: input.content,
    xpercent: input.xPercent,
    ypercent: input.yPercent,
    xPercent: input.xPercent,
    yPercent: input.yPercent,
  });
  return data;
}

export async function createReply(commentId: number, content: string) {
  const { data } = await api.post<Reply>(`/comments/${commentId}/replies`, { content });
  return data;
}

export async function resolveComment(commentId: number) {
  const { data } = await api.patch<Comment>(`/comments/${commentId}/resolve`);
  return data;
}

export async function deleteComment(commentId: number) {
  await api.delete(`/comments/${commentId}`);
}

export async function deleteReply(replyId: number) {
  await api.delete(`/replies/${replyId}`);
}
