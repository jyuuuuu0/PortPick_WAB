import type { PortfolioDetail } from "@/entities/portfolio";
import { FileIcon } from "@/shared/asset/svg/Icons";
import { isImageFile, toEmbedUrl } from "@/shared/lib/embed";

/**
 * 포트폴리오 본문. 임베드 링크가 있으면 iframe, 업로드 파일이면 이미지/PDF 로 보여준다.
 */
export default function PortfolioViewer({ portfolio }: { portfolio: PortfolioDetail }) {
  const { embedLink, fileUrl, originalFileName, title } = portfolio;

  if (embedLink) {
    return (
      <iframe
        src={toEmbedUrl(embedLink)}
        title={title}
        className="size-full border-0"
        allowFullScreen
      />
    );
  }

  if (fileUrl) {
    if (isImageFile(originalFileName ?? fileUrl)) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={fileUrl} alt={title} className="size-full object-contain" />
      );
    }
    return <iframe src={fileUrl} title={title} className="size-full border-0" />;
  }

  return (
    <div className="size-full flex flex-col items-center justify-center gap-2 text-gray-500">
      <FileIcon size={28} />
      <p className="text-sm">등록된 포트폴리오 파일이 없어요.</p>
    </div>
  );
}
