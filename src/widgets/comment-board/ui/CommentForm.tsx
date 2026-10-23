"use client";

import { useState, type FormEvent } from "react";

interface CommentFormProps {
  placeholder: string;
  submitting: boolean;
  onSubmit: (content: string) => Promise<unknown>;
  onCancel?: () => void;
  autoFocus?: boolean;
  rows?: number;
}

/** 코멘트/답글 입력 폼. 등록에 성공하면 입력값을 비운다. */
export default function CommentForm({
  placeholder,
  submitting,
  onSubmit,
  onCancel,
  autoFocus,
  rows = 3,
}: CommentFormProps) {
  const [content, setContent] = useState("");
  const trimmed = content.trim();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!trimmed || submitting) return;
    try {
      await onSubmit(trimmed);
      setContent("");
    } catch {
      // 에러 토스트는 호출한 쪽에서 띄운다. 입력값은 그대로 둔다.
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        onKeyDown={(event) => {
          // Ctrl/Cmd + Enter 로 바로 등록
          if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) handleSubmit(event);
          if (event.key === "Escape") onCancel?.();
        }}
        placeholder={placeholder}
        rows={rows}
        autoFocus={autoFocus}
        className="w-full resize-none rounded-[8px] border border-gray-200 bg-white dark:bg-[#2A2A2A] px-3 py-2 text-sm placeholder:text-gray-500 focus:border-main-300 focus:outline-none"
      />
      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800 cursor-pointer"
          >
            취소
          </button>
        )}
        <button
          type="submit"
          disabled={!trimmed || submitting}
          className="px-3 py-1.5 rounded-[6px] bg-main-300 text-xs font-medium text-white hover:bg-main-400 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
        >
          등록
        </button>
      </div>
    </form>
  );
}
