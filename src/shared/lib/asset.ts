import { API_URL } from "@/shared/config/env";

/**
 * 서버가 내려준 파일 주소를 브라우저에서 열 수 있는 주소로 바꾼다.
 * "/uploads/..." 같은 상대 경로는 백엔드 주소를 앞에 붙인다.
 */
export function toAssetUrl(url?: string | null) {
  if (!url) return undefined;
  if (/^(https?:|blob:|data:)/.test(url)) return url;
  return `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}
