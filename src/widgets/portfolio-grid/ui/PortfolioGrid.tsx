import type { ReactNode } from "react";
import type { PortfolioSummary } from "@/entities/portfolio";

interface PortfolioGridProps {
  portfolios?: PortfolioSummary[];
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
  emptyMessage: string;
  renderCard: (portfolio: PortfolioSummary) => ReactNode;
  className?: string;
}

const GRID_CLASS = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6";

/** 포트폴리오 카드 그리드. 로딩/에러/빈 상태를 함께 처리한다. */
export default function PortfolioGrid({
  portfolios,
  isPending,
  isError,
  onRetry,
  emptyMessage,
  renderCard,
  className = "",
}: PortfolioGridProps) {
  if (isPending) {
    return (
      <div className={`${GRID_CLASS} ${className}`}>
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="rounded-xl border border-gray-100 overflow-hidden animate-pulse">
            <div className="aspect-[16/10] bg-gray-100" />
            <div className="p-4 flex flex-col gap-2">
              <div className="h-4 w-2/3 rounded bg-gray-100" />
              <div className="h-3 w-1/3 rounded bg-gray-100" />
              <div className="h-3 w-1/2 rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`flex flex-col items-center gap-3 py-24 text-sm text-gray-600 ${className}`}>
        포트폴리오를 불러오지 못했어요.
        <button
          type="button"
          onClick={onRetry}
          className="px-4 py-2 rounded-[8px] bg-gray-100 hover:bg-gray-200 cursor-pointer"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!portfolios?.length) {
    return <p className={`py-24 text-center text-sm text-gray-500 ${className}`}>{emptyMessage}</p>;
  }

  return <div className={`${GRID_CLASS} ${className}`}>{portfolios.map(renderCard)}</div>;
}
