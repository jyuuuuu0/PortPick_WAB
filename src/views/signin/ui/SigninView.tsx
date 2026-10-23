import Google from "@/shared/asset/svg/Google";
import AuthBackground from "@/shared/ui/AuthBackground";
import Card from "@/shared/ui/Card";
import Logo from "@/shared/ui/Logo";
import Link from "next/link";

export default function SigninView() {
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
          <button className="flex items-center justify-center gap-[14px] bg-[#F7F7F7] dark:bg-[#2A2A2A] rounded-[10px] border border-gray-200 shadow-md w-full h-[52px] cursor-pointer hover:bg-gray-100 transition-colors">
            <Google />
            <span className="text-base text-black dark:text-white">
              Google 계정으로 로그인
            </span>
          </button>
          <Link
            href="/signup"
            className="text-sm text-gray-600 hover:text-main-300 transition-colors"
          >
            회원가입 하러 가기
          </Link>
        </div>
      </Card>
    </AuthBackground>
  );
}
