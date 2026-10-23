import type { SelectOption } from "@/shared/ui/Select";

// value 는 백엔드 enum 이름과 1:1 로 맞춘다.
export const JOB_OPTIONS: SelectOption[] = [
  { label: "Front-end", value: "FRONT_END" },
  { label: "Back-end", value: "BACK_END" },
  { label: "iOS", value: "IOS" },
  { label: "Android", value: "ANDROID" },
  { label: "Flutter", value: "FLUTTER" },
  { label: "React Native", value: "REACT_NATIVE" },
  { label: "DevOps", value: "DEVOPS" },
  { label: "AI", value: "AI" },
  { label: "Data Engineer", value: "DATA_ENGINEER" },
  { label: "UI/UX", value: "UI_UX" },
  { label: "3D Graphic", value: "GRAPHIC_3D" },
  { label: "PM/PO", value: "PM_PO" },
  { label: "IoT", value: "IOT" },
  { label: "Game", value: "GAME" },
  { label: "Security Engineer", value: "SECURITY_ENGINEER" },
  { label: "IT Engineer", value: "IT_ENGINEER" },
  { label: "Cloud Engineer", value: "CLOUD_ENGINEER" },
  { label: "그 외", value: "OTHER" },
];

export const CAREER_TYPE_OPTIONS: SelectOption[] = [
  { label: "신입", value: "NEWCOMER" },
  { label: "경력", value: "EXPERIENCED" },
];

export const CAREER_RANGE_OPTIONS: SelectOption[] = [
  { label: "1년 ~ 3년", value: "YEAR_1_TO_3" },
  { label: "4년 ~ 7년", value: "YEAR_4_TO_7" },
  { label: "8년 ~", value: "YEAR_8_PLUS" },
];

const ALL_OPTIONS = [...JOB_OPTIONS, ...CAREER_TYPE_OPTIONS, ...CAREER_RANGE_OPTIONS];

/**
 * enum 값을 화면용 라벨로 바꾼다.
 * 서버가 이미 한글 라벨을 내려주는 경우도 있어 모르는 값은 그대로 보여준다.
 */
export function toLabel(value?: string | null) {
  if (!value) return "";
  return ALL_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

/** 신입이면 "신입", 경력이면 년차 구간 라벨을 돌려준다. */
export function toCareerLabel(careerType?: string | null, careerRange?: string | null) {
  if (careerType === "EXPERIENCED" && careerRange) return toLabel(careerRange);
  return toLabel(careerType);
}
