import type { ReactNode } from "react";

interface CardProps {
  className?: string;
  children: ReactNode;
}

/**
 * 인증 화면 등에서 공통으로 쓰는 흰색 카드 패널.
 */
export default function Card({ className = "", children }: CardProps) {
  return (
    <div
      className={`bg-white dark:bg-[#1E1E1E] rounded-[12px] border border-gray-200 shadow-[8px_8px_5px_0px_rgba(0,0,0,0.1)] ${className}`}
    >
      {children}
    </div>
  );
}
