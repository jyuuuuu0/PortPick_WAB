"use client";

import AuthBackground from "@/shared/ui/AuthBackground";
import Card from "@/shared/ui/Card";
import { CareerStep, CompleteStep, NameStep, ProfileStep } from "@/widgets/signup";
import { useSignupForm } from "../model/useSignupForm";
import NavButton from "./NavButton";

export default function SignupView() {
  const { step, form, update, canProceed, goNext, goPrev, goToStep } =
    useSignupForm();

  // 왼쪽 화살표: 2·3단계 / 오른쪽 화살표: 1·2단계 (프로필/완료 단계는 자체 버튼으로 이동)
  const showPrev = step === 1 || step === 2;
  const showNext = step === 0 || step === 1;

  return (
    <AuthBackground>
      <div className="relative z-10 flex items-center gap-2 sm:gap-6">
        <NavButton
          direction="left"
          onClick={goPrev}
          visible={showPrev}
          label="이전 단계"
        />

        <Card className="w-[86vw] max-w-[560px] flex flex-col items-center p-8 sm:p-12">
          {step === 0 && (
            <NameStep name={form.name} onChangeName={update("name")} />
          )}
          {step === 1 && (
            <CareerStep
              name={form.name}
              workplace={form.workplace}
              jobGroup={form.jobGroup}
              careerType={form.careerType}
              careerYears={form.careerYears}
              onChangeWorkplace={update("workplace")}
              onChangeJobGroup={update("jobGroup")}
              onChangeCareerType={update("careerType")}
              onChangeCareerYears={update("careerYears")}
            />
          )}
          {step === 2 && (
            <ProfileStep
              name={form.name}
              profileImage={form.profileImage}
              onSelectImage={update("profileImage")}
              onComplete={() => goToStep(3)}
              onSkip={() => {
                update("profileImage")("");
                goToStep(3);
              }}
            />
          )}
          {step === 3 && <CompleteStep name={form.name} />}
        </Card>

        <NavButton
          direction="right"
          onClick={goNext}
          visible={showNext}
          disabled={!canProceed}
          label="다음 단계"
          float={canProceed}
        />
      </div>
    </AuthBackground>
  );
}
