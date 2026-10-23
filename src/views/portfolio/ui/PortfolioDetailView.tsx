"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { useComments } from "@/entities/comment";
import { usePortfolio, useToggleLike } from "@/entities/portfolio";
import { useAuthStatus, useMyProfile } from "@/entities/user";
import { ArrowLeftIcon, CommentIcon, HeartIcon } from "@/shared/asset/svg/Icons";
import { getErrorMessage } from "@/shared/api/client";
import { toLabel } from "@/shared/config/career";
import { formatDate } from "@/shared/lib/format";
import Avatar from "@/shared/ui/Avatar";
import { CommentBoard } from "@/widgets/comment-board";
import { Header } from "@/widgets/header";

export default function PortfolioDetailView({ id }: { id: number }) {
  const router = useRouter();
  const { data: auth } = useAuthStatus();
  const isMember = !!auth?.authenticated && !!auth.signupCompleted;
  const { data: profile } = useMyProfile(isMember);

  const { data: portfolio, isPending, isError, error } = usePortfolio(id);
  const { data: comments = [] } = useComments(id);
  const toggleLike = useToggleLike(id);
  const [commentMode, setCommentMode] = useState(false);

  // 비회원이 코멘트/좋아요를 누르면 로그인 화면으로 보낸다.
  const requireMember = () => {
    if (isMember) return true;
    toast.info("로그인 후 이용할 수 있어요.");
    router.push("/signin");
    return false;
  };

  const handleLike = () => {
    if (!portfolio || !requireMember()) return;
    toggleLike.mutate(!portfolio.liked, {
      onError: (err) => toast.error(getErrorMessage(err)),
    });
  };

  const meta = portfolio
    ? [toLabel(portfolio.author?.jobRole), toLabel(portfolio.author?.career)]
        .filter(Boolean)
        .join(" | ")
    : "";
  const openCount = comments.filter((comment) => !comment.resolved).length;

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      <Header />
      <main className="max-w-[1000px] mx-auto px-4 sm:px-6 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-main-400 transition-colors"
        >
          <ArrowLeftIcon size={15} />
          뒤로가기
        </Link>

        {isPending && <DetailSkeleton />}

        {isError && (
          <p className="py-24 text-center text-sm text-gray-500">
            {getErrorMessage(error, "포트폴리오를 불러오지 못했어요.")}
          </p>
        )}

        {portfolio && (
          <>
            <section className="mt-6 flex flex-col gap-2">
              <h1 className="text-2xl font-bold">{portfolio.title}</h1>
              {portfolio.description && (
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {portfolio.description}
                </p>
              )}
            </section>

            <div className="mt-6 pb-6 border-b border-gray-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="size-10" />
                <div className="min-w-0">
                  <p className="font-medium truncate">{portfolio.author?.name}</p>
                  {meta && <p className="text-sm text-gray-600 truncate">{meta}</p>}
                </div>
              </div>
              <span className="shrink-0 text-sm text-gray-500">
                {formatDate(portfolio.createdAt)}
              </span>
            </div>

            <div className="mt-6 mb-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => requireMember() && setCommentMode((prev) => !prev)}
                aria-pressed={commentMode}
                className={`inline-flex items-center gap-1.5 h-10 px-4 rounded-[10px] text-sm font-semibold transition-colors cursor-pointer ${
                  commentMode
                    ? "bg-main-400 text-white hover:bg-main-500"
                    : "bg-main-100 text-main-500 hover:brightness-95"
                }`}
              >
                <CommentIcon size={16} />
                {commentMode ? "코멘트 모드 종료" : "코멘트 모드"}
              </button>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {comments.length}개의 코멘트
                  {comments.length > 0 && openCount !== comments.length && (
                    <span className="text-gray-400"> · 미해결 {openCount}</span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={handleLike}
                  disabled={toggleLike.isPending}
                  aria-pressed={portfolio.liked}
                  aria-label={portfolio.liked ? "좋아요 취소" : "좋아요"}
                  className={`inline-flex items-center gap-1.5 h-10 px-4 rounded-[10px] text-sm transition-colors cursor-pointer ${
                    portfolio.liked
                      ? "bg-main-100 text-main-500"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <HeartIcon size={16} filled={portfolio.liked} />
                  {portfolio.likeCount}
                </button>
              </div>
            </div>

            <CommentBoard
              portfolio={portfolio}
              comments={comments}
              commentMode={commentMode}
              canWrite={isMember}
              myName={profile?.name}
            />

            <p className="mt-4 rounded-[10px] bg-main-100/50 px-4 py-3 text-sm text-main-500">
              {commentMode
                ? "피드백을 남기고 싶은 위치를 클릭하세요. 마커를 누르면 코멘트를 확인하고 답글을 남길 수 있어요."
                : "코멘트 모드를 켜면 포트폴리오 위 원하는 위치에 피드백을 남길 수 있어요."}
            </p>
          </>
        )}
      </main>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="mt-6 flex flex-col gap-4 animate-pulse">
      <div className="h-7 w-1/2 rounded bg-gray-100" />
      <div className="h-4 w-full rounded bg-gray-100" />
      <div className="h-4 w-3/4 rounded bg-gray-100" />
      <div className="mt-6 h-[60vh] rounded-xl bg-gray-100" />
    </div>
  );
}
