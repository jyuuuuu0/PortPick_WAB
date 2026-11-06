"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";

import { clampFigmaView, type FigmaView } from "@/shared/lib/embed";
import FigmaEmbed from "@/shared/ui/FigmaEmbed";

// 박스 세로 길이 단계 (가로 대비 배수). 0.625 = 16:10
// 피그마를 1600px 폭으로 그리므로 10배(16000px)가 브라우저가 그릴 수 있는 한계에 가깝다.
const RATIOS = [0.625, 1, 1.5, 2, 3, 4, 5, 6, 8, 10];
const ZOOMS = [1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6];

interface FigmaPreviewProps {
  link: string;
  hasFrame: boolean;
  view: FigmaView;
  onViewChange: (view: FigmaView) => void;
}

/**
 * 피그마를 상세 페이지에서 어떻게 보여줄지 정하는 미리보기.
 * 세로 길이·확대를 고르고 드래그로 위치를 잡으면, 상세 페이지에서 이 화면 그대로 고정된다.
 */
export default function FigmaPreview({ link, hasFrame, view, onViewChange }: FigmaPreviewProps) {
  // 입력하는 도중마다 피그마를 새로 불러오지 않도록, 입력이 멈춘 뒤에 미리보기를 바꾼다.
  const [previewLink, setPreviewLink] = useState(link);
  useEffect(() => {
    const timer = setTimeout(() => setPreviewLink(link), 600);
    return () => clearTimeout(timer);
  }, [link]);

  // 세로 길이가 바뀌면 피그마를 새로 불러와야 해서, 슬라이더를 멈춘 뒤에 반영한다.
  const [previewRatio, setPreviewRatio] = useState(view.ratio);
  useEffect(() => {
    const timer = setTimeout(() => setPreviewRatio(view.ratio), 600);
    return () => clearTimeout(timer);
  }, [view.ratio]);
  const previewView = { ...view, ratio: previewRatio };

  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(null);

  // 확대해도 보고 있던 가운데가 그대로 유지되도록 위치를 맞춘다.
  const changeZoom = (zoom: number) => {
    const centerX = view.x + 0.5 / view.zoom;
    const centerY = view.y + 0.5 / view.zoom;
    onViewChange(clampFigmaView({ ...view, zoom, x: centerX - 0.5 / zoom, y: centerY - 0.5 / zoom }));
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { px: event.clientX, py: event.clientY, x: view.x, y: view.y };
  };
  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const start = drag.current;
    onViewChange(
      clampFigmaView({
        ...view,
        x: start.x - (event.clientX - start.px) / (rect.width * view.zoom),
        y: start.y - (event.clientY - start.py) / (rect.height * view.zoom),
      }),
    );
  };
  const stopDrag = () => {
    drag.current = null;
  };

  return (
    <div className="mt-3 flex flex-col gap-4">
      <div
        className={`rounded-[8px] px-3 py-2.5 text-xs leading-relaxed ${
          hasFrame ? "bg-main-100/60 text-main-500" : "bg-gray-100 text-gray-700"
        }`}
      >
        <p className="font-medium">
          {hasFrame
            ? "선택한 프레임이 처음 화면으로 보여요."
            : "피그마 파일 전체가 작게 보여요. 보여줄 프레임을 정해주세요."}
        </p>
        <p className="mt-1">
          코멘트 위치가 어긋나지 않도록 상세 페이지에서는 아래 미리보기 화면이 그대로 고정돼요.
          피그마에서 보여줄 프레임을 선택하고 <b>우클릭 → 선택 항목 링크 복사</b>(Copy link to
          selection)한 링크를 넣으면 그 프레임이 처음 화면이 돼요.
        </p>
        <p className="mt-1">파일은 &lsquo;링크가 있는 모든 사용자&rsquo;가 볼 수 있게 공유해주세요.</p>
      </div>

      <StepSlider
        label="세로 길이"
        valueText={view.ratio === RATIOS[0] ? "가로형 (기본)" : `가로의 ${view.ratio}배`}
        steps={RATIOS}
        value={view.ratio}
        onChange={(ratio) => onViewChange({ ...view, ratio })}
        hint="세로로 긴 포트폴리오라면 박스를 길게 늘려주세요."
      />
      <StepSlider
        label="확대"
        valueText={`${Math.round(view.zoom * 100)}%`}
        steps={ZOOMS}
        value={view.zoom}
        onChange={changeZoom}
        hint="확대한 뒤 미리보기를 드래그해서 보여줄 위치를 잡아주세요."
      />

      <div
        style={{ aspectRatio: `1 / ${previewRatio}` }}
        className="relative overflow-hidden rounded-[8px] border border-gray-200 bg-gray-100"
      >
        <FigmaEmbed link={previewLink} view={previewView} title="피그마 미리보기" />
        {/* 피그마 위에 얹어 드래그를 받는다. 확대하지 않았으면 옮길 곳이 없다. */}
        {view.zoom > 1 && (
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDrag}
            onPointerCancel={stopDrag}
            className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
            aria-label="드래그해서 보여줄 위치 잡기"
          />
        )}
      </div>
    </div>
  );
}

function StepSlider({
  label,
  valueText,
  steps,
  value,
  onChange,
  hint,
}: {
  label: string;
  valueText: string;
  steps: number[];
  value: number;
  onChange: (value: number) => void;
  hint: string;
}) {
  // 저장된 값이 단계 사이에 있어도 가장 가까운 단계를 가리킨다.
  const index = steps.reduce(
    (best, step, i) => (Math.abs(step - value) < Math.abs(steps[best] - value) ? i : best),
    0,
  );
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-xs text-gray-500">{valueText}</span>
      </div>
      <input
        type="range"
        min={0}
        max={steps.length - 1}
        step={1}
        value={index}
        onChange={(event) => onChange(steps[Number(event.target.value)])}
        className="w-full accent-main-300 cursor-pointer"
        aria-label={label}
      />
      <p className="text-xs text-gray-500">{hint}</p>
    </div>
  );
}
