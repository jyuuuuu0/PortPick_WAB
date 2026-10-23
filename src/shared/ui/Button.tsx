import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "soft" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const VARIANT_CLASS: Record<Variant, string> = {
  primary: "bg-main-300 text-white hover:bg-main-400",
  soft: "bg-main-100 text-main-500 shadow-[0_2px_4px_0_rgba(0,0,0,0.1)] hover:brightness-95",
  ghost: "bg-gray-100 text-gray-700 hover:bg-gray-200",
};

/** 공용 버튼. primary(진한 그린) / soft(연한 그린, 피그마 업로드 버튼) / ghost(회색) */
export default function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-[8px] text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${VARIANT_CLASS[variant]} ${className}`}
      {...props}
    />
  );
}
