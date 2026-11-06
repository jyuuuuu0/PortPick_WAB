"use client";

import { useEffect, useRef, useState } from "react";

import { getFigmaView, toEmbedUrl, type FigmaView } from "@/shared/lib/embed";

/**
 * 피그마를 그리는 고정 폭(px). 피그마는 iframe 픽셀 크기에 맞춰 그리기 때문에,
 * 어디서 보든 같은 크기로 그린 뒤 박스에 맞게 줄이고 키워야 화면(과 코멘트 위치)이 똑같다.
 */
export const FIGMA_RENDER_WIDTH = 1600;

/**
 * 저장된 배율·위치대로 피그마를 보여준다. 부모는 position 이 있고 overflow-hidden 인 박스여야 한다.
 * 확대·위치는 CSS 로만 바꿔서 피그마를 다시 불러오지 않는다. (세로 길이가 바뀔 때만 다시 불러온다)
 */
export default function FigmaEmbed({
  link,
  view = getFigmaView(link),
  title = "피그마",
}: {
  link: string;
  view?: FigmaView;
  title?: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [boxWidth, setBoxWidth] = useState(0);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const observer = new ResizeObserver(([entry]) => setBoxWidth(entry.contentRect.width));
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  const renderHeight = Math.round(FIGMA_RENDER_WIDTH * view.ratio);
  const scale = (boxWidth / FIGMA_RENDER_WIDTH) * view.zoom;
  const offsetX = -view.x * FIGMA_RENDER_WIDTH * scale;
  const offsetY = -view.y * renderHeight * scale;

  return (
    <div ref={boxRef} className="absolute inset-0">
      <iframe
        // 피그마는 처음 열릴 때 크기에만 맞추므로, 세로 길이가 바뀌면 새로 불러온다.
        key={`${link}|${view.ratio}`}
        src={toEmbedUrl(link)}
        title={title}
        className="absolute left-0 top-0 border-0 max-w-none origin-top-left"
        style={{
          width: FIGMA_RENDER_WIDTH,
          height: renderHeight,
          transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
          visibility: boxWidth ? "visible" : "hidden",
        }}
      />
    </div>
  );
}
