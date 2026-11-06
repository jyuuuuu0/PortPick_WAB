"use client";

import { useEffect, useState } from "react";

import { openPdf, pageRatio, renderPageToImage } from "@/shared/lib/pdf";

/** 페이지를 그리는 폭(px). 화면 폭과 상관없이 같은 크기로 그려 어디서 봐도 같은 모양이 되게 한다. */
const RENDER_WIDTH = 1400;

interface Page {
  /** 세로/가로 비율. 그리기 전에도 자리를 잡아둬서 코멘트 핀 위치가 흔들리지 않게 한다. */
  ratio: number;
  src?: string;
}

/**
 * PDF 를 페이지마다 이미지로 그려 위에서 아래로 쭉 펼쳐 보여준다.
 * 브라우저 PDF 뷰어(목록·도구 막대·안쪽 스크롤) 없이 박스 자체가 길어진다.
 */
export default function PdfViewer({ url, title }: { url: string; title: string }) {
  const [state, setState] = useState<{ url: string; pages?: Page[]; failed?: boolean }>();

  useEffect(() => {
    let cancelled = false;
    const created: string[] = [];
    const tasks: { destroy: () => Promise<void> }[] = [];

    (async () => {
      const task = await openPdf(url);
      if (cancelled) return void task.destroy();
      tasks.push(task);
      const pdf = await task.promise;
      const pages = await Promise.all(
        Array.from({ length: pdf.numPages }, (_, i) => pdf.getPage(i + 1)),
      );
      if (cancelled) return;

      // 먼저 페이지 자리(비율)만 잡고, 앞 페이지부터 차례로 그려 넣는다.
      setState({ url, pages: pages.map((page) => ({ ratio: pageRatio(page) })) });

      for (const [index, page] of pages.entries()) {
        if (cancelled) return;
        const src = await renderPageToImage(page, RENDER_WIDTH);
        // 그리는 사이 화면을 떠났으면 바로 정리한다.
        if (cancelled) return URL.revokeObjectURL(src);
        created.push(src);
        setState((prev) => {
          if (!prev?.pages || prev.url !== url) return prev;
          const next = [...prev.pages];
          next[index] = { ...next[index], src };
          return { ...prev, pages: next };
        });
      }
    })().catch(() => {
      if (!cancelled) setState({ url, failed: true });
    });

    return () => {
      cancelled = true;
      created.forEach((src) => URL.revokeObjectURL(src));
      tasks.forEach((task) => task.destroy());
    };
  }, [url]);

  const current = state?.url === url ? state : undefined;

  if (current?.pages) {
    return (
      <div className="flex flex-col gap-2 bg-gray-100">
        {current.pages.map((page, index) =>
          page.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={index}
              src={page.src}
              alt={`${title} ${index + 1}쪽`}
              className="block w-full h-auto bg-white"
              style={{ aspectRatio: `1 / ${page.ratio}` }}
            />
          ) : (
            <div
              key={index}
              className="w-full bg-white animate-pulse"
              style={{ aspectRatio: `1 / ${page.ratio}` }}
            />
          ),
        )}
      </div>
    );
  }

  return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-2 text-sm text-gray-500 bg-main-100/40">
      {current?.failed ? (
        <>
          <p>파일을 불러오지 못했어요.</p>
          <a href={url} target="_blank" rel="noreferrer" className="text-main-500 underline">
            새 탭에서 열기
          </a>
        </>
      ) : (
        <p>파일을 불러오는 중...</p>
      )}
    </div>
  );
}
