import type { PDFPageProxy } from "pdfjs-dist";

/** pdf.js 는 브라우저에서만 돌기 때문에 필요할 때 불러온다. */
async function getPdfjs() {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();
  return pdfjs;
}

/** PDF 를 연다. 다 쓰면 돌려받은 task 의 destroy() 로 정리한다. */
export async function openPdf(url: string) {
  const pdfjs = await getPdfjs();
  return pdfjs.getDocument({ url });
}

/** 페이지의 세로/가로 비율 */
export function pageRatio(page: PDFPageProxy) {
  const viewport = page.getViewport({ scale: 1 });
  return viewport.height / viewport.width;
}

/**
 * 페이지를 width(px) 폭의 JPEG 이미지로 그려 blob 주소를 돌려준다.
 * 캔버스를 그대로 두면 메모리를 많이 써서 이미지로 바꿔 둔다. 다 쓰면 revokeObjectURL 해야 한다.
 */
export async function renderPageToImage(page: PDFPageProxy, width: number) {
  const base = page.getViewport({ scale: 1 });
  const viewport = page.getViewport({ scale: width / base.width });
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(viewport.width);
  canvas.height = Math.round(viewport.height);
  await page.render({ canvas, viewport }).promise;
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.92),
  );
  canvas.width = canvas.height = 0;
  if (!blob) throw new Error("PDF 페이지를 그리지 못했어요.");
  return URL.createObjectURL(blob);
}

// 같은 PDF 의 썸네일은 화면을 오가도 다시 그리지 않도록 기억해 둔다.
const thumbnails = new Map<string, Promise<string>>();

/** PDF 첫 페이지 썸네일(blob 주소). 목록 카드용이라 작게 그린다. */
export function getPdfThumbnail(url: string, width = 640) {
  const key = `${url}|${width}`;
  let thumbnail = thumbnails.get(key);
  if (!thumbnail) {
    thumbnail = (async () => {
      const task = await openPdf(url);
      try {
        const pdf = await task.promise;
        return await renderPageToImage(await pdf.getPage(1), width);
      } finally {
        task.destroy();
      }
    })();
    // 실패하면 다음에 다시 시도할 수 있게 지운다.
    thumbnail.catch(() => thumbnails.delete(key));
    thumbnails.set(key, thumbnail);
  }
  return thumbnail;
}
