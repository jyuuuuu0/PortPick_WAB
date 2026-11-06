"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

import { HeartIcon } from "@/shared/asset/svg/Icons";
import { toLabel } from "@/shared/config/career";
import { toAssetUrl } from "@/shared/lib/asset";
import { isImageFile } from "@/shared/lib/embed";
import { formatDate } from "@/shared/lib/format";
import { getPdfThumbnail } from "@/shared/lib/pdf";
import Avatar from "@/shared/ui/Avatar";
import { usePortfolio } from "../api/queries";
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
          <Thumbnail id={id} title={title} />
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

/**
 * 이미지·PDF 로 올린 포트폴리오면 카드 위쪽을 그 이미지(PDF 는 첫 페이지)로 채운다.
 * 목록 API 에 파일 주소가 없어 상세 정보를 불러온다. (상세 페이지와 캐시를 같이 쓴다)
 */
function Thumbnail({ id, title }: { id: number; title: string }) {
  const { data } = usePortfolio(id);
  const fileUrl = data && !data.embedLink ? toAssetUrl(data.fileUrl) : undefined;
  const isImage = !!fileUrl && isImageFile(data?.originalFileName ?? data?.fileUrl);

  if (!fileUrl) return null;
  if (!isImage) return <PdfThumbnail url={fileUrl} title={title} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={fileUrl}
      alt={title}
      loading="lazy"
      className="absolute inset-0 size-full object-cover"
    />
  );
}

function PdfThumbnail({ url, title }: { url: string; title: string }) {
  const [thumbnail, setThumbnail] = useState<{ url: string; src: string }>();

  useEffect(() => {
    let cancelled = false;
    getPdfThumbnail(url)
      .then((src) => {
        if (!cancelled) setThumbnail({ url, src });
      })
      .catch(() => {
        // 썸네일을 못 그리면 기본 카드(소개 글)를 그대로 보여준다.
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  if (thumbnail?.url !== url) return null;
  return (
    // 문서는 윗부분이 중요하니 위쪽에 맞춰 자른다.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={thumbnail.src}
      alt={title}
      className="absolute inset-0 size-full object-cover object-top bg-white"
    />
  );
}
