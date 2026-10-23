"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  PortfolioCard,
  useDeletePortfolio,
  useMyPagePortfolios,
  type MyPortfolioTab,
} from "@/entities/portfolio";
import { useMyProfile, useRequireAuth } from "@/entities/user";
import { TrashIcon } from "@/shared/asset/svg/Icons";
import { getErrorMessage } from "@/shared/api/client";
import { toCareerLabel, toLabel } from "@/shared/config/career";
import Avatar from "@/shared/ui/Avatar";
import { Header } from "@/widgets/header";
import { PortfolioGrid } from "@/widgets/portfolio-grid";

const TABS: { value: MyPortfolioTab; label: string; empty: string }[] = [
  { value: "portfolios", label: "내 포트폴리오", empty: "아직 올린 포트폴리오가 없어요." },
  { value: "liked-portfolios", label: "좋아요", empty: "좋아요한 포트폴리오가 없어요." },
  { value: "commented-portfolios", label: "코멘트 남긴", empty: "코멘트를 남긴 포트폴리오가 없어요." },
];

export default function MyPageView() {
  const { ready } = useRequireAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      <Header />
      <main className="max-w-[1260px] mx-auto px-4 sm:px-6 py-10">
        {ready ? <MyPageContent /> : <div className="h-40 rounded-xl bg-gray-100 animate-pulse" />}
      </main>
    </div>
  );
}

function MyPageContent() {
  const [tab, setTab] = useState<MyPortfolioTab>("portfolios");
  const { data: profile } = useMyProfile();
  const list = useMyPagePortfolios(tab);
  const current = TABS.find((item) => item.value === tab)!;

  const organization = profile?.noOrganization ? "" : profile?.organizationName;
  const meta = [organization, toLabel(profile?.jobRole), toCareerLabel(profile?.careerType, profile?.careerRange)]
    .filter(Boolean)
    .join(" | ");

  return (
    <>
      <section className="flex items-center gap-5 rounded-xl border border-gray-100 bg-gradient-to-r from-main-100/60 to-transparent p-6">
        <Avatar src={profile?.profileImageUrl} alt={profile?.name} className="size-16" />
        <div className="min-w-0">
          <p className="text-xl font-semibold truncate">{profile?.name}</p>
          {meta && <p className="mt-0.5 text-sm text-gray-700 truncate">{meta}</p>}
          <p className="mt-0.5 text-xs text-gray-500 truncate">{profile?.email}</p>
        </div>
      </section>

      <div role="tablist" className="mt-8 flex gap-6 border-b border-gray-100">
        {TABS.map((item) => (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={tab === item.value}
            onClick={() => setTab(item.value)}
            className={`-mb-px pb-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              tab === item.value
                ? "border-main-300 text-main-400"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <PortfolioGrid
        className="mt-6"
        portfolios={list.data}
        isPending={list.isPending}
        isError={list.isError}
        onRetry={list.refetch}
        emptyMessage={current.empty}
        renderCard={(portfolio) => (
          <PortfolioCard
            key={portfolio.id}
            portfolio={portfolio}
            action={tab === "portfolios" ? <DeleteButton id={portfolio.id} /> : undefined}
          />
        )}
      />
    </>
  );
}

/** 실수로 지우지 않도록 두 번 눌러야 삭제된다. */
function DeleteButton({ id }: { id: number }) {
  const [confirming, setConfirming] = useState(false);
  const deletePortfolio = useDeletePortfolio();

  const handleClick = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    deletePortfolio.mutate(id, {
      onSuccess: () => toast.success("포트폴리오를 삭제했어요."),
      onError: (error) => {
        setConfirming(false);
        toast.error(getErrorMessage(error, "삭제하지 못했어요."));
      },
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onBlur={() => setConfirming(false)}
      disabled={deletePortfolio.isPending}
      aria-label="포트폴리오 삭제"
      className={`flex items-center gap-1 h-8 px-2 rounded-[8px] text-xs shadow-sm transition-colors cursor-pointer ${
        confirming
          ? "bg-red-500 text-white"
          : "bg-white/90 text-gray-600 hover:text-red-500"
      }`}
    >
      <TrashIcon size={14} />
      {confirming && "삭제하기"}
    </button>
  );
}
