/**
 * 사용자가 넣은 링크를 iframe 에 넣을 수 있는 주소로 바꾼다.
 * 피그마/유튜브는 공식 embed 주소로, 그 외는 그대로 쓴다.
 */
export function toEmbedUrl(link: string) {
  try {
    const url = new URL(link);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "figma.com" && !url.pathname.startsWith("/embed")) {
      return `https://www.figma.com/embed?embed_host=portpick&url=${encodeURIComponent(link)}`;
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
