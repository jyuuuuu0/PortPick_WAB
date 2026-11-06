/** 백엔드 API 서버 주소. 배포 환경에 따라 .env 의 NEXT_PUBLIC_API_URL 로 바꿀 수 있다. */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://portpick-api.https.gsmsv.site";

/**
 * 포트폴리오 파일(PDF 등) 최대 용량(MB). 백엔드 업로드 제한(20MB)과 맞춘다.
 * 서버에 보내기 전에 너무 큰 파일을 미리 거르는 용도다.
 */
export const MAX_UPLOAD_MB = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB) || 20;

/** 구글 로그인 시작 주소. 브라우저를 이 주소로 직접 이동시켜야 한다. */
export const GOOGLE_LOGIN_URL = `${API_URL}/oauth2/authorization/google`;
