"use client";

import { toast } from "sonner";

import { useCommentActions, type Comment } from "@/entities/comment";
import { CheckIcon, CloseIcon, TrashIcon } from "@/shared/asset/svg/Icons";
import { getErrorMessage } from "@/shared/api/client";
import { formatDate } from "@/shared/lib/format";
import Avatar from "@/shared/ui/Avatar";
import { popoverPosition } from "../model/popoverPosition";
import CommentForm from "./CommentForm";

interface CommentThreadProps {
  portfolioId: number;
  comment: Comment;
  myName?: string;
  canWrite: boolean;
  onClose: () => void;
}

/** 핀을 눌렀을 때 뜨는 코멘트 + 답글 팝오버. */
export default function CommentThread({
  portfolioId,
  comment,
  myName,
  canWrite,
  onClose,
}: CommentThreadProps) {
  const { reply, resolve, remove, removeReply } = useCommentActions(portfolioId);
  // 응답에 내 id 가 없어 이름으로 작성자 여부를 판단한다. 실제 권한은 서버가 다시 검사한다.
  const isMine = (name: string) => !!myName && name === myName;

  const onError = (error: unknown) => toast.error(getErrorMessage(error));

  return (
    <div
      onClick={(event) => event.stopPropagation()}
      style={popoverPosition(comment.xPercent, comment.yPercent)}
      className="absolute z-30 w-72 max-h-[360px] overflow-y-auto rounded-xl border border-gray-200 bg-white dark:bg-[#1E1E1E] shadow-[0_8px_24px_0_rgba(0,0,0,0.15)]"
    >
      <div className="flex items-center justify-between gap-2 px-3 py-2.5 border-b border-gray-100">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar src={comment.author.profileImageUrl} className="size-6" />
          <span className="text-sm font-medium truncate">{comment.author.name}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-500">
          {canWrite && !comment.resolved && (
            <button
              type="button"
              onClick={() => resolve.mutate(comment.id, { onError })}
              disabled={resolve.isPending}
              aria-label="해결 처리"
              title="해결 처리"
              className="p-1 rounded hover:bg-main-100 hover:text-main-500 cursor-pointer"
            >
              <CheckIcon size={15} />
            </button>
          )}
          {isMine(comment.author.name) && (
            <button
              type="button"
              onClick={() =>
                remove.mutate(comment.id, { onSuccess: onClose, onError })
              }
              disabled={remove.isPending}
              aria-label="코멘트 삭제"
              title="삭제"
              className="p-1 rounded hover:bg-gray-100 hover:text-red-500 cursor-pointer"
            >
              <TrashIcon size={15} />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="p-1 rounded hover:bg-gray-100 cursor-pointer"
          >
            <CloseIcon size={15} />
          </button>
        </div>
      </div>

      <div className="px-3 py-3 flex flex-col gap-1">
        {comment.resolved && (
          <span className="self-start px-1.5 py-0.5 rounded bg-gray-100 text-[10px] text-gray-600">
            해결됨
          </span>
        )}
        <p className="text-sm whitespace-pre-wrap break-words">{comment.content}</p>
        <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
      </div>

      {comment.replies.length > 0 && (
        <ul className="flex flex-col gap-3 bg-gray-100/40 dark:bg-white/5 px-3 py-3 border-t border-gray-100">
          {comment.replies.map((item) => (
            <li key={item.id} className="flex gap-2">
              <Avatar src={item.author.profileImageUrl} className="size-5 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium truncate">{item.author.name}</span>
                  {isMine(item.author.name) && (
                    <button
                      type="button"
                      onClick={() => removeReply.mutate(item.id, { onError })}
                      aria-label="답글 삭제"
                      className="text-gray-400 hover:text-red-500 cursor-pointer"
                    >
                      <TrashIcon size={12} />
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-700 whitespace-pre-wrap break-words">
                  {item.content}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {canWrite && (
        <div className="px-3 py-3 border-t border-gray-100">
          <CommentForm
            placeholder="답글을 입력하세요..."
            rows={2}
            submitting={reply.isPending}
            onSubmit={(content) =>
              reply.mutateAsync({ commentId: comment.id, content }).catch((error) => {
                onError(error);
                throw error;
              })
            }
          />
        </div>
      )}
    </div>
  );
}
