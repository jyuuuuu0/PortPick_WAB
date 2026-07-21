import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

/**
 * 회원가입 등에서 재사용되는 박스형 텍스트 입력 필드.
 * 흰색 배경 + 라운드 + 옅은 테두리/그림자 (Figma 시안 기준).
 */
export default function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`w-full h-[38px] px-3 rounded-[8px] bg-white dark:bg-[#2A2A2A] border border-gray-200 shadow-[0_2px_4px_0_rgba(0,0,0,0.05)] text-sm text-black dark:text-white placeholder:text-gray-500 focus:border-main-200 focus:outline-none transition-colors ${className}`}
      {...props}
    />
  );
}
