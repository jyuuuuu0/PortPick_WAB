import type { PortfolioDetail } from "@/entities/portfolio";
import { FileIcon } from "@/shared/asset/svg/Icons";
import { toAssetUrl } from "@/shared/lib/asset";
import { isFigmaLink, isImageFile, toEmbedUrl } from "@/shared/lib/embed";
import FigmaEmbed from "@/shared/ui/FigmaEmbed";
import PdfViewer from "./PdfViewer";

/** 업로드한 파일이 이미지인지. 이미지는 박스 없이 원래 비율 그대로 보여준다. */
export function isImagePortfolio(portfolio: PortfolioDetail) {
  return (
    !portfolio.embedLink &&
    !!portfolio.fileUrl &&
    isImageFile(portfolio.originalFileName ?? portfolio.fileUrl)
  );
}

/**
 * 포트폴리오 본문. 임베드 링크가 있으면 iframe, 업로드 파일이면 이미지/PDF 로 보여준다.
 */
export default function PortfolioViewer({ portfolio }: { portfolio: PortfolioDetail }) {
  const { embedLink, title } = portfolio;
  const fileUrl = toAssetUrl(portfolio.fileUrl);

  if (isFigmaLink(embedLink)) return <FigmaEmbed link={embedLink!} title={title} />;

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
    if (isImagePortfolio(portfolio)) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={fileUrl} alt={title} className="block w-full h-auto" />
      );
    }
    return <PdfViewer url={fileUrl} title={title} />;
  }

  return (
    <div className="size-full flex flex-col items-center justify-center gap-2 text-gray-500">
      <FileIcon size={28} />
      <p className="text-sm">등록된 포트폴리오 파일이 없어요.</p>
    </div>
  );
}
