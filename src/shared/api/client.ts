import axios, { isAxiosError } from "axios";
import { API_URL } from "@/shared/config/env";

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
    return error.response?.data?.message ?? fallback;
  }
  return fallback;
}

export function isUnauthorized(error: unknown) {
  return isAxiosError(error) && error.response?.status === 401;
}
