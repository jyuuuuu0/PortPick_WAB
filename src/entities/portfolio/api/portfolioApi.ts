import { api } from "@/shared/api/client";
import type {
  PortfolioCreate,
  PortfolioDetail,
  PortfolioFilter,
  PortfolioLike,
  PortfolioSummary,
} from "../model/types";

export async function getPortfolios(filter: PortfolioFilter) {
  // 빈 값은 보내지 않아야 서버가 "전체"로 처리한다.
  const params = Object.fromEntries(Object.entries(filter).filter(([, value]) => value));
  const { data } = await api.get<PortfolioSummary[]>("/portfolios", { params });
  return data;
}

export async function getPortfolio(id: number) {
  const { data } = await api.get<PortfolioDetail>(`/portfolios/${id}`);
  return data;
}

export async function createPortfolio(input: PortfolioCreate) {
  const formData = new FormData();
  formData.append("title", input.title);
  formData.append("description", input.description);
  if (input.embedLink) formData.append("embedLink", input.embedLink);
  if (input.file) formData.append("file", input.file);
  const { data } = await api.post<PortfolioDetail>("/portfolios", formData);
  return data;
}

export async function deletePortfolio(id: number) {
  await api.delete(`/portfolios/${id}`);
}

export async function likePortfolio(id: number, like: boolean) {
  const url = `/portfolios/${id}/likes`;
  const { data } = like
    ? await api.post<PortfolioLike>(url)
    : await api.delete<PortfolioLike>(url);
  return data;
}

export type MyPortfolioTab = "portfolios" | "liked-portfolios" | "commented-portfolios";

export async function getMyPagePortfolios(tab: MyPortfolioTab) {
  const { data } = await api.get<PortfolioSummary[]>(`/mypage/${tab}`);
  return data;
}
