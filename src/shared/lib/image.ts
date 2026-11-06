/** 프로필 이미지는 작게 보여주므로 이 크기 아래로 줄여서 보낸다. */
export const SAFE_IMAGE_BYTES = 1024 * 1024;

export function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("이미지를 읽지 못했어요."));
    };
    image.src = url;
  });
}

/**
 * 이미지를 긴 변 maxSide 이하로 줄이고 JPEG 로 다시 저장해 maxBytes 아래로 만든다.
 * 이미 충분히 작으면 원본을 그대로 돌려준다.
 */
export async function compressImage(file: File, maxBytes = SAFE_IMAGE_BYTES, maxSide = 800) {
  if (file.size <= maxBytes && file.type !== "image/heic") return file;

  const image = await loadImage(file);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("이미지를 처리하지 못했어요.");

  let side = maxSide;
  // 화질 → 크기 순으로 낮춰가며 제한 안에 들어올 때까지 시도한다.
  for (let attempt = 0; attempt < 6; attempt++) {
    const scale = Math.min(1, side / Math.max(image.width, image.height));
    canvas.width = Math.round(image.width * scale);
    canvas.height = Math.round(image.height * scale);
    // 투명 PNG 가 검게 변하지 않도록 흰 배경을 깐다.
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    for (const quality of [0.85, 0.7, 0.55]) {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", quality),
      );
      if (blob && blob.size <= maxBytes) {
        const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
        return new File([blob], name, { type: "image/jpeg" });
      }
    }
    side = Math.round(side * 0.7);
  }
  throw new Error("이미지 용량을 줄이지 못했어요. 더 작은 이미지를 골라주세요.");
}
