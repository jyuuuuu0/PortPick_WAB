import Google from "@/shared/asset/svg/Google";
import Link from "next/link";

export default function SigninView() {
  return (
    <div className="bg-[#F8F8F8] dark:bg-[#121212] text-black dark:text-white flex justify-center lg:justify-end w-full min-h-screen p-4 sm:p-8 lg:p-[110px]">
      <div className="bg-white dark:bg-[#1E1E1E] max-w-[806px] w-full max-h-[863px] flex flex-col items-center justify-center gap-8 sm:gap-[60px] rounded-[20px] shadow-2xl p-6 sm:p-10 lg:p-[65px]">
        <div className="flex flex-col items-center gap-8 sm:gap-[60px] w-full max-w-[678px]">
          <div className="flex flex-col self-start w-full text-left">
            <h1 className="font-medium text-2xl sm:text-3xl lg:text-4xl">
              반가워요! 🤗
            </h1>
            <div className="text-base sm:text-xl lg:text-2xl flex flex-wrap items-center">
              <p className="font-asimovian text-main-200 text-xl sm:text-2xl lg:text-[32px]">
                PortPick
              </p>
              을 통해 포트폴리오를 공유하고 피드백 받아봐요!
            </div>
          </div>
          <div className="flex flex-col items-center gap-5 sm:gap-[30px] w-full">
            <button className="flex items-center justify-center gap-[14px] bg-[#F7F7F7] dark:bg-[#2A2A2A] rounded-[10px] border border-[#E0E0E0] dark:border-[#3A3A3A] shadow-xl w-full h-12 sm:h-[58px] p-[18px] cursor-pointer hover:bg-[#E0E0E0] dark:hover:bg-[#3A3A3A] transition-colors">
              <Google />
              <span className="text-base sm:text-xl text-black dark:text-white">
                Google 계정으로 로그인
              </span>
            </button>
            <Link href="/signup">회원가입 하러 가기</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
