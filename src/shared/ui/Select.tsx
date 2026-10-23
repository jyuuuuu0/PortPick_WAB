"use client";

import { useEffect, useRef, useState } from "react";

import ChevronDown from "@/shared/asset/svg/ChevronDown";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  options: SelectOption[];
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * 재사용되는 커스텀 드롭다운.
 * 네이티브 select 대신 직접 만든 메뉴라 스타일을 자유롭게 커스터마이즈할 수 있다.
 */
export default function Select({
  options,
  placeholder,
  value,
  onChange,
  className = "",
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value);

  // 바깥 클릭 / ESC 로 닫기
  useEffect(() => {
    if (!open) return;
    const handlePointer = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full h-[38px] pl-3 pr-8 rounded-[8px] bg-white dark:bg-[#2A2A2A] border border-gray-200 shadow-[0_2px_4px_0_rgba(0,0,0,0.05)] text-sm text-left flex items-center cursor-pointer focus:border-main-200 focus:outline-none transition-colors data-[open=true]:border-main-200"
        data-open={open}
      >
        <span
          className={`truncate ${
            selected ? "text-black dark:text-white" : "text-gray-500"
          }`}
        >
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={`pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-20 left-0 top-[calc(100%+6px)] w-full max-h-56 overflow-auto rounded-[8px] bg-white dark:bg-[#2A2A2A] border border-gray-200 shadow-[0_8px_20px_0_rgba(0,0,0,0.12)] p-1"
        >
          {options.map((option) => {
            const isActive = option.value === value;
            return (
              <li key={option.value} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-[6px] text-sm transition-colors hover:bg-main-100 dark:hover:bg-gray-200 ${
                    isActive
                      ? "bg-main-100/60 dark:bg-gray-200 text-main-400 font-medium"
                      : "text-black dark:text-white"
                  }`}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
