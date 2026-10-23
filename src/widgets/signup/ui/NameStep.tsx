import Input from "@/shared/ui/Input";
import Logo from "@/shared/ui/Logo";

interface NameStepProps {
  name: string;
  onChangeName: (value: string) => void;
}

/**
 * 회원가입 1단계 - 이름 입력.
 */
export default function NameStep({ name, onChangeName }: NameStepProps) {
  return (
    <div className="flex flex-col items-center gap-8 w-full text-center">
      <Logo />
      <div className="flex flex-col gap-1 text-base">
        <p>
          안녕하세요!{" "}
          <span className="font-asimovian text-main-200">PortPick</span>에
          가입해주셔서
          감사합니다.
        </p>
        <p>사용자의 이름을 알려주세요!</p>
      </div>
      <Input
        value={name}
        onChange={(event) => onChangeName(event.target.value)}
        placeholder="이름을 입력해주세요"
        autoFocus
      />
    </div>
  );
}
