"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { toast } from "sonner";

import { useCommentActions, type Comment } from "@/entities/comment";
import type { PortfolioDetail } from "@/entities/portfolio";
import { CheckIcon } from "@/shared/asset/svg/Icons";
import { getErrorMessage } from "@/shared/api/client";
import { popoverPosition } from "../model/popoverPosition";
import CommentForm from "./CommentForm";
import CommentThread from "./CommentThread";
import PortfolioViewer from "./PortfolioViewer";

interface CommentBoardProps {
  portfolio: PortfolioDetail;
  comments: Comment[];
  /** 코멘트 모드: 보드를 클릭하면 그 위치에 새 코멘트를 남길 수 있다 */
  commentMode: boolean;
  canWrite: boolean;
  myName?: string;
}

interface Point {
  xPercent: number;
  yPercent: number;
}

/**
 * 포트폴리오 위에 위치 기반 코멘트 핀을 얹는 보드.
 * 좌표는 보드 크기 대비 % 로 저장해 화면 크기가 달라도 같은 위치를 가리킨다.
 */
export default function CommentBoard({
  portfolio,
  comments,
  commentMode,
  canWrite,
  myName,
}: CommentBoardProps) {
  const { create } = useCommentActions(portfolio.id);
  const [openId, setOpenId] = useState<number | null>(null);
  const [savedDraft, setDraft] = useState<Point | null>(null);
  // 코멘트 모드를 끄면 작성 중이던 위치는 보이지 않는다.
  const draft = commentMode ? savedDraft : null;

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpenId(null);
      setDraft(null);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const handleBoardClick = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const round = (value: number) => Math.round(value * 100) / 100;
    setOpenId(null);
    setDraft({
      xPercent: round(((event.clientX - rect.left) / rect.width) * 100),
      yPercent: round(((event.clientY - rect.top) / rect.height) * 100),
    });
  };

  const openComment = comments.find((comment) => comment.id === openId);

  return (
    <div className="relative h-[70vh] min-h-[480px]">
      <div className="absolute inset-0 rounded-xl overflow-hidden bg-main-100/40 border border-gray-100">
        <PortfolioViewer portfolio={portfolio} />
      </div>

      {/* 코멘트 모드에서만 클릭을 가로채고, 평소엔 아래 포트폴리오를 그대로 조작할 수 있다 */}
      <div
        onClick={commentMode ? handleBoardClick : undefined}
        className={`absolute inset-0 rounded-xl ${
          commentMode
            ? "cursor-crosshair bg-black/[0.03] ring-2 ring-main-300"
            : "pointer-events-none"
        }`}
      >
        {comments.map((comment, index) => (
          <button
            key={comment.id}
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setDraft(null);
              setOpenId((prev) => (prev === comment.id ? null : comment.id));
            }}
            aria-label={`${comment.author.name}님의 코멘트 ${index + 1}`}
            style={{ left: `${comment.xPercent}%`, top: `${comment.yPercent}%` }}
            className={`pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center size-7 rounded-full rounded-bl-none border-2 border-white text-[11px] font-semibold text-white shadow-md cursor-pointer transition-transform hover:scale-110 ${
              comment.resolved ? "bg-gray-400" : "bg-main-300"
            } ${openId === comment.id ? "scale-110 ring-4 ring-main-200/50" : ""}`}
          >
            {comment.resolved ? <CheckIcon size={13} /> : index + 1}
          </button>
        ))}

        {draft && (
          <>
            <span
              style={{ left: `${draft.xPercent}%`, top: `${draft.yPercent}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 size-7 rounded-full rounded-bl-none border-2 border-white bg-main-400 shadow-md"
            />
            <div
              onClick={(event) => event.stopPropagation()}
              style={popoverPosition(draft.xPercent, draft.yPercent)}
              className="pointer-events-auto absolute z-30 w-64 rounded-xl border border-gray-200 bg-white dark:bg-[#1E1E1E] p-3 shadow-[0_8px_24px_0_rgba(0,0,0,0.15)] cursor-default"
            >
              <CommentForm
                autoFocus
                placeholder="코멘트를 입력하세요..."
                submitting={create.isPending}
                onCancel={() => setDraft(null)}
                onSubmit={(content) =>
                  create
                    .mutateAsync({ content, ...draft })
                    .then((created) => {
                      setDraft(null);
                      setOpenId(created?.id ?? null);
                    })
                    .catch((error) => {
                      toast.error(getErrorMessage(error, "코멘트를 등록하지 못했어요."));
                      throw error;
                    })
                }
              />
            </div>
          </>
        )}

        {openComment && (
          <div className="pointer-events-auto">
            <CommentThread
              portfolioId={portfolio.id}
              comment={openComment}
              myName={myName}
              canWrite={canWrite}
              onClose={() => setOpenId(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
