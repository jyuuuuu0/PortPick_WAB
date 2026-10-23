import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStatus } from "../api/queries";

/**
 * 로그인이 필요한 페이지에서 쓴다.
 * 비로그인이면 /signin, 가입을 마치지 않았으면 /signup 으로 보낸다.
 */
export function useRequireAuth() {
  const router = useRouter();
  const { data, isPending } = useAuthStatus();

  useEffect(() => {
    if (!data) return;
    if (!data.authenticated) router.replace("/signin");
    else if (!data.signupCompleted) router.replace("/signup");
  }, [data, router]);

  const ready = !isPending && !!data?.authenticated && !!data.signupCompleted;
  return { auth: data, ready };
}
