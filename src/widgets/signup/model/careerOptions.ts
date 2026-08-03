import { type SelectOption } from "@/shared/ui/Select";

export const JOB_OPTIONS: SelectOption[] = [
  { label: "Front-end", value: "front-end" },
  { label: "Back-end", value: "back-end" },
  { label: "iOS", value: "ios" },
  { label: "Android", value: "android" },
  { label: "Flutter", value: "flutter" },
  { label: "React Native", value: "react-native" },
  { label: "DevOps", value: "devops" },
  { label: "AI", value: "ai" },
  { label: "Data Engineer", value: "data-engineer" },
  { label: "UI/UX", value: "ui-ux" },
  { label: "3D Graphic", value: "3d-graphic" },
  { label: "PM/PO", value: "pm-po" },
  { label: "IoT", value: "iot" },
  { label: "Game", value: "game" },
  { label: "Security Engineer", value: "security-engineer" },
  { label: "IT Engineer", value: "it-engineer" },
  { label: "Cloud Engineer", value: "cloud-engineer" },
  { label: "그 외", value: "etc" },
];

export const CAREER_TYPE_OPTIONS: SelectOption[] = [
  { label: "신입", value: "junior" },
  { label: "경력", value: "experienced" },
];

export const CAREER_YEAR_OPTIONS: SelectOption[] = [
  { label: "1년 ~ 3년", value: "1-3" },
  { label: "4년 ~ 7년", value: "4-7" },
  { label: "8년 ~", value: "8+" },
];
