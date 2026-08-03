import { useState } from "react";
import type { SignupForm } from "./types";

export const LAST_STEP = 3;

const INITIAL_FORM: SignupForm = {
  name: "",
  workplace: "",
  jobGroup: "",
  careerType: "",
  careerYears: "",
  profileImage: "",
};

/**
 * 회원가입 폼 상태와 단계 이동 로직을 관리한다.
 * 각 단계별 입력값, 다음 버튼 활성화 조건, 이전/다음 이동을 제공한다.
 */
export function useSignupForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<SignupForm>(INITIAL_FORM);

  const update =
    <K extends keyof SignupForm>(key: K) =>
    (value: SignupForm[K]) =>
      setForm((prev) => ({ ...prev, [key]: value }));

  // 단계별 다음 버튼 활성화 조건
  const canProceed = (() => {
    if (step === 0) return form.name.trim().length > 0;
    if (step === 1)
      return (
        form.jobGroup !== "" &&
        form.careerType !== "" &&
        (form.careerType !== "experienced" || form.careerYears !== "")
      );
    return true;
  })();

  const goNext = () => {
    if (canProceed && step < LAST_STEP) setStep((prev) => prev + 1);
  };
  const goPrev = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };
  const goToStep = (next: number) => setStep(next);

  return { step, form, update, canProceed, goNext, goPrev, goToStep };
}
