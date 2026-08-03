import Arrow from "@/shared/asset/svg/Arrow";

interface NavButtonProps {
  direction: "left" | "right";
  onClick: () => void;
  visible: boolean;
  disabled?: boolean;
  label: string;
  /** 다음으로 넘어갈 수 있는 상태가 되면 버튼이 위로 떠올라 둥둥 떠다닌다 */
  float?: boolean;
}

export default function NavButton({
  direction,
  onClick,
  visible,
  disabled,
  label,
  float,
}: NavButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      // 숨김 상태에서도 자리를 유지해 카드가 항상 중앙에 오도록 invisible 처리
      className={`shrink-0 p-2 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity cursor-pointer ${
        float ? "float-up" : ""
      } ${visible ? "" : "invisible"}`}
    >
      <Arrow className={direction === "left" ? "-scale-x-100" : ""} />
    </button>
  );
}
