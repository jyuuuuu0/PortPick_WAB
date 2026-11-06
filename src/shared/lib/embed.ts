/** 피그마 링크인지. 피그마는 화면이 고정되므로 비율이 같은 박스에 보여준다. */
export function isFigmaLink(link?: string | null) {
  if (!link) return false;
  try {
    return new URL(link).hostname.replace(/^www\./, "") === "figma.com";
  } catch {
    return false;
  }
}

/**
 * 피그마를 어떻게 보여줄지. 올리는 사람이 정하고, 모두에게 같은 화면이 보이도록(코멘트 위치 고정)
 * 링크에 함께 저장한다.
 * - ratio: 박스 세로/가로 비율 (세로로 긴 포트폴리오는 크게)
 * - zoom: 박스 대비 피그마 화면 배율
 * - x, y: 확대했을 때 보여줄 위치 (피그마 화면 기준 0~1, 왼쪽 위 모서리)
 */
export interface FigmaView {
  ratio: number;
  zoom: number;
  x: number;
  y: number;
}

/** 피그마를 1600px 폭으로 그리므로 세로는 10배(16000px)까지만 그린다. */
export const MAX_FIGMA_RATIO = 10;

export const DEFAULT_FIGMA_VIEW: FigmaView = { ratio: 0.625, zoom: 1, x: 0, y: 0 };

const FIGMA_VIEW_PARAMS = {
  ratio: "portpick-ratio",
  zoom: "portpick-zoom",
  x: "portpick-x",
  y: "portpick-y",
} as const;
const OWN_PARAMS: string[] = Object.values(FIGMA_VIEW_PARAMS);

/** 확대 배율에 맞게 위치가 화면 밖으로 나가지 않도록 맞춘다. */
export function clampFigmaView(view: FigmaView): FigmaView {
  const max = Math.max(0, 1 - 1 / view.zoom);
  const clamp = (value: number) => Math.min(max, Math.max(0, value));
  return { ...view, x: clamp(view.x), y: clamp(view.y) };
}

export function getFigmaView(link?: string | null): FigmaView {
  const view = { ...DEFAULT_FIGMA_VIEW };
  if (!link) return view;
  try {
    const params = new URL(link).searchParams;
    for (const key of Object.keys(FIGMA_VIEW_PARAMS) as (keyof FigmaView)[]) {
      const value = Number(params.get(FIGMA_VIEW_PARAMS[key]));
      if (params.has(FIGMA_VIEW_PARAMS[key]) && Number.isFinite(value)) view[key] = value;
    }
    if (view.ratio <= 0) view.ratio = DEFAULT_FIGMA_VIEW.ratio;
    view.ratio = Math.min(view.ratio, MAX_FIGMA_RATIO);
    if (view.zoom < 1) view.zoom = 1;
    return clampFigmaView(view);
  } catch {
    return view;
  }
}

export function withFigmaView(link: string, view: FigmaView) {
  try {
    const url = new URL(link);
    for (const key of Object.keys(FIGMA_VIEW_PARAMS) as (keyof FigmaView)[]) {
      const value = Math.round(view[key] * 1000) / 1000;
      if (value === DEFAULT_FIGMA_VIEW[key]) url.searchParams.delete(FIGMA_VIEW_PARAMS[key]);
      else url.searchParams.set(FIGMA_VIEW_PARAMS[key], String(value));
    }
    return url.toString();
  } catch {
    return link;
  }
}

/**
 * 사용자가 넣은 링크를 iframe 에 넣을 수 있는 주소로 바꾼다.
 * 피그마/유튜브는 공식 embed 주소로, 그 외는 그대로 쓴다.
 */
export function toEmbedUrl(link: string) {
  try {
    const url = new URL(link);
    const host = url.hostname.replace(/^www\./, "");

    // 피그마는 embed.figma.com 에 같은 경로를 붙이고 embed-host 를 달면 바로 띄울 수 있다.
    // 코멘트 핀이 항상 같은 곳을 가리키도록 화면 이동·확대를 막고, 화면에 맞춰 보여준다.
    if (host === "figma.com" && /^\/(design|file|proto|board|slides|deck)\//.test(url.pathname)) {
      const embed = new URL(`https://embed.figma.com${url.pathname.replace(/^\/file\//, "/design/")}`);
      url.searchParams.forEach((value, key) => {
        if (!OWN_PARAMS.includes(key)) embed.searchParams.set(key, value);
      });
      embed.searchParams.set("embed-host", "portpick");
      embed.searchParams.set("viewport-controls", "false");
      embed.searchParams.set("scaling", "contain");
      // 아래 정보 막대가 박스 크기와 상관없이 같은 높이라, 확대하면 핀 위치가 어긋나지 않게 숨긴다.
      embed.searchParams.set("footer", "false");
      return embed.toString();
    }
    if (host === "youtube.com" && url.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${url.searchParams.get("v")}`;
    }
    if (host === "youtu.be") {
      return `https://www.youtube.com/embed${url.pathname}`;
    }
    return link;
  } catch {
    return link;
  }
}

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|avif|svg)$/i;

export function isImageFile(name?: string) {
  return !!name && IMAGE_EXT.test(name.split("?")[0]);
}
