import Input from "@/shared/ui/Input";
import Logo from "@/shared/ui/Logo";
import Select from "@/shared/ui/Select";
import {
  CAREER_TYPE_OPTIONS,
  CAREER_YEAR_OPTIONS,
  JOB_OPTIONS,
} from "../model/careerOptions";

interface CareerStepProps {
  name: string;
  workplace: string;
  jobGroup: string;
  careerType: string;
  careerYears: string;
  onChangeWorkplace: (value: string) => void;
  onChangeJobGroup: (value: string) => void;
  onChangeCareerType: (value: string) => void;
  onChangeCareerYears: (value: string) => void;
}

/**
 * 회원가입 2단계 - 직장, 직군, 경력 입력.
 * 경력은 신입/경력을 먼저 고르고, 경력을 선택하면 년차를 추가로 선택한다.
 */
export default function CareerStep({
  name,
  workplace,
  jobGroup,
  careerType,
  careerYears,
  onChangeWorkplace,
  onChangeJobGroup,
  onChangeCareerType,
  onChangeCareerYears,
}: CareerStepProps) {
  const isExperienced = careerType === "EXPERIENCED";

  return (
    <div className="flex flex-col items-center gap-8 w-full text-center">
      <Logo />
      <p className="text-base">
        <span className="text-main-300">{name || "회원"}</span>님의 직장과 직군,
        경력을 알려주세요!
      </p>
      <div className="flex flex-col gap-4 w-full">
        <Input
          value={workplace}
          onChange={(event) => onChangeWorkplace(event.target.value)}
          placeholder="ex) 광주소프트웨어마이스터고, 인프랩"
          autoFocus
        />
        <div className="flex gap-4">
          <Select
            options={JOB_OPTIONS}
            placeholder="직군"
            value={jobGroup}
            onChange={onChangeJobGroup}
          />
          <Select
            options={CAREER_TYPE_OPTIONS}
            placeholder="경력"
            value={careerType}
            onChange={(next) => {
              onChangeCareerType(next);
              // 신입으로 바꾸면 이전에 고른 년차는 초기화
              if (next !== "EXPERIENCED") onChangeCareerYears("");
            }}
          />
        </div>
        {isExperienced && (
          <Select
            options={CAREER_YEAR_OPTIONS}
            placeholder="년차 선택"
            value={careerYears}
            onChange={onChangeCareerYears}
          />
        )}
      </div>
    </div>
  );
}
