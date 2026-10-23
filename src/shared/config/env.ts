/** 백엔드 API 서버 주소. 배포 환경에 따라 .env 의 NEXT_PUBLIC_API_URL 로 바꿀 수 있다. */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://portpick-api.https.gsmsv.site";

/** 구글 로그인 시작 주소. 브라우저를 이 주소로 직접 이동시켜야 한다. */
export const GOOGLE_LOGIN_URL = `${API_URL}/oauth2/authorization/google`;
