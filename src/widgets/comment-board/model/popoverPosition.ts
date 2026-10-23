import type { CSSProperties } from "react";

/**
 * 핀 위치(%)를 기준으로 팝오버가 보드 밖으로 나가지 않도록 위치를 잡는다.
 * 오른쪽 끝이면 왼쪽으로, 아래쪽이면 위로 펼친다.
 */
export function popoverPosition(xPercent: number, yPercent: number): CSSProperties {
  const openLeft = xPercent > 60;
  const openUp = yPercent > 55;
  return {
    left: `${xPercent}%`,
    top: `${yPercent}%`,
    transform: `translate(${openLeft ? "calc(-100% - 14px)" : "14px"}, ${
      openUp ? "calc(-100% + 14px)" : "-14px"
    })`,
  };
}
