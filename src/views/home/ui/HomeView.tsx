"use client";

import Link from "next/link";
import { useState } from "react";

import { PortfolioCard, usePortfolios, type PortfolioFilter } from "@/entities/portfolio";
import { useAuthStatus } from "@/entities/user";
import Upload from "@/shared/asset/svg/Upload";
import { FilterIcon } from "@/shared/asset/svg/Icons";
import { CAREER_RANGE_OPTIONS, JOB_OPTIONS } from "@/shared/config/career";
import Select, { type SelectOption } from "@/shared/ui/Select";
import { Header } from "@/widgets/header";
import { PortfolioGrid } from "@/widgets/portfolio-grid";

const JOB_FILTER_OPTIONS: SelectOption[] = [{ label: "전체 직군", value: "" }, ...JOB_OPTIONS];

// 신입/경력 + 년차를 한 드롭다운에서 고르게 합친다.
const CAREER_FILTER_OPTIONS: SelectOption[] = [
  { label: "전체 경력", value: "" },
  { label: "신입", value: "NEWCOMER" },
  ...CAREER_RANGE_OPTIONS.map((option) => ({ label: `경력 ${option.label}`, value: option.value })),
];

function toCareerFilter(value: string): Pick<PortfolioFilter, "careerType" | "careerRange"> {
  if (!value) return {};
  if (value === "NEWCOMER") return { careerType: "NEWCOMER" };
  return { careerType: "EXPERIENCED", careerRange: value };
}

export default function HomeView() {
  const [jobRole, setJobRole] = useState("");
  const [career, setCareer] = useState("");
  const { data: auth } = useAuthStatus();
  const { data, isPending, isError, refetch } = usePortfolios({
    jobRole: jobRole || undefined,
    ...toCareerFilter(career),
  });

  const uploadHref = auth?.authenticated ? "/upload" : "/signin";

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      <Header />
      <main className="max-w-[1260px] mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-medium">Portfolio</h1>
          <Link
            href={uploadHref}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-[8px] bg-main-100 text-sm font-medium text-main-500 shadow-[0_2px_4px_0_rgba(0,0,0,0.1)] hover:brightness-95 transition"
          >
            <Upload className="w-[13px] h-[13px]" />
            업로드
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-6">
          <span className="flex items-center gap-1.5 text-sm text-gray-600">
            <FilterIcon size={15} />
            필터
          </span>
          <div className="w-44">
            <Select
              options={JOB_FILTER_OPTIONS}
              placeholder="전체 직군"
              value={jobRole}
              onChange={setJobRole}
            />
          </div>
          <div className="w-44">
            <Select
              options={CAREER_FILTER_OPTIONS}
              placeholder="전체 경력"
              value={career}
              onChange={setCareer}
            />
          </div>
        </div>

        <PortfolioGrid
          className="mt-6"
          portfolios={data}
          isPending={isPending}
          isError={isError}
          onRetry={refetch}
          emptyMessage="아직 등록된 포트폴리오가 없어요. 첫 포트폴리오를 올려보세요!"
          renderCard={(portfolio) => <PortfolioCard key={portfolio.id} portfolio={portfolio} />}
        />
      </main>
    </div>
  );
}
