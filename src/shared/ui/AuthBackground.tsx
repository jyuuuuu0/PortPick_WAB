import type { ReactNode } from "react";

/**
 * 로그인/회원가입 등 인증 화면에서 공통으로 쓰는 배경.
 * 그린 계열 그라데이션 위에 콘텐츠를 중앙 정렬한다.
 */
export default function AuthBackground({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-hidden bg-[#F8F8F8] dark:bg-[#121212] text-black dark:text-white flex items-center justify-center w-full min-h-screen p-4 sm:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-80 dark:opacity-40"
      >
        <div
          className="absolute -left-[15%] top-[6%] w-[55%] h-[43%] rounded-full"
          style={{
            background: "linear-gradient(260deg, #C1D95C 33%, #FFFFFF 102%)",
            filter: "blur(140px)",
          }}
        />
        <div
          className="absolute left-[8%] top-[9%] w-[50%] h-[48%] rounded-full"
          style={{
            background: "linear-gradient(5deg, #D6E95D 28%, rgba(255,255,255,0) 98%)",
            filter: "blur(140px)",
          }}
        />
        <div
          className="absolute -left-[10%] top-0 w-[45%] h-[45%] rounded-full"
          style={{
            background: "linear-gradient(196deg, #D4FFA0 23%, #FFFFFF 56%)",
            filter: "blur(140px)",
          }}
        />
      </div>
      {children}
    </div>
  );
}
