"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { useCreatePortfolio } from "@/entities/portfolio";
import { useRequireAuth } from "@/entities/user";
import Upload from "@/shared/asset/svg/Upload";
import { CloseIcon, FileIcon, LinkIcon } from "@/shared/asset/svg/Icons";
import { getErrorMessage } from "@/shared/api/client";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import { Header } from "@/widgets/header";

type Source = "link" | "file";

const MAX_FILE_MB = 20;

export default function UploadView() {
  const router = useRouter();
  const { ready } = useRequireAuth();
  const createPortfolio = useCreatePortfolio();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [source, setSource] = useState<Source>("link");
  const [embedLink, setEmbedLink] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const linkValid = /^https?:\/\/\S+$/.test(embedLink.trim());
  const canSubmit =
    title.trim() !== "" &&
    (source === "link" ? linkValid : !!file) &&
    !createPortfolio.isPending;

  const handleFile = (next?: File) => {
    if (!next) return;
    if (next.size > MAX_FILE_MB * 1024 * 1024) {
      toast.error(`파일은 ${MAX_FILE_MB}MB 이하만 올릴 수 있어요.`);
      return;
    }
    setFile(next);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    createPortfolio.mutate(
      {
        title: title.trim(),
        description: description.trim(),
        embedLink: source === "link" ? embedLink.trim() : undefined,
        file: source === "file" ? file : null,
      },
      {
        onSuccess: (created) => {
          toast.success("포트폴리오를 올렸어요!");
          router.replace(created?.id ? `/portfolio/${created.id}` : "/");
        },
        onError: (error) => toast.error(getErrorMessage(error, "업로드에 실패했어요.")),
      },
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      <Header />
      <main className="max-w-[720px] mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-medium">포트폴리오 업로드</h1>
        <p className="mt-1 text-sm text-gray-600">
          포트폴리오를 공유하고 원하는 위치에 피드백을 받아보세요.
        </p>

        {!ready ? (
          <div className="mt-8 h-80 rounded-xl bg-gray-100 animate-pulse" />
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
            <Field label="제목" required>
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="포트폴리오 제목을 입력해주세요"
                maxLength={100}
              />
            </Field>

            <Field label="소개">
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="어떤 작업인지, 어떤 피드백을 받고 싶은지 적어주세요"
                rows={5}
                maxLength={1000}
                className="w-full resize-none px-3 py-2 rounded-[8px] bg-white dark:bg-[#2A2A2A] border border-gray-200 shadow-[0_2px_4px_0_rgba(0,0,0,0.05)] text-sm placeholder:text-gray-500 focus:border-main-200 focus:outline-none transition-colors"
              />
            </Field>

            <Field label="포트폴리오" required>
              <div role="tablist" className="flex gap-2 mb-3">
                <SourceTab active={source === "link"} onClick={() => setSource("link")}>
                  <LinkIcon size={14} />
                  링크로 올리기
                </SourceTab>
                <SourceTab active={source === "file"} onClick={() => setSource("file")}>
                  <FileIcon size={14} />
                  파일로 올리기
                </SourceTab>
              </div>

              {source === "link" ? (
                <>
                  <Input
                    value={embedLink}
                    onChange={(event) => setEmbedLink(event.target.value)}
                    placeholder="Figma, Notion, 개인 사이트 등의 공개 링크"
                    inputMode="url"
                  />
                  {embedLink && !linkValid && (
                    <p className="mt-1.5 text-xs text-red-500">http(s):// 로 시작하는 링크를 입력해주세요.</p>
                  )}
                </>
              ) : file ? (
                <div className="flex items-center justify-between gap-3 h-[52px] px-4 rounded-[8px] border border-main-200 bg-main-100/40">
                  <span className="flex items-center gap-2 min-w-0 text-sm">
                    <FileIcon size={16} className="shrink-0 text-main-500" />
                    <span className="truncate">{file.name}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    aria-label="파일 제거"
                    className="p-1 text-gray-500 hover:text-gray-800 cursor-pointer"
                  >
                    <CloseIcon size={15} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    handleFile(event.dataTransfer.files?.[0]);
                  }}
                  className="w-full flex flex-col items-center justify-center gap-2 h-40 rounded-[8px] border-2 border-dashed border-gray-200 text-sm text-gray-600 hover:border-main-200 hover:bg-main-100/30 transition-colors cursor-pointer"
                >
                  <Upload className="w-5 h-5" />
                  클릭하거나 파일을 끌어다 놓으세요
                  <span className="text-xs text-gray-500">PDF, 이미지 · 최대 {MAX_FILE_MB}MB</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,image/*"
                className="hidden"
                onChange={(event) => {
                  handleFile(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
            </Field>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => router.back()}>
                취소
              </Button>
              <Button type="submit" disabled={!canSubmit}>
                {createPortfolio.isPending ? "올리는 중..." : "업로드"}
              </Button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">
        {label}
        {required && <span className="ml-0.5 text-main-300">*</span>}
      </span>
      {children}
    </div>
  );
}

function SourceTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-medium transition-colors cursor-pointer ${
        active ? "bg-main-100 text-main-500" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {children}
    </button>
  );
}
