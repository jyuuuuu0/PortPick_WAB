import Logo from "@/shared/ui/Logo";
import Link from "next/link";

interface CompleteStepProps {
  name: string;
}

/**
 * 회원가입 완료 안내 및 홈 이동.
 */
export default function CompleteStep({ name }: CompleteStepProps) {
  return (
    <div className="flex flex-col items-center gap-8 w-full text-center">
      <Logo />
      <div className="flex flex-col gap-1 text-base">
        <p>
          <span className="text-main-300">{name || "회원"}</span>님 회원가입이
          완료되었습니다.
        </p>
        <p>
          <span className="font-asimovian text-main-300">PortPick</span>에서
          포트폴리오를 공유하고
          피드백 받아봐요!
        </p>
      </div>
      <Link
        href="/"
        className="flex items-center justify-center w-full h-[34px] rounded-[8px] bg-main-200 text-sm font-medium text-white hover:bg-main-300 transition-colors"
      >
        홈으로 이동하기
      </Link>
    </div>
  );
}
