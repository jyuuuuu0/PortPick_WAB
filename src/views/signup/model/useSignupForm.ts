import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { completeSignup, useAuthStatus, userKeys } from "@/entities/user";
import { getErrorMessage } from "@/shared/api/client";
import type { SignupForm } from "./types";

export const LAST_STEP = 3;
const PROFILE_STEP = 2;

const INITIAL_FORM: SignupForm = {
  name: "",
  workplace: "",
  jobGroup: "",
  careerType: "",
  careerYears: "",
  profileImage: "",
  profileImageFile: null,
};

/**
 * 회원가입 폼 상태와 단계 이동 로직을 관리한다.
 * 각 단계별 입력값, 다음 버튼 활성화 조건, 이전/다음 이동, 최종 가입 요청을 제공한다.
 */
export function useSignupForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: auth } = useAuthStatus();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<SignupForm>(INITIAL_FORM);
  const prefilled = useRef(false);

  // 비로그인이면 로그인으로, 이미 가입을 마쳤으면 홈으로 보낸다. (완료 화면은 예외)
  useEffect(() => {
    if (!auth || step === LAST_STEP) return;
    if (!auth.authenticated) router.replace("/signin");
    else if (auth.signupCompleted) router.replace("/");
  }, [auth, router, step]);

  // 구글 계정 이름을 기본값으로 채워둔다.
  useEffect(() => {
    if (prefilled.current || !auth?.name) return;
    prefilled.current = true;
    setForm((prev) => (prev.name ? prev : { ...prev, name: auth.name ?? "" }));
  }, [auth]);

  // 미리보기 URL 은 바뀌거나 화면을 떠날 때 해제한다.
  useEffect(() => {
    const url = form.profileImage;
    return () => {
      if (url.startsWith("blob:")) URL.revokeObjectURL(url);
    };
  }, [form.profileImage]);

  const update =
    <K extends keyof SignupForm>(key: K) =>
    (value: SignupForm[K]) =>
      setForm((prev) => ({ ...prev, [key]: value }));

  const selectProfileImage = (file: File | null) =>
    setForm((prev) => ({
      ...prev,
      profileImageFile: file,
      profileImage: file ? URL.createObjectURL(file) : "",
    }));

  const signup = useMutation({
    mutationFn: (withImage: boolean) => {
      const workplace = form.workplace.trim();
      return completeSignup({
        name: form.name.trim(),
        organizationName: workplace || undefined,
        noOrganization: workplace === "",
        jobRole: form.jobGroup,
        careerType: form.careerType,
        careerRange: form.careerType === "EXPERIENCED" ? form.careerYears : undefined,
        profileImage: withImage ? form.profileImageFile : null,
      });
    },
    onSuccess: () => {
      setStep(LAST_STEP);
      queryClient.invalidateQueries({ queryKey: userKeys.auth });
      queryClient.invalidateQueries({ queryKey: userKeys.profile });
    },
    onError: (error) => toast.error(getErrorMessage(error, "회원가입에 실패했어요.")),
  });

  // 단계별 다음 버튼 활성화 조건
  const canProceed = (() => {
    if (step === 0) return form.name.trim().length > 0;
    if (step === 1)
      return (
        form.jobGroup !== "" &&
        form.careerType !== "" &&
        (form.careerType !== "EXPERIENCED" || form.careerYears !== "")
      );
    return true;
  })();

  const goNext = () => {
    if (canProceed && step < PROFILE_STEP) setStep((prev) => prev + 1);
  };
  const goPrev = () => {
    if (step > 0 && step < LAST_STEP) setStep((prev) => prev - 1);
  };

  return {
    step,
    form,
    update,
    selectProfileImage,
    canProceed,
    goNext,
    goPrev,
    submit: (withImage: boolean) => signup.mutate(withImage),
    submitting: signup.isPending,
  };
}
