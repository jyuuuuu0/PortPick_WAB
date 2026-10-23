import PortfolioDetailView from "@/views/portfolio/ui/PortfolioDetailView";

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ portfolioId: string }>;
}) {
  const { portfolioId } = await params;
  return <PortfolioDetailView id={Number(portfolioId)} />;
}
