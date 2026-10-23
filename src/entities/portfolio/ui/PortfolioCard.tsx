import Link from "next/link";
import type { ReactNode } from "react";

import { HeartIcon } from "@/shared/asset/svg/Icons";
import { toLabel } from "@/shared/config/career";
import { formatDate } from "@/shared/lib/format";
import Avatar from "@/shared/ui/Avatar";
import type { PortfolioSummary } from "../model/types";

interface PortfolioCardProps {
  portfolio: PortfolioSummary;
  /** 카드 우측 상단에 얹을 액션 (예: 마이페이지 삭제 버튼) */
  action?: ReactNode;
}

/** 홈/마이페이지 목록에서 쓰는 포트폴리오 카드. */
export default function PortfolioCard({ portfolio, action }: PortfolioCardProps) {
  const { id, title, description, author, createdAt, likeCount, liked } = portfolio;
  const jobRole = toLabel(author?.jobRole);
  const career = toLabel(author?.career);

  return (
    <article className="group relative flex flex-col rounded-xl border border-gray-100 bg-white dark:bg-[#1E1E1E] overflow-hidden transition hover:shadow-[0_8px_20px_0_rgba(0,0,0,0.08)] hover:-translate-y-0.5">
      <Link href={`/portfolio/${id}`} className="flex flex-col flex-1">
        <div className="relative aspect-[16/10] bg-gradient-to-br from-main-100 via-main-100/70 to-main-200/60 flex items-center justify-center px-6">
          <p className="line-clamp-3 text-center text-sm text-main-500/80">
            {description || title}
          </p>
        </div>

        <div className="flex flex-col gap-2.5 p-4">
          <h3 className="font-semibold truncate">{title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Avatar className="size-5" />
            <span className="truncate">{author?.name}</span>
          </div>
          {(jobRole || career) && (
            <div className="flex flex-wrap gap-1.5">
              {jobRole && (
                <span className="px-2 py-0.5 rounded-md bg-main-100 text-xs text-main-500">
                  {jobRole}
                </span>
              )}
              {career && (
                <span className="px-2 py-0.5 rounded-md bg-gray-100 text-xs text-gray-700">
                  {career}
                </span>
              )}
            </div>
          )}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{formatDate(createdAt)}</span>
            <span className={`flex items-center gap-1 ${liked ? "text-main-400" : ""}`}>
              <HeartIcon size={14} filled={liked} />
              {likeCount}
            </span>
          </div>
        </div>
      </Link>
      {action && <div className="absolute top-2 right-2">{action}</div>}
    </article>
  );
}
