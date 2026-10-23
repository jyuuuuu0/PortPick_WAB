import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CommentCreate } from "../model/types";
import {
  createComment,
  createReply,
  deleteComment,
  deleteReply,
  getComments,
  resolveComment,
} from "./commentApi";

export const commentKeys = {
  list: (portfolioId: number) => ["comments", portfolioId] as const,
};

export function useComments(portfolioId: number) {
  return useQuery({
    queryKey: commentKeys.list(portfolioId),
    queryFn: () => getComments(portfolioId),
    enabled: Number.isFinite(portfolioId),
  });
}

/** 코멘트 관련 변경 작업. 성공하면 해당 포트폴리오의 코멘트 목록을 다시 불러온다. */
export function useCommentActions(portfolioId: number) {
  const queryClient = useQueryClient();
  const onSuccess = () =>
    queryClient.invalidateQueries({ queryKey: commentKeys.list(portfolioId) });

  const create = useMutation({
    mutationFn: (input: CommentCreate) => createComment(portfolioId, input),
    onSuccess,
  });
  const reply = useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
      createReply(commentId, content),
    onSuccess,
  });
  const resolve = useMutation({ mutationFn: resolveComment, onSuccess });
  const remove = useMutation({ mutationFn: deleteComment, onSuccess });
  const removeReply = useMutation({ mutationFn: deleteReply, onSuccess });

  return { create, reply, resolve, remove, removeReply };
}
