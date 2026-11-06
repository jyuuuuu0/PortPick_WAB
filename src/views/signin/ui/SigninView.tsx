"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { useAuthStatus, useLogout } from "@/entities/user";
import Google from "@/shared/asset/svg/Google";
import { GOOGLE_LOGIN_URL } from "@/shared/config/env";
import AuthBackground from "@/shared/ui/AuthBackground";
import Card from "@/shared/ui/Card";
import Logo from "@/shared/ui/Logo";

export default function SigninView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: auth } = useAuthStatus();
  const logout = useLogout();
  // 구글 로그인은 했지만 회원가입을 마치지 않은 상태
  const signupPending = !!auth?.authenticated && !auth.signupCompleted;

  // 가입까지 마친 회원만 홈으로 보낸다. 가입 미완료 사용자는 이 화면에서 직접 고르게 한다.
  useEffect(() => {
    if (auth?.authenticated && auth.signupCompleted) router.replace("/");
  }, [auth, router]);

  // 구글 로그인 실패 시 서버가 ?error=... 를 붙여 돌려보낸다.
  useEffect(() => {
    if (searchParams.get("error")) toast.error("구글 로그인에 실패했어요. 다시 시도해주세요.");
  }, [searchParams]);

  return (
    <AuthBackground>
      <Card className="relative z-10 w-[86vw] max-w-[560px] flex flex-col items-center gap-8 p-8 sm:p-12">
        <Logo />
        <div className="flex flex-col gap-1 text-center text-base">
          <p>반가워요! 🤗</p>
          <p>
            <span className="font-asimovian text-main-200">PortPick</span>을 통해
            포트폴리오를
            공유하고 피드백 받아봐요!
          </p>
        </div>
        {signupPending ? (
          <div className="flex flex-col items-center gap-4 w-full">
            <p className="text-sm text-gray-700 text-center">
              <span className="text-main-300">{auth?.name || auth?.email}</span>
              님은 아직 회원가입을 마치지 않았어요.
            </p>
            <Link
              href="/signup"
              className="flex items-center justify-center w-full h-[52px] rounded-[10px] bg-main-200 text-base font-medium text-black hover:bg-main-300 transition-colors"
            >
              회원가입 이어하기
            </Link>
            <button
              type="button"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
              className="text-sm text-gray-600 hover:text-main-300 transition-colors cursor-pointer disabled:opacity-50"
            >
              다른 계정으로 로그인
            </button>
          </div>
        ) : (
        <div className="flex flex-col items-center gap-4 w-full">
          {/* OAuth 는 서버가 구글로 리다이렉트하므로 fetch 가 아닌 페이지 이동으로 시작한다 */}
          <a
            href={GOOGLE_LOGIN_URL}
            className="flex items-center justify-center gap-[14px] bg-[#F7F7F7] dark:bg-[#2A2A2A] rounded-[10px] border border-gray-200 shadow-md w-full h-[52px] cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <Google />
            <span className="text-base text-black dark:text-white">
              Google 계정으로 로그인
            </span>
          </a>
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-main-300 transition-colors"
          >
            둘러보기
          </Link>
        </div>
        )}
      </Card>
    </AuthBackground>
  );
}
