"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { useAuthStatus } from "@/entities/user";
import Google from "@/shared/asset/svg/Google";
import { GOOGLE_LOGIN_URL } from "@/shared/config/env";
import AuthBackground from "@/shared/ui/AuthBackground";
import Card from "@/shared/ui/Card";
import Logo from "@/shared/ui/Logo";

export default function SigninView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: auth } = useAuthStatus();

  // 이미 로그인한 상태면 가입 여부에 따라 홈/회원가입으로 보낸다.
  useEffect(() => {
    if (!auth?.authenticated) return;
    router.replace(auth.signupCompleted ? "/" : "/signup");
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
      </Card>
    </AuthBackground>
  );
}
