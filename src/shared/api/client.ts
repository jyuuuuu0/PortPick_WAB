import axios, { isAxiosError } from "axios";
import { API_URL, MAX_UPLOAD_MB } from "@/shared/config/env";

/**
 * 백엔드 공용 axios 인스턴스.
 * 인증은 HttpOnly 쿠키(PORTPICK_ACCESS_TOKEN)로 하므로 withCredentials 를 켠다.
 */
export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  withCredentials: true,
});

/** 서버가 내려준 에러 메시지를 꺼낸다. 없으면 fallback 을 쓴다. */
export function getErrorMessage(error: unknown, fallback = "요청에 실패했어요.") {
  if (isAxiosError<{ message?: string }>(error)) {
    const message = error.response?.data?.message;
    if (error.response?.status === 413) {
      return `파일이 너무 커요. ${MAX_UPLOAD_MB}MB 이하로 올려주세요.`;
    }
    // 서버가 업로드 용량 초과를 자바 예외 문구 그대로(401 로) 내려주는 경우
    if (message?.includes("SizeLimitExceeded")) {
      // "...maximum permitted size of 1048576 bytes" 에서 실제 서버 제한을 꺼내 보여준다.
      const limit = Number(message.match(/size of (\d+) bytes/)?.[1]);
      const limitText = limit ? `${Math.round((limit / 1024 / 1024) * 10) / 10}MB` : "서버 제한";
      return `파일이 서버 업로드 제한(${limitText})보다 커요. 백엔드 업로드 용량 설정을 확인해주세요.`;
    }
    return message ?? fallback;
  }
  return fallback;
}

export function isUnauthorized(error: unknown) {
  return isAxiosError(error) && error.response?.status === 401;
}
