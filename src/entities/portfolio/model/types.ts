export interface PortfolioAuthor {
  name: string;
  career?: string;
  jobRole?: string;
}

export interface PortfolioSummary {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
  author: PortfolioAuthor;
  likeCount: number;
  liked: boolean;
}

export interface PortfolioDetail extends PortfolioSummary {
  embedLink?: string;
  fileUrl?: string;
  originalFileName?: string;
}

export interface PortfolioFilter {
  jobRole?: string;
  careerType?: string;
  careerRange?: string;
}

export interface PortfolioCreate {
  title: string;
  description: string;
  embedLink?: string;
  file?: File | null;
}

export interface PortfolioLike {
  portfolioId: number;
  likeCount: number;
  liked: boolean;
}
